"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronRight,
  Edit2,
  Eye,
  Flag,
  Inbox,
  Plus,
  Trash2,
  UserX,
  Users,
} from "lucide-react";
import { Task } from "./schemas/task";
import { Team } from "@/app/projects/schemas/team";
import ViewAndEditModal, { type TaskViewEditPayload } from "./viewAndEdit";
import DeleteTaskModal from "./deleteTask";
import TaskDetailModal from "./taskDetailModal";
import {
  filterTasks,
  formatDueDate,
  getPriorityConfig,
  getStatusConfig,
  isDueToday,
  isOverdue,
  normalizeTaskStatus,
  TASK_STATUS_OPTIONS,
} from "./task-utils";

type TaskListProps = {
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

export default function TaskList({
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
}: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

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

  // Group tasks by status for ClickUp layout
  const groupedTasks = useMemo(() => {
    return statusOptions.map((status) => ({
      status,
      config: getStatusConfig(status),
      tasks: filteredTasks.filter(
        (task) => normalizeTaskStatus(task.status) === status
      ),
    }));
  }, [filteredTasks, statusOptions]);

  const toggleGroupCollapse = (status: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const handleToggleComplete = async (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canEditTasks) return;

    const isCurrentlyCompleted = normalizeTaskStatus(task.status) === "completed";
    const nextStatus = isCurrentlyCompleted ? "todo" : "completed";

    await onUpdateTask(
      {
        id: task.id,
        status: nextStatus,
      },
      { showSuccessToast: true }
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="space-y-4 pb-6">
        {groupedTasks.map((group) => {
          const isCollapsed = collapsedGroups[group.status];
          const hasTasks = group.tasks.length > 0;

          // If a specific status filter is applied, hide non-matching groups
          if (statusFilter !== "all" && group.status !== statusFilter) {
            return null;
          }

          return (
            <div
              key={group.status}
              className="overflow-hidden rounded-2xl border border-v2-neutral-500 bg-v2-neutral-600/90 shadow-md backdrop-blur-xl"
            >
              {/* ClickUp Group Header */}
              <div
                onClick={() => toggleGroupCollapse(group.status)}
                className="flex cursor-pointer items-center justify-between border-b border-v2-neutral-500/60 bg-v2-neutral-500/20 px-4 py-2.5 transition-colors hover:bg-v2-neutral-500/30"
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    className="text-v2-neutral-400 hover:text-v2-neutral-100 p-0.5 rounded"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </button>

                  <span
                    className="size-2.5 rounded-full shadow-xs"
                    style={{ backgroundColor: group.config.dotColor }}
                  />

                  <span className="text-xs font-bold uppercase tracking-wider text-v2-neutral-200">
                    {group.config.label}
                  </span>

                  <span className="grid size-5 place-items-center rounded-full bg-v2-neutral-500/40 text-[10px] font-bold text-v2-neutral-300 border border-v2-neutral-500/70">
                    {group.tasks.length}
                  </span>
                </div>

                {canEditTasks && onAddTask && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddTask(group.status);
                    }}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-v2-neutral-400 hover:text-v2-neutral-100 hover:bg-v2-neutral-500/30 transition-colors"
                  >
                    <Plus className="size-3.5" />
                    <span>Add Task</span>
                  </button>
                )}
              </div>

              {/* Group Table Body */}
              {!isCollapsed && (
                <div className="overflow-x-auto custom-scrollbar">
                  {hasTasks ? (
                    <table className="w-full text-left text-sm text-v2-neutral-100">
                      <thead className="border-b border-v2-neutral-500/40 bg-v2-neutral-500/15 text-[11px] font-semibold uppercase tracking-wider text-v2-neutral-400">
                        <tr>
                          <th scope="col" className="w-12 px-4 py-2 text-center">
                            #
                          </th>
                          <th scope="col" className="px-4 py-2 min-w-[240px]">
                            Task Name
                          </th>
                          <th scope="col" className="px-4 py-2 min-w-[110px]">
                            Priority
                          </th>
                          <th scope="col" className="px-4 py-2 min-w-[180px]">
                            Assignment
                          </th>
                          <th scope="col" className="px-4 py-2 min-w-[120px]">
                            Due Date
                          </th>
                          <th scope="col" className="px-4 py-2 text-right w-24">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-v2-neutral-500/30">
                        {group.tasks.map((task) => {
                          const isCompleted = normalizeTaskStatus(task.status) === "completed";
                          const priorityCfg = getPriorityConfig(task.priority);
                          const overdue = isOverdue(task.due_date, task.status);
                          const dueToday = isDueToday(task.due_date);
                          const primaryTeam = task.teams && task.teams.length > 0 ? task.teams[0] : null;

                          return (
                            <tr
                              key={task.id}
                              onClick={() => setSelectedTask(task)}
                              className="group cursor-pointer transition-colors hover:bg-v2-neutral-500/25"
                            >
                              {/* Checkbox Quick Complete */}
                              <td className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleComplete(task, e)}
                                  className={`grid size-5 place-items-center rounded-md border transition-all ${
                                    isCompleted
                                      ? "border-emerald-500 bg-emerald-500 text-white"
                                      : "border-v2-neutral-400/80 bg-v2-neutral-500/30 hover:border-sky-400 text-transparent"
                                  }`}
                                  title={isCompleted ? "Mark incomplete" : "Mark completed"}
                                >
                                  <Check className="size-3.5 stroke-[3]" />
                                </button>
                              </td>

                              {/* Title & Description */}
                              <td className="px-4 py-3">
                                <div className="min-w-0 max-w-md">
                                  <span
                                    className={`font-semibold text-xs sm:text-sm tracking-tight transition-colors group-hover:text-white ${
                                      isCompleted
                                        ? "text-v2-neutral-400 line-through"
                                        : "text-v2-neutral-100"
                                    }`}
                                  >
                                    {task.title}
                                  </span>
                                  {task.description && (
                                    <p className="mt-0.5 text-xs text-v2-neutral-400 truncate leading-relaxed">
                                      {task.description}
                                    </p>
                                  )}
                                </div>
                              </td>

                              {/* Priority Flag */}
                              <td className="whitespace-nowrap px-4 py-3">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold border ${priorityCfg.badgeClass}`}
                                >
                                  <Flag
                                    className="size-3"
                                    style={{ color: priorityCfg.flagColor }}
                                  />
                                  <span>{priorityCfg.label}</span>
                                </span>
                              </td>

                              {/* Assignment Display */}
                              <td className="whitespace-nowrap px-4 py-3">
                                {task.assignee ? (
                                  <div
                                    className="inline-flex items-center gap-1.5 rounded-md border border-v2-neutral-500/70 bg-v2-neutral-500/30 px-2 py-0.5 text-xs font-medium text-v2-neutral-200 max-w-[200px]"
                                    title={`${task.assignee.name} (${task.assignee.email})${primaryTeam ? ` • ${primaryTeam.name}` : ""}`}
                                  >
                                    <span className="grid size-4.5 place-items-center rounded-full bg-sky-500/25 text-[9px] font-bold text-sky-300 shrink-0">
                                      {getInitials(task.assignee.name)}
                                    </span>
                                    <span className="truncate">{task.assignee.name}</span>
                                    {primaryTeam && (
                                      <span className="text-[10px] text-v2-neutral-400 truncate">
                                        • {primaryTeam.name}
                                      </span>
                                    )}
                                  </div>
                                ) : primaryTeam ? (
                                  <div className="inline-flex items-center gap-1.5 rounded-md border border-v2-neutral-500/70 bg-v2-neutral-500/30 px-2 py-0.5 text-xs font-medium text-v2-neutral-200 max-w-[200px]">
                                    <Users className="size-3.5 text-sky-400 shrink-0" />
                                    <span className="truncate">{primaryTeam.name}</span>
                                  </div>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs text-v2-neutral-400">
                                    <UserX className="size-3.5" />
                                    <span>Unassigned</span>
                                  </span>
                                )}
                              </td>

                              {/* Due Date */}
                              <td className="whitespace-nowrap px-4 py-3">
                                <div
                                  className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${
                                    overdue
                                      ? "border border-rose-500/30 bg-rose-500/15 text-rose-300"
                                      : dueToday
                                      ? "border border-amber-500/30 bg-amber-500/15 text-amber-300"
                                      : "text-v2-neutral-300"
                                  }`}
                                >
                                  <CalendarIcon className="size-3.5" />
                                  <span>{formatDueDate(task.due_date)}</span>
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="whitespace-nowrap px-4 py-3 text-right">
                                <div
                                  className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    title="View task details"
                                    onClick={() => setSelectedTask(task)}
                                    className="p-1.5 rounded-lg text-v2-neutral-400 hover:text-v2-neutral-100 hover:bg-v2-neutral-500/50 transition-colors"
                                  >
                                    <Eye className="size-3.5" />
                                  </button>

                                  {canEditTasks && (
                                    <button
                                      type="button"
                                      title="Edit task"
                                      onClick={() => setEditingTask(task)}
                                      className="p-1.5 rounded-lg text-v2-neutral-400 hover:text-v2-neutral-100 hover:bg-v2-neutral-500/50 transition-colors"
                                    >
                                      <Edit2 className="size-3.5" />
                                    </button>
                                  )}

                                  {canDeleteTasks && (
                                    <button
                                      type="button"
                                      title="Delete task"
                                      onClick={() => setDeleteTaskId(task.id)}
                                      className="p-1.5 rounded-lg text-v2-neutral-400 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex items-center justify-between px-6 py-4 text-xs text-v2-neutral-400">
                      <span>No tasks in this stage</span>
                      {canEditTasks && onAddTask && (
                        <button
                          type="button"
                          onClick={() => onAddTask(group.status)}
                          className="font-semibold text-primary hover:underline cursor-pointer"
                        >
                          + Add a task
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-v2-neutral-500 bg-v2-neutral-600/60 p-12 text-center backdrop-blur-xl">
            <Inbox className="size-8 text-v2-neutral-400 mb-2 opacity-60" />
            <h4 className="text-sm font-semibold text-v2-neutral-200">No tasks found</h4>
            <p className="mt-1 text-xs text-v2-neutral-400 max-w-sm">
              No tasks match your current search, status, or date filters.
            </p>
          </div>
        )}
      </div>

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
