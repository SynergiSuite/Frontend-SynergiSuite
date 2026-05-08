import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TaskCard from "./taskcard";
import { Task } from "./schemas/task";
import ViewAndEditModal, { type TaskViewEditPayload } from "./viewAndEdit";
import DeleteTaskModal from "./deleteTask";
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
        <div className="max-w-full overflow-x-auto pb-4">
          <motion.div
            key={boardKey}
            className="flex w-max min-w-full gap-4"
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
                className={`min-h-[calc(100vh-240px)] w-[360px] shrink-0 rounded-xl border p-3 transition-colors ${
                  dropTargetStatus === column.status
                    ? "border-blue-400 bg-blue-50/70"
                    : "border-gray-200 bg-gray-50/80"
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
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {formatTaskLabel(column.status)}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {column.tasks.length} task
                      {column.tasks.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-white px-2 py-1 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200">
                    {column.tasks.length}
                  </span>
                </div>

                <div className="space-y-3">
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
                          onClick={canEditTasks ? () => setSelectedTask(task) : undefined}
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
                    <div className="rounded-lg border border-dashed border-gray-200 bg-white/70 px-3 py-6 text-center text-sm text-gray-500">
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
        {selectedTask && canEditTasks ? (
          <ViewAndEditModal
            data={{
              id: selectedTask.id,
              title: selectedTask.title,
              description: selectedTask.description,
              due_date: selectedTask.due_date,
              status: selectedTask.status,
              priority: selectedTask.priority,
              teams: selectedTask.teams,
            }}
            onCancel={() => setSelectedTask(null)}
            onSave={async (payload) => {
              await onUpdateTask(payload);
              setSelectedTask(null);
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
