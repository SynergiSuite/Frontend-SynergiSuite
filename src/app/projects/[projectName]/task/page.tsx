"use client";

import React, { useEffect, useLayoutEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  FolderKanban,
} from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

import LoaderCustom from "@/components/ui/loader-custom";
import { CookieManager } from "@/lib/cookieManager";
import { Team } from "@/app/projects/schemas/team";
import { Milestone } from "../schemas/milestone";
import { Task } from "./schemas/task";
import { GetProjectDetails } from "../apis/getProjectDetails";
import { getMilestone } from "../apis/getMilestones";
import { getProjectTeams } from "./apis/getProjectTeamApi";
import { getTeamsApi } from "@/app/projects/apis/getAllTeamsApi";
import { getTeamsWithTasksApi } from "@/app/teams/apis/getTeamsWithTasksApi";
import { getBusinessTeamsWithMembersApi } from "@/app/projects/apis/getBusinessTeamsWithMembersApi";
import { getAllEmployeesApi } from "@/app/employees/apis/getAllEmployeeApi";
import { fetchTaskApi } from "./apis/fetchTasksApi";
import { createTaskApi } from "./apis/createTaskApi";
import { updateTaskApi } from "./apis/updateTaskApi";
import { deleteTaskApi } from "./apis/deleteTaskApi";
import Filters, { TaskViewMode } from "./filters";
import TaskKanban from "./taskkanban";
import TaskList from "./taskList";
import TaskGrid from "./taskgrid";
import CalendarWidget from "./calendar";
import NewTaskModal, { type NewTaskPayload } from "./createModal";
import TaskDetailModal from "./taskDetailModal";
import { TaskViewEditPayload } from "./viewAndEdit";
import {
  extractTeamMembers,
  isOverdue,
  normalizeTaskStatus,
  TASK_STATUS_OPTIONS,
} from "./task-utils";

