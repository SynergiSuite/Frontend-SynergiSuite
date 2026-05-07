"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Filters from "./filters";
import TaskGrid from "./taskgrid";
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
import TaskKanban from "./taskkanban";
import { TASK_STATUS_OPTIONS } from "./task-utils";

export default function TaskPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dueFilter, setDueFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "kanban">("grid");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [isLoading, setIsLoading] = useState(false);

  const projectName = useParams().projectName as string;

  const getTasks = async() => {
    try {
      const res = await fetchTaskApi()
      setTasks(res)
    } catch (error) {
      toast.error("Failed to fetch tasks" + error)
    }
  }

  const getMilestones = async() => {
    const projectId = CookieManager("get", "project-id");
    if (!projectId) {
      setMilestones([]);
      return;
    }
    try {
      const res = await getMilestone(String(projectId));
      setMilestones(res);
    } catch (error) {
      toast.error("Failed to fetch milestones" + error);
    }
  }

  useEffect(() => {
    const getTeams = async() => {
      try {
        const res = await getProjectTeams()
        setTeams(res)
      } catch (error) {
        toast.error("Failed to fetch teams" + error)
      }
    }

    const load = async() => {
      setIsLoading(true);
      try {
        await Promise.all([getTasks(), getTeams(), getMilestones()]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  },[])

  useEffect(() => {
    const handleOpenCreate = () => {
      setIsCreateOpen(true);
    };

    window.addEventListener("open-create-task", handleOpenCreate);
    return () => {
      window.removeEventListener("open-create-task", handleOpenCreate);
    };
  }, []);

  const handleCreateTask = async(data: NewTaskPayload) => {
    try {
      setIsLoading(true);
        await createTaskApi(data)
        toast.success("Task created successfully")
        await getTasks()
    } catch (error) {
        toast.error("Failed to create task" + error)
    } finally {
        setIsLoading(false);
    }
    setIsCreateOpen(false);
  };

  const handleUpdateTask = async(
    payload: TaskViewEditPayload,
    options?: { showSuccessToast?: boolean }
  ) => {
    const previousTask = tasks.find((task) => task.id === payload.id);
    if (!previousTask) {
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === payload.id
          ? {
              ...task,
              ...payload,
            }
          : task
      )
    );

    try {
      const updatedTask = await updateTaskApi(payload);
      const updatedId = updatedTask?.id ?? payload.id;
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedId
            ? {
                ...task,
                ...payload,
                ...(updatedTask ?? {}),
              }
            : task
        )
      );
      if (options?.showSuccessToast !== false) {
        toast.success("Task updated successfully");
      }
    } catch (error) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === previousTask.id ? previousTask : task
        )
      );
      toast.error("Failed to update task" + error);
    }
  };

  const handleDeleteTask = async(id: string) => {
    try {
      await deleteTaskApi(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task" + error);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoaderCustom />
      ) : (
        <>
          <div className="flex min-w-0 flex-col">
            <div className="flex min-w-0 flex-1">
              <main className="min-w-0 flex-1 overflow-hidden">
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
                  statusOptions={TASK_STATUS_OPTIONS}
                />
                {viewMode === "kanban" ? (
                  <TaskKanban
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    dueFilter={dueFilter}
                    tasks={tasks}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
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
                    statusOptions={TASK_STATUS_OPTIONS}
                  />
                )}
              </main>
            </div>
          </div>
          <AnimatePresence>
            {isCreateOpen && (
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
        </>
      )}
    </>
  );
}
