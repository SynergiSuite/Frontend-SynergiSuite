"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Inbox, Plus } from "lucide-react";
import TaskCard from "./taskcard";
import { Task } from "./schemas/task";
import { Team } from "@/app/projects/schemas/team";
import ViewAndEditModal, { type TaskViewEditPayload } from "./viewAndEdit";
import DeleteTaskModal from "./deleteTask";
import TaskDetailModal from "./taskDetailModal";
import { filterTasks, TASK_STATUS_OPTIONS } from "./task-utils";

type TaskGridProps = {
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
  onAddTask?: () => void;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  statusOptions?: string[];
};

export default function TaskGrid({
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
}: TaskGridProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const filteredTasks = useMemo(
    () =>
      filterTasks({
        tasks,
        searchQuery,
        statusFilter,
        dueFilter,
        priorityFilter,
        assignmentFilter,
      }),
    [tasks, searchQuery, statusFilter, dueFilter, priorityFilter, assignmentFilter]
  );

  const gridKey = `${statusFilter}-${dueFilter}-${priorityFilter}-${assignmentFilter}-${searchQuery}`;

  return (
    <>
      <AnimatePresence mode="sync">
        {filteredTasks.length > 0 ? (
          <motion.div
            key={gridKey}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-6"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.04, delayChildren: 0.02 },
              },
            }}
          >
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                className="h-full"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.22, ease: "easeOut" },
                  },
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
                    canDeleteTasks ? (taskId) => setDeleteTaskId(taskId) : undefined
                  }
                  canDelete={canDeleteTasks}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-v2-neutral-500 bg-v2-neutral-600/60 p-12 text-center backdrop-blur-xl">
            <Inbox className="size-8 text-v2-neutral-400 mb-2 opacity-60" />
            <h4 className="text-sm font-semibold text-v2-neutral-200">No tasks found</h4>
            <p className="mt-1 text-xs text-v2-neutral-400 max-w-sm">
              No tasks match your current search, status, or date filters.
            </p>
            {canEditTasks && onAddTask && (
              <button
                type="button"
                onClick={onAddTask}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Create a Task</span>
              </button>
            )}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            canEdit={canEditTasks}
            onClose={() => setSelectedTask(null)}
            onEdit={() => {
              setEditingTask(selectedTask);
              setSelectedTask(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingTask && (
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
        )}
      </AnimatePresence>

      {canDeleteTasks && (
        <DeleteTaskModal
          open={deleteTaskId !== null}
          taskId={deleteTaskId}
          onOpenChange={(open) => {
            if (!open) setDeleteTaskId(null);
          }}
          onConfirm={(taskId) => {
            onDeleteTask(taskId);
            setDeleteTaskId(null);
          }}
        />
      )}
    </>
  );
}
