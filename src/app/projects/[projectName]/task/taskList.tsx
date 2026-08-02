"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Edit2,
  Eye,
  Trash2,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Task } from "./schemas/task";
import ViewAndEditModal, { type TaskViewEditPayload } from "./viewAndEdit";
import DeleteTaskModal from "./deleteTask";
import TaskDetailModal from "./taskDetailModal";
import {
  filterTasks,
  formatTaskLabel,
  getPriorityBadgeStyle,
  getStatusBadgeStyle,
  TASK_STATUS_OPTIONS,
} from "./task-utils";

type TaskListProps = {
  searchQuery: string;
  statusFilter: string;
  dueFilter: string;
  tasks: Task[];
  onUpdateTask: (payload: TaskViewEditPayload) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void> | void;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  statusOptions?: string[];
};

export default function TaskList({
  searchQuery,
  statusFilter,
  dueFilter,
  tasks,
  onUpdateTask,
  onDeleteTask,
  canEditTasks,
  canDeleteTasks,
  statusOptions = TASK_STATUS_OPTIONS,
}: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const filteredTasks = filterTasks({
    tasks,
    searchQuery,
    statusFilter,
    dueFilter,
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const isOverdue = (dateString?: string, status?: string) => {
    if (!dateString || status === "completed") return false;
    try {
      const due = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return due < today;
    } catch {
      return false;
    }
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-white">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-white/50">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Task Name & Description
                </th>
                <th scope="col" className="px-6 py-4">
                  Status
                </th>
                <th scope="col" className="px-6 py-4">
                  Priority
                </th>
                <th scope="col" className="px-6 py-4">
                  Assigned Team
                </th>
                <th scope="col" className="px-6 py-4">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm font-medium text-white/40"
                  >
                    No tasks match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const overdue = isOverdue(task.due_date, task.status);
                  return (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group transition-colors hover:bg-white/[0.03]"
                    >
                      {/* Task Title & Description */}
                      <td className="px-6 py-4 min-w-[240px]">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#5271ff]/30 bg-[#5271ff]/10 text-[#5271ff]">
                            {task.status === "completed" ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Clock className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => setSelectedTask(task)}
                              className="text-left font-semibold text-white hover:text-[#5271ff] transition-colors line-clamp-1 cursor-pointer"
                            >
                              {task.title}
                            </button>
                            {task.description && (
                              <p className="mt-0.5 text-xs text-white/50 line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeStyle(
                            task.status
                          )}`}
                        >
                          {formatTaskLabel(task.status)}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getPriorityBadgeStyle(
                            task.priority
                          )}`}
                        >
                          {task.priority || "Medium"}
                        </span>
                      </td>

                      {/* Assigned Teams */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {task.teams && task.teams.length > 0 ? (
                            task.teams.map((team, idx) => (
                              <span
                                key={team.id || idx}
                                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/80"
                              >
                                <Users className="h-3 w-3 text-[#5271ff]" />
                                {team.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-white/30 font-medium">
                              Unassigned
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="whitespace-nowrap px-6 py-4 text-xs font-medium">
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 ${
                            overdue
                              ? "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                              : "text-white/70"
                          }`}
                        >
                          <CalendarIcon className="h-3.5 w-3.5" />
                          <span>{formatDate(task.due_date)}</span>
                          {overdue && (
                            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            title="View task details"
                            onClick={() => setSelectedTask(task)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-[#5271ff]/50 hover:bg-[#5271ff]/15 hover:text-white cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {canEditTasks && (
                            <button
                              type="button"
                              title="Edit task"
                              onClick={() => setEditingTask(task)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-[#5271ff]/50 hover:bg-[#5271ff]/15 hover:text-white cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {canDeleteTasks && (
                            <button
                              type="button"
                              title="Delete task"
                              onClick={() => setDeleteTaskId(task.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-rose-500/50 hover:bg-rose-500/15 hover:text-rose-400 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
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

      {/* Edit Modal */}
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
            canEdit={canEditTasks}
          />
        ) : null}
      </AnimatePresence>

      {/* Delete Modal */}
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
