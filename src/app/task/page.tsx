"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

export default function TaskPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dueFilter, setDueFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const projectName = searchParams.get("name")?.trim() || "Untitled Project";

  const getTasks = async() => {
    try {
      const res = await fetchTaskApi()
      setTasks(res)
    } catch (error) {
      toast.error("Failed to fetch tasks" + error)
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
        await Promise.all([getTasks(), getTeams()]);
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

  const handleUpdateTask = async(payload: TaskViewEditPayload) => {
    try {
      const updatedTask = await updateTaskApi(payload);
      const updatedId = updatedTask?.id ?? payload.id;
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedId ? updatedTask : task
        )
      );
      toast.success("Task updated successfully");
    } catch (error) {
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
          <div className=" flex flex-col">
            <div className="flex flex-1">
              <main className="flex-1">
                <Filters
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                  dueFilter={dueFilter}
                  onSearchChange={setSearchQuery}
                  onStatusChange={setStatusFilter}
                  onDueChange={setDueFilter}
                  onAddTask={() => setIsCreateOpen(true)}
                  teams={teams}
                />
                <TaskGrid
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                  dueFilter={dueFilter}
                  tasks={tasks}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                />
              </main>
            </div>
          </div>
          <AnimatePresence>
            {isCreateOpen && (
              <NewTaskModal
                onCancel={() => setIsCreateOpen(false)}
                onSubmit={handleCreateTask}
                assignees={teams}
                projectName={projectName}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}