export default function TaskPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dueFilter, setDueFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [viewMode, setViewMode] = useState<TaskViewMode>("kanban");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createInitialStatus, setCreateInitialStatus] = useState("todo");
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [projectId, setProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("");
  const [deepLinkedTask, setDeepLinkedTask] = useState<Task | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const taskIdParam = searchParams?.get("taskId");

  const rawProjectName = useParams().projectName as string;
  const projectName = decodeURIComponent(rawProjectName || "");
  const isClientRole = role.trim().toLowerCase() === "client";
  const canEditTasks = !isClientRole;
  const canDeleteTask = !isClientRole;

  const getTasks = async (resolvedProjectId: string) => {
    try {
      const res = await fetchTaskApi(resolvedProjectId);
      setTasks(res);
    } catch (error) {
      toast.error("Failed to fetch tasks: " + error);
    }
  };

  useEffect(() => {
    if (taskIdParam && tasks.length > 0 && !deepLinkedTask) {
      const match = tasks.find((t) => String(t.id) === String(taskIdParam));
      if (match) {
        setDeepLinkedTask(match);
      } else {
        toast.error("You don't have access to this item");
      }
    }
  }, [taskIdParam, tasks, deepLinkedTask]);

  useEffect(() => {
    setRole(
      String(
        CookieManager("get", "primary_role") ||
          CookieManager("get", "role") ||
          ""
      )
    );

    const initData = async () => {
      setIsLoading(true);
      try {
        const details = await GetProjectDetails(projectName);
        const resolvedId = details?.id ? String(details.id) : "";
        setProjectId(resolvedId);

        if (resolvedId) {
          await getTasks(resolvedId);

          type DetailsWithBusiness = {
            business_id?: number | string;
            business?: { id?: number | string; business_id?: number | string };
          };
          const projectDetailsObj = details as DetailsWithBusiness | null;
          const rawCookieBusinessId =
            (await CookieManager("get", "business-id")) ||
            (await CookieManager("get", "business_id"));

          const cookieBusinessId =
            typeof rawCookieBusinessId === "string" || typeof rawCookieBusinessId === "number"
              ? rawCookieBusinessId
              : undefined;

          const businessId =
            projectDetailsObj?.business_id ??
            projectDetailsObj?.business?.id ??
            projectDetailsObj?.business?.business_id ??
            cookieBusinessId;

          // 1. Fetch from the new dedicated endpoint: GET /teams/business/:business_id
          const [businessTeamsData, allCompanyTeams, teamsWithTasksRes, allEmployees] =
            await Promise.all([
              getBusinessTeamsWithMembersApi(businessId),
              getTeamsApi().catch(() => []),
              getTeamsWithTasksApi(1, 100).catch(() => ({ data: [] })),
              getAllEmployeesApi().catch(() => []),
            ]);

          let resolvedTeams: Team[] = [];

          if (businessTeamsData?.teams && businessTeamsData.teams.length > 0) {
            // New endpoint succeeded: build rich teams list with full leader and member profiles
            resolvedTeams = businessTeamsData.teams.map((t) => {
              const leader = t.leader
                ? {
                    user_id: t.leader.user_id,
                    name: t.leader.name,
                    email: t.leader.email,
                  }
                : undefined;

              const memberItems = (t.members || []).map((m) => ({
                user_id: m.user_id,
                name: m.name,
                email: m.email,
              }));

              const allMembers = [
                ...(leader ? [leader] : []),
                ...memberItems,
              ];

              const uniqueMembers = allMembers.filter(
                (m, idx, self) => idx === self.findIndex((o) => o.user_id === m.user_id)
              );

              return {
                id: t.id,
                name: t.name,
                description: t.description || undefined,
                leader,
                members: uniqueMembers,
              };
            });
          } else {
            // Fallback if business_id endpoint was unavailable
            let projectTeams: Team[] = [];
            try {
              projectTeams = await getProjectTeams(resolvedId);
            } catch {
              projectTeams = [];
            }

            type SquadRecord = Team & { teamMembers?: unknown[] };
            const squadMap = new Map<string, SquadRecord>();
            for (const t of allCompanyTeams) {
              if (t?.id) squadMap.set(String(t.id), t);
            }
            for (const t of (teamsWithTasksRes?.data || [])) {
              if (t?.id) {
                const prev = squadMap.get(String(t.id)) || ({} as SquadRecord);
                squadMap.set(String(t.id), {
                  ...prev,
                  ...t,
                  members: t.members?.length
                    ? (t.members as unknown as typeof prev.members)
                    : prev.members,
                  teamMembers: t.teamMembers?.length ? t.teamMembers : prev.teamMembers,
                });
              }
            }
            for (const t of projectTeams) {
              if (t?.id) {
                const prev = squadMap.get(String(t.id)) || ({} as SquadRecord);
                squadMap.set(String(t.id), {
                  ...prev,
                  ...t,
                  members: t.members?.length ? t.members : prev.members,
                });
              }
            }
            for (const t of (details?.teams || [])) {
              if (t?.id) {
                const prev = squadMap.get(String(t.id)) || ({} as SquadRecord);
                squadMap.set(String(t.id), {
                  ...prev,
                  ...t,
                  members: t.members?.length ? t.members : prev.members,
                });
              }
            }

            const allSquadsList = Array.from(squadMap.values());
            resolvedTeams = allSquadsList.map((team) => {
              const extracted = extractTeamMembers(team, allEmployees);
              return {
                ...team,
                members: extracted.map((m) => ({
                  user_id: m.user_id,
                  name: m.name,
                  email: m.email,
                })),
              };
            });
          }

          setTeams(resolvedTeams);

          const milestoneData = await getMilestone(resolvedId);
          setMilestones(milestoneData);
        }
      } catch (error) {
        console.error("Error initializing task page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectName) {
      initData();
    }
  }, [projectName]);

  // GSAP Entrance Animations
  useLayoutEffect(() => {
    if (isLoading || !containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-task-section]",
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading, viewMode]);

  const handleOpenCreateWithStatus = (status?: string) => {
    setCreateInitialStatus(status || "todo");
    setIsCreateOpen(true);
  };

  const handleCreateTask = async (payload: NewTaskPayload) => {
    if (!canEditTasks) {
      toast.error("Clients are not allowed to create tasks.");
      return;
    }
    try {
      await createTaskApi({
        projectId: payload.projectId || projectId,
        title: payload.title,
        description: payload.description,
        status: payload.status,
        priority: payload.priority,
        dueDate: payload.dueDate || payload.due_date,
        milestoneId: payload.milestoneId,
        teamId: payload.teamId,
        assigneeId: payload.assigneeId,
      });
      if (projectId) {
        await getTasks(projectId);
      }
      setIsCreateOpen(false);
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Failed to create task: " + error);
    }
  };

  const handleUpdateTask = async (
    payload: TaskViewEditPayload,
    options: { showSuccessToast?: boolean } = {}
  ) => {
    const { showSuccessToast = true } = options;
    if (!canEditTasks) {
      toast.error("Clients are not allowed to edit tasks.");
      return;
    }

    const previousTasks = [...tasks];

    // Optimistically update task in state
    setTasks((prev) =>
      prev.map((t) =>
        t.id === payload.id
          ? {
              ...t,
              title: payload.title ?? t.title,
              description: payload.description ?? t.description,
              status: payload.status ?? t.status,
              priority: payload.priority ?? t.priority,
              due_date: payload.due_date ?? t.due_date,
            }
          : t
      )
    );

    try {
      await updateTaskApi({
        id: payload.id,
        title: payload.title,
        description: payload.description,
        status: payload.status,
        priority: payload.priority,
        due_date: payload.due_date,
        teamId: payload.teamId,
        assigneeId: payload.assigneeId,
        milestoneId: payload.milestoneId,
      });
      if (projectId) {
        await getTasks(projectId);
      }
      if (showSuccessToast) {
        toast.success("Task updated successfully");
      }
    } catch (error) {
      setTasks(previousTasks);
      toast.error("Failed to update task: " + error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!canDeleteTask) {
      toast.error("Clients are not allowed to delete tasks.");
      return;
    }
    try {
      await deleteTaskApi(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task: " + error);
    }
  };

  // KPI calculations
  const totalTasks = tasks.length;
  const completedTasks = useMemo(
    () =>
      tasks.filter((t) => normalizeTaskStatus(t.status) === "completed").length,
    [tasks]
  );
  const inProgressTasks = useMemo(
    () =>
      tasks.filter((t) => normalizeTaskStatus(t.status) === "in_progress")
        .length,
    [tasks]
  );
  const overdueTasks = useMemo(
    () => tasks.filter((t) => isOverdue(t.due_date, t.status)).length,
    [tasks]
  );

  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <>
      {isLoading ? (
        <LoaderCustom />
      ) : (
        <div
          ref={containerRef}
          className="min-h-full text-v2-neutral-100 flex flex-col"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 py-2 sm:py-3 min-h-0">
            {/* Header & Breadcrumb */}
            <header
              data-task-section
              className="flex flex-col gap-4 border-b border-v2-neutral-500 pb-5"
            >
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs text-v2-neutral-400">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1 text-v2-neutral-300 hover:text-v2-neutral-100 transition-colors font-medium"
                >
                  <ChevronLeft className="size-4" />
                  Projects
                </Link>
                <span>/</span>
                <Link
                  href={`/projects/${encodeURIComponent(projectName)}/overview`}
                  className="truncate text-v2-neutral-300 hover:text-v2-neutral-100 transition-colors font-medium"
                >
                  {projectName}
                </Link>
                <span>/</span>
                <span className="text-v2-neutral-100 font-semibold">
                  Task Board
                </span>
              </div>

              {/* Title & Quick Actions */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold tracking-tight text-v2-neutral-100 sm:text-3xl">
                      Task Board
                    </h1>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-v2-neutral-500/70 bg-v2-neutral-500/30 px-2.5 py-1 text-xs font-semibold text-v2-neutral-200">
                      <FolderKanban className="size-3.5 text-sky-400" />
                      <span>{completionPercentage}% Complete</span>
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-v2-neutral-400">
                    Track sprint deliverables, squad allocations, and roadmap execution for {projectName}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Link
                    href={`/projects/${encodeURIComponent(projectName)}/overview`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-v2-neutral-500/70 bg-v2-neutral-500/30 px-3 py-2 text-xs font-semibold text-v2-neutral-200 hover:text-v2-neutral-100 hover:bg-v2-neutral-500/50 transition-colors"
                  >
                    View Overview
                  </Link>

                  {/* {canEditTasks && (
                    <Button
                      onClick={() => handleOpenCreateWithStatus("todo")}
                      className="gap-2 font-semibold shadow-md cursor-pointer"
                    >
                      <Plus className="size-4" />
                      Create Task
                    </Button>
                  )} */}
                </div>
              </div>

              {/* ClickUp-style Quick Metric Cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-1">
                <div className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-600/70 p-3 shadow-xs">
                  <span className="text-[11px] font-medium text-v2-neutral-400">
                    Total Tasks
                  </span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xl font-bold text-v2-neutral-100">
                      {totalTasks}
                    </span>
                    <FolderKanban className="size-4 text-v2-neutral-400" />
                  </div>
                </div>

                <div className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-600/70 p-3 shadow-xs">
                  <span className="text-[11px] font-medium text-v2-neutral-400">
                    In Progress
                  </span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xl font-bold text-sky-400">
                      {inProgressTasks}
                    </span>
                    <Clock3 className="size-4 text-sky-400/80" />
                  </div>
                </div>

                <div className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-600/70 p-3 shadow-xs">
                  <span className="text-[11px] font-medium text-v2-neutral-400">
                    Completed
                  </span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xl font-bold text-emerald-400">
                      {completedTasks}
                    </span>
                    <CheckCircle2 className="size-4 text-emerald-400/80" />
                  </div>
                </div>

                <div className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-600/70 p-3 shadow-xs">
                  <span className="text-[11px] font-medium text-v2-neutral-400">
                    Overdue
                  </span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span
                      className={`text-xl font-bold ${
                        overdueTasks > 0 ? "text-rose-400" : "text-v2-neutral-300"
                      }`}
                    >
                      {overdueTasks}
                    </span>
                    <AlertCircle
                      className={`size-4 ${
                        overdueTasks > 0 ? "text-rose-400" : "text-v2-neutral-400"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </header>

            {/* Filters Toolbar */}
            <Filters
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              dueFilter={dueFilter}
              priorityFilter={priorityFilter}
              assignmentFilter={assignmentFilter}
              teams={teams}
              onSearchChange={setSearchQuery}
              onStatusChange={setStatusFilter}
              onDueChange={setDueFilter}
              onPriorityChange={setPriorityFilter}
              onAssignmentChange={setAssignmentFilter}
              onAddTask={() => handleOpenCreateWithStatus("todo")}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              canManageTasks={canEditTasks}
              statusOptions={TASK_STATUS_OPTIONS}
              totalTasksCount={totalTasks}
            />

            {/* Main View Area */}
            <main
              data-task-section
              className={`flex-1 min-h-0 ${
                viewMode === "kanban"
                  ? "overflow-hidden"
                  : "overflow-y-auto custom-scrollbar"
              }`}
            >
              {viewMode === "kanban" ? (
                <TaskKanban
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                  dueFilter={dueFilter}
                  priorityFilter={priorityFilter}
                  assignmentFilter={assignmentFilter}
                  teams={teams}
                  tasks={tasks}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={handleOpenCreateWithStatus}
                  canEditTasks={canEditTasks}
                  canDeleteTasks={canDeleteTask}
                  statusOptions={TASK_STATUS_OPTIONS}
                />
              ) : viewMode === "list" ? (
                <TaskList
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                  dueFilter={dueFilter}
                  priorityFilter={priorityFilter}
                  assignmentFilter={assignmentFilter}
                  teams={teams}
                  tasks={tasks}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={handleOpenCreateWithStatus}
                  canEditTasks={canEditTasks}
                  canDeleteTasks={canDeleteTask}
                  statusOptions={TASK_STATUS_OPTIONS}
                />
              ) : viewMode === "calendar" ? (
                <CalendarWidget
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                  dueFilter={dueFilter}
                  priorityFilter={priorityFilter}
                  assignmentFilter={assignmentFilter}
                  teams={teams}
                  tasks={tasks}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  canEditTasks={canEditTasks}
                  canDeleteTasks={canDeleteTask}
                  statusOptions={TASK_STATUS_OPTIONS}
                />
              ) : (
                <TaskGrid
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                  dueFilter={dueFilter}
                  priorityFilter={priorityFilter}
                  assignmentFilter={assignmentFilter}
                  teams={teams}
                  tasks={tasks}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={() => handleOpenCreateWithStatus("todo")}
                  canEditTasks={canEditTasks}
                  canDeleteTasks={canDeleteTask}
                  statusOptions={TASK_STATUS_OPTIONS}
                />
              )}
            </main>
          </div>

          {/* Create Task Modal */}
          <AnimatePresence>
            {isCreateOpen && canEditTasks && (
              <NewTaskModal
                onCancel={() => setIsCreateOpen(false)}
                onSubmit={handleCreateTask}
                assignees={teams}
                milestones={milestones}
                projectName={projectName}
                projectId={projectId}
                initialStatus={createInitialStatus}
                statusOptions={TASK_STATUS_OPTIONS}
              />
            )}
          </AnimatePresence>

          {/* Deep linked task detail modal */}
          {deepLinkedTask && (
            <TaskDetailModal
              task={deepLinkedTask}
              canEdit={canEditTasks}
              projectId={projectId}
              onClose={() => setDeepLinkedTask(null)}
              onEdit={() => {
                setDeepLinkedTask(null);
              }}
            />
          )}
        </div>
      )}
    </>
  );
}
