import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TaskCard from "./taskcard";
import { Task } from "./schemas/task";
import ViewAndEditModal, { type TaskViewEditPayload } from "./viewAndEdit";
import DeleteTaskModal from "./deleteTask";
import TaskDetailModal from "./taskDetailModal";
import {
  filterTasks,
  formatTaskLabel,
  normalizeTaskStatus,
  TASK_STATUS_OPTIONS,
} from "./task-utils";

type TaskKanbanProps = {
  searchQuery: string;
  statusFilter: string;
  dueFilter: string;
  tasks: Task[];
  onUpdateTask: (
    payload: TaskViewEditPayload,
    options?: { showSuccessToast?: boolean }
  ) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void> | void;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  statusOptions?: string[];
};

export default function TaskKanban({
  searchQuery,
  statusFilter,
  dueFilter,
  tasks,
  onUpdateTask,
  onDeleteTask,
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

  const filteredTasks = useMemo(
    () =>
      filterTasks({
        tasks,
        searchQuery,
        statusFilter,
        dueFilter,
      }),
    [dueFilter, searchQuery, statusFilter, tasks]
  );

  const columns = useMemo(
    () =>
      statusOptions.map((status) => ({
        status,
        tasks: filteredTasks.filter(
          (task) => normalizeTaskStatus(task.status) === status
        ),
      })),
    [filteredTasks, statusOptions]
  );

  const boardKey = `${statusFilter}-${dueFilter}-${searchQuery}`;

  const handleDrop = async (targetStatus: string, taskId?: string) => {
    if (!canEditTasks) {
      return;
    }

    const activeTaskId = taskId ?? draggedTaskId;
    if (!activeTaskId) {
      return;
    }

    const task = tasks.find((item) => item.id === activeTaskId);
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

    setPendingTaskIds((prev) => [...prev, task.id]);

    try {
      await onUpdateTask({
        id: task.id,
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        status: targetStatus,
        priority: task.priority,
      }, {
        showSuccessToast: false,
      });
    } finally {
      setPendingTaskIds((prev) => prev.filter((id) => id !== task.id));
      setDraggedTaskId(null);
      setDropTargetStatus(null);
    }
  };

  return (
    <>
      <AnimatePresence mode="sync">
        <div className="h-full min-h-0 max-w-full overflow-x-auto overflow-y-hidden pb-2">
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
            {columns.map((column) => (
              <motion.section
                key={column.status}
                className={`flex h-full min-h-0 w-[min(360px,calc(100vw-3rem))] shrink-0 flex-col rounded-2xl border p-4 transition-all duration-300 task-animate-item opacity-0 sm:w-[360px] ${
                  dropTargetStatus === column.status
                    ? "border-[#5271ff]/50 bg-[#0a0826]/80 shadow-[0_0_20px_rgba(82,113,255,0.2)]"
                    : "border-white/[0.04] bg-white/[0.01]"
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
                <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white/80">
                      {formatTaskLabel(column.status)}
                    </h3>
                    <p className="text-xs text-white/40 mt-0.5 font-medium">
                      {column.tasks.length} {column.tasks.length === 1 ? "task" : "tasks"}
                    </p>
                  </div>
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#5271ff]/10 border border-[#5271ff]/20 px-1.5 text-[11px] font-bold text-[#5271ff]">
                    {column.tasks.length}
                  </span>
                </div>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                  {column.tasks.length > 0 ? (
                    column.tasks.map((task) => (
                      <motion.div
                        key={task.id}
                        whileHover={{ y: -3 }}
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
                          assigned_to={task.teams.map((team) => team.name)}
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
                    <div className="rounded-xl border border-dashed border-white/[0.08] bg-[#030114]/20 px-3 py-8 text-center text-xs text-white/30 font-medium">
                      No tasks in this column
                    </div>
                  )}
                </div>
              </motion.section>
            ))}
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
        {editingTask && canEditTasks ? (
          <ViewAndEditModal
            data={{
              id: editingTask.id,
              title: editingTask.title,
              description: editingTask.description,
              due_date: editingTask.due_date,
              status: editingTask.status,
              priority: editingTask.priority,
              teams: editingTask.teams,
            }}
            onCancel={() => setEditingTask(null)}
            onSave={async (payload) => {
              await onUpdateTask(payload);
              setEditingTask(null);
            }}
            statusOptions={statusOptions}
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
