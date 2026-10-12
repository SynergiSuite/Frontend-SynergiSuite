import React, { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Inbox } from "lucide-react";
import TaskCard from "./taskcard";
import { Task } from "./schemas/task";
import { Team } from "@/app/projects/schemas/team";
import ViewAndEditModal, { type TaskViewEditPayload } from "./viewAndEdit";
import DeleteTaskModal from "./deleteTask";
import TaskDetailModal from "./taskDetailModal";
import {
  filterTasks,
  getStatusConfig,
  normalizeTaskStatus,
  TASK_STATUS_OPTIONS,
} from "./task-utils";

type TaskKanbanProps = {
  searchQuery: string;
  statusFilter: string;
  dueFilter: string;
  priorityFilter?: string;
  assignmentFilter?: string;
  teams?: Team[];
  tasks: Task[];
  onUpdateTask: (
    payload: TaskViewEditPayload,
    options?: { showSuccessToast?: boolean }
  ) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void> | void;
  onAddTask?: (status?: string) => void;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  statusOptions?: string[];
};

export default function TaskKanban({
  searchQuery,
  statusFilter,
  dueFilter,
  priorityFilter = "all",
  assignmentFilter = "all",
  teams = [],
  tasks,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
  canEditTasks,
  canDeleteTasks,
  statusOptions = TASK_STATUS_OPTIONS,
}: TaskKanbanProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<string | null>(null);
  const [pendingTaskIds, setPendingTaskIds] = useState<string[]>([]);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const filteredTasks = useMemo(
    () =>
      filterTasks({
        tasks: localTasks,
        searchQuery,
        statusFilter,
        dueFilter,
        priorityFilter,
        assignmentFilter,
      }),
    [dueFilter, priorityFilter, assignmentFilter, searchQuery, statusFilter, localTasks]
  );

  const columns = useMemo(
    () =>
      statusOptions.map((status) => ({
        status,
        config: getStatusConfig(status),
        tasks: filteredTasks.filter(
          (task) => normalizeTaskStatus(task.status) === status
        ),
      })),
    [filteredTasks, statusOptions]
  );

  const boardKey = `${statusFilter}-${dueFilter}-${priorityFilter}-${assignmentFilter}-${searchQuery}`;

  const handleDrop = async (targetStatus: string, taskId?: string) => {
    if (!canEditTasks) {
      return;
    }

    const activeTaskId = taskId ?? draggedTaskId;
    if (!activeTaskId) {
      return;
    }

    const task = localTasks.find((item) => item.id === activeTaskId);
    if (!task) {
      setDraggedTaskId(null);
      setDropTargetStatus(null);
      return;
    }

    const normalizedCurrentStatus = normalizeTaskStatus(task.status);
    if (normalizedCurrentStatus === targetStatus) {
      setDraggedTaskId(null);
      setDropTargetStatus(null);
      return;
    }

    // Save previous state for rollback on API failure
    const previousTasks = [...localTasks];

    // Optimistically update card position in local state immediately
    setLocalTasks((prev) =>
      prev.map((t) => (t.id === activeTaskId ? { ...t, status: targetStatus } : t))
    );

    setPendingTaskIds((prev) => [...prev, activeTaskId]);
    setDraggedTaskId(null);
    setDropTargetStatus(null);

    try {
      await onUpdateTask(
        {
          id: task.id,
          title: task.title,
          description: task.description,
          due_date: task.due_date,
          dueDate: task.due_date,
          status: targetStatus,
          priority: task.priority,
          teamId: task.teams?.[0]?.id,
          assigneeId: task.assignee?.user_id,
        },
        {
          showSuccessToast: false,
        }
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
      // Rollback on error
      setLocalTasks(previousTasks);
    } finally {
      setPendingTaskIds((prev) => prev.filter((id) => id !== activeTaskId));
    }
  };

  return (
    <>
      <AnimatePresence mode="sync">
        <div className="h-full min-h-0 max-w-full overflow-x-auto overflow-y-hidden pb-3 custom-scrollbar">
          <motion.div
            key={boardKey}
            className="flex h-full min-h-0 w-max min-w-full gap-4"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05, delayChildren: 0.04 },
              },
            }}
          >
            {columns.map((column) => {
              const isDropActive = dropTargetStatus === column.status;
              return (
                <motion.section
                  key={column.status}
                  className={`flex h-full min-h-0 w-[min(340px,calc(100vw-3rem))] shrink-0 flex-col rounded-2xl border transition-all duration-200 sm:w-[340px] ${
                    isDropActive
                      ? "border-primary/60 bg-v2-neutral-600/90 shadow-lg ring-2 ring-primary/20"
                      : "border-v2-neutral-500/70 bg-v2-neutral-700/40"
                  }`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    if (draggedTaskId) {
                      setDropTargetStatus(column.status);
                    }
                  }}
                  onDragLeave={() => {
                    if (dropTargetStatus === column.status) {
                      setDropTargetStatus(null);
                    }
                  }}
                  onDrop={async (event) => {
                    event.preventDefault();
                    const taskId = event.dataTransfer.getData("text/plain");
                    await handleDrop(column.status, taskId);
                  }}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.24, ease: "easeOut" },
                    },
                  }}
                >
                  {/* ClickUp Column Header */}
                  <div className="flex shrink-0 items-center justify-between border-b border-v2-neutral-500/60 p-3.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="size-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: column.config.dotColor }}
                      />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-v2-neutral-200 truncate">
                        {column.config.label}
                      </h3>
                      <span className="grid size-5 place-items-center rounded-full bg-v2-neutral-600 text-[10px] font-bold text-v2-neutral-300 border border-v2-neutral-500">
                        {column.tasks.length}
                      </span>
                    </div>

                    {/* Inline Quick Add button */}
                    {canEditTasks && onAddTask && (
                      <button
                        type="button"
                        onClick={() => onAddTask(column.status)}
                        title={`Add task to ${column.config.label}`}
                        className="p-1 rounded-lg text-v2-neutral-400 hover:text-v2-neutral-100 hover:bg-v2-neutral-600/60 transition-colors cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Task Column Cards list */}
                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 custom-scrollbar">
                    {column.tasks.length > 0 ? (
                      column.tasks.map((task) => (
                        <motion.div
                          key={task.id}
                          whileHover={{ y: -2 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 22,
                          }}
                        >
                          <TaskCard
                            id={task.id}
                            title={task.title}
                            desc={task.description}
                            due={task.due_date}
                            priority={task.priority}
                            status={task.status}
                            assignee={task.assignee}
                            teams={task.teams}
                            onClick={() => setSelectedTask(task)}
                            onDeleteClick={
                              canDeleteTasks
                                ? (taskId) => setDeleteTaskId(taskId)
                                : undefined
                            }
                            canDelete={canDeleteTasks}
                            draggable={canEditTasks && !pendingTaskIds.includes(task.id)}
                            onDragStart={(event) => {
                              event.dataTransfer.effectAllowed = "move";
                              event.dataTransfer.setData("text/plain", task.id);
                              setDraggedTaskId(task.id);
                            }}
                            onDragEnd={() => {
                              setDraggedTaskId(null);
                              setDropTargetStatus(null);
                            }}
                          />
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-v2-neutral-500/50 bg-v2-neutral-600/20 px-4 py-10 text-center">
                        <Inbox className="size-5 text-v2-neutral-400 mb-1.5 opacity-50" />
                        <span className="text-xs text-v2-neutral-400 font-medium">
                          No tasks in this stage
                        </span>
                        {canEditTasks && onAddTask && (
                          <button
                            type="button"
                            onClick={() => onAddTask(column.status)}
                            className="mt-2 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                          >
                            + Add a task
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.section>
              );
            })}
          </motion.div>
        </div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedTask ? (
          <TaskDetailModal
            task={selectedTask}
            canEdit={canEditTasks}
            onClose={() => setSelectedTask(null)}
            onEdit={() => {
              setEditingTask(selectedTask);
              setSelectedTask(null);
            }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {editingTask ? (
          <ViewAndEditModal
            data={{
              id: editingTask.id,
              title: editingTask.title,
              description: editingTask.description,
              due_date: editingTask.due_date,
              status: editingTask.status,
              priority: editingTask.priority,
              assignee: editingTask.assignee,
              teams: editingTask.teams,
            }}
            availableTeams={teams}
            onCancel={() => setEditingTask(null)}
            onSave={async (payload) => {
              await onUpdateTask(payload);
              setEditingTask(null);
            }}
            statusOptions={statusOptions}
            canEdit={canEditTasks}
          />
        ) : null}
      </AnimatePresence>

      {canDeleteTasks ? (
        <DeleteTaskModal
          open={deleteTaskId !== null}
          taskId={deleteTaskId}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteTaskId(null);
            }
          }}
          onConfirm={(taskId) => {
            onDeleteTask(taskId);
            setDeleteTaskId(null);
          }}
        />
      ) : null}
    </>
  );
}
