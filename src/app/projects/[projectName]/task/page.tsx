"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { gsap } from "gsap";
import Filters, { TaskViewMode } from "./filters";
import TaskGrid from "./taskgrid";
import TaskKanban from "./taskkanban";
import TaskList from "./taskList";
import CalendarWidget from "./calendar";
import NewTaskModal, { type NewTaskPayload } from "./createModal";
import { getProjectTeams } from "./apis/getProjectTeamApi";
import { Team } from "@/app/projects/schemas/team";
import { toast } from "sonner";
import { createTaskApi } from "./apis/createTaskApi";
import { fetchTaskApi } from "./apis/fetchTasksApi";
import { updateTaskApi } from "./apis/updateTaskApi";
import { deleteTaskApi } from "./apis/deleteTaskApi";
import { Task } from "./schemas/task";
import LoaderCustom from "@/components/ui/loader-custom";
import { TaskViewEditPayload } from "./viewAndEdit";
import { AnimatePresence } from "framer-motion";
import { getMilestone } from "../apis/getMilestones";
import { Milestone } from "../schemas/milestone";
import { CookieManager } from "@/lib/cookieManager";
import { TASK_STATUS_OPTIONS } from "./task-utils";
import { GetProjectDetails } from "../apis/getProjectDetails";

export default function TaskPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dueFilter, setDueFilter] = useState("all");
  const [viewMode, setViewMode] = useState<TaskViewMode>("grid");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [projectId, setProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

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
    setRole(String(CookieManager("get", "role") || ""));

    const initData = async () => {
      setIsLoading(true);
      try {
        const details = await GetProjectDetails(projectName);
        const resolvedId = details?.id ? String(details.id) : "";
        setProjectId(resolvedId);

        if (resolvedId) {
          await getTasks(resolvedId);

          const projectTeams = await getProjectTeams(resolvedId);
          setTeams(projectTeams);

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

  // GSAP Entrance Animation
  useEffect(() => {
    if (!isLoading && containerRef.current) {
      const animElements = containerRef.current.querySelectorAll(".task-animate-item");
      if (animElements.length > 0) {
        gsap.killTweensOf(animElements);
        gsap.fromTo(
          animElements,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.04,
            ease: "power2.out",
          }
        );
      }
    }
  }, [isLoading]);

  const handleCreateTask = async (payload: NewTaskPayload) => {
    if (!canEditTasks) {
      toast.error("Clients are not allowed to create tasks.");
      return;
    }
    try {
      await createTaskApi(payload);
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
    try {
      await updateTaskApi(payload);
      if (projectId) {
        await getTasks(projectId);
      }
      if (showSuccessToast) {
        toast.success("Task updated successfully");
      }
    } catch (error) {
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

  return (
    <>
      {isLoading ? (
        <LoaderCustom />
      ) : (
        <div
          ref={containerRef}
          className="relative flex h-full min-h-0 flex-col overflow-hidden text-white bg-[#030114]"
        >
          {/* Ambient radial glows */}
          <div className="absolute left-0 top-0 h-[500px] w-[500px] bg-[radial-gradient(circle_at_top_left,rgba(82,113,255,0.06),transparent_55%)] pointer-events-none" />
          <div className="absolute right-0 bottom-0 h-[400px] w-[400px] bg-[radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.04),transparent_50%)] pointer-events-none" />

          <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col p-4 sm:p-6">
            <div className="flex min-h-0 min-w-0 flex-1">
              <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <Filters
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                  dueFilter={dueFilter}
                  onSearchChange={setSearchQuery}
                  onStatusChange={setStatusFilter}
                  onDueChange={setDueFilter}
                  onAddTask={() => setIsCreateOpen(true)}
                  teams={teams}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  canManageTasks={canEditTasks}
                  statusOptions={TASK_STATUS_OPTIONS}
                />
                <div
                  className={`min-h-0 flex-1 ${
                    viewMode === "kanban"
                      ? "overflow-hidden"
                      : "overflow-y-auto overflow-x-hidden custom-scrollbar"
                  }`}
                >
                  {viewMode === "kanban" ? (
                    <TaskKanban
                      searchQuery={searchQuery}
                      statusFilter={statusFilter}
                      dueFilter={dueFilter}
                      tasks={tasks}
                      onUpdateTask={handleUpdateTask}
                      onDeleteTask={handleDeleteTask}
                      canEditTasks={canEditTasks}
                      canDeleteTasks={canDeleteTask}
                      statusOptions={TASK_STATUS_OPTIONS}
                    />
                  ) : viewMode === "list" ? (
                    <TaskList
                      searchQuery={searchQuery}
                      statusFilter={statusFilter}
                      dueFilter={dueFilter}
                      tasks={tasks}
                      onUpdateTask={handleUpdateTask}
                      onDeleteTask={handleDeleteTask}
                      canEditTasks={canEditTasks}
                      canDeleteTasks={canDeleteTask}
                      statusOptions={TASK_STATUS_OPTIONS}
                    />
                  ) : viewMode === "calendar" ? (
                    <CalendarWidget
                      searchQuery={searchQuery}
                      statusFilter={statusFilter}
                      dueFilter={dueFilter}
                      tasks={tasks}
                      onUpdateTask={handleUpdateTask}
                      onDeleteTask={handleDeleteTask}
                      canEditTasks={canEditTasks}
                      canDeleteTasks={canDeleteTask}
                      onAddTask={() => setIsCreateOpen(true)}
                      statusOptions={TASK_STATUS_OPTIONS}
                    />
                  ) : (
                    <TaskGrid
                      searchQuery={searchQuery}
                      statusFilter={statusFilter}
                      dueFilter={dueFilter}
                      tasks={tasks}
                      onUpdateTask={handleUpdateTask}
                      onDeleteTask={handleDeleteTask}
                      canEditTasks={canEditTasks}
                      canDeleteTasks={canDeleteTask}
                      statusOptions={TASK_STATUS_OPTIONS}
                    />
                  )}
                </div>
              </main>
            </div>
          </div>
          <AnimatePresence>
            {isCreateOpen && canEditTasks && (
              <NewTaskModal
                onCancel={() => setIsCreateOpen(false)}
                onSubmit={handleCreateTask}
                assignees={teams}
                milestones={milestones}
                projectName={projectName}
                statusOptions={TASK_STATUS_OPTIONS}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
