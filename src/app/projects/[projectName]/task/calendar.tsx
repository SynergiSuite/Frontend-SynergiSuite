"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
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

type TaskCalendarProps = {
  searchQuery?: string;
  statusFilter?: string;
  dueFilter?: string;
  tasks?: Task[];
  onUpdateTask?: (payload: TaskViewEditPayload) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void> | void;
  canEditTasks?: boolean;
  canDeleteTasks?: boolean;
  onAddTask?: () => void;
  statusOptions?: string[];
};

export default function CalendarWidget({
  searchQuery = "",
  statusFilter = "all",
  dueFilter = "all",
  tasks = [],
  onUpdateTask,
  onDeleteTask,
  canEditTasks = false,
  canDeleteTasks = false,
  onAddTask,
  statusOptions = TASK_STATUS_OPTIONS,
}: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [popoverDay, setPopoverDay] = useState<string | null>(null);

  const filteredTasks = useMemo(
    () =>
      filterTasks({
        tasks,
        searchQuery,
        statusFilter,
        dueFilter,
      }),
    [tasks, searchQuery, statusFilter, dueFilter]
  );

  // Map tasks by YYYY-MM-DD
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    filteredTasks.forEach((task) => {
      if (!task.due_date) return;
      try {
        const d = new Date(task.due_date);
        if (isNaN(d.getTime())) return;
        const key = d.toISOString().split("T")[0];
        if (!map[key]) map[key] = [];
        map[key].push(task);
      } catch {
        // ignore invalid dates
      }
    });
    return map;
  }, [filteredTasks]);

  // Calendar grid calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const calendarDays = useMemo(() => {
    const days: {
      date: Date;
      dateKey: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }[] = [];

    const todayStr = new Date().toISOString().split("T")[0];

    // Previous month leading days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const date = new Date(year, month - 1, dayNum);
      const dateKey = date.toISOString().split("T")[0];
      days.push({
        date,
        dateKey,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateKey === todayStr,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateKey = date.toISOString().split("T")[0];
      days.push({
        date,
        dateKey,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: dateKey === todayStr,
      });
    }

    // Next month trailing days to complete full grid (42 cells: 6 weeks)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      const dateKey = date.toISOString().split("T")[0];
      days.push({
        date,
        dateKey,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: dateKey === todayStr,
      });
    }

    return days;
  }, [year, month, startingDayOfWeek, daysInMonth, prevMonthLastDay]);

  const monthLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <>
      <div className="flex flex-col h-full w-full rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 backdrop-blur-xl p-4 shadow-2xl">
        {/* Header Controls */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white tracking-wide">
              {monthLabel}
            </h2>
            <button
              type="button"
              onClick={handleToday}
              className="rounded-xl border border-[#5271ff]/30 bg-[#5271ff]/10 px-3 py-1 text-xs font-semibold text-[#5271ff] transition hover:bg-[#5271ff]/20 cursor-pointer"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-[#5271ff]/50 hover:bg-[#5271ff]/15 hover:text-white cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-[#5271ff]/50 hover:bg-[#5271ff]/15 hover:text-white cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-wider text-white/50 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid flex-1 grid-cols-7 gap-1.5 auto-rows-fr min-h-[500px]">
          {calendarDays.map((day) => {
            const dayTasks = tasksByDate[day.dateKey] || [];
            const isPopoverOpen = popoverDay === day.dateKey;

            return (
              <div
                key={day.dateKey}
                className={`relative flex flex-col rounded-xl border p-2 transition-all min-h-[90px] ${
                  day.isToday
                    ? "border-[#5271ff] bg-[#5271ff]/[0.08] shadow-[0_0_12px_rgba(82,113,255,0.15)]"
                    : day.isCurrentMonth
                    ? "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                    : "border-white/[0.03] bg-white/[0.005] opacity-40"
                }`}
              >
                {/* Date Number */}
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      day.isToday
                        ? "bg-[#5271ff] text-white shadow-[0_0_8px_#5271ff]"
                        : day.isCurrentMonth
                        ? "text-white/80"
                        : "text-white/30"
                    }`}
                  >
                    {day.dayNumber}
                  </span>

                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-extrabold text-[#5271ff] bg-[#5271ff]/15 px-1.5 py-0.5 rounded-full border border-[#5271ff]/20">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Tasks List for Day */}
                <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                  {dayTasks.slice(0, 2).map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                      }}
                      className="group flex w-full items-center gap-1 rounded-lg border border-white/10 bg-[#0a0826]/80 px-1.5 py-1 text-left text-[11px] font-medium text-white/90 transition hover:border-[#5271ff]/50 hover:bg-[#5271ff]/20 cursor-pointer truncate"
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          task.priority === "Urgent" || task.priority === "Critical"
                            ? "bg-rose-400"
                            : task.priority === "High"
                            ? "bg-amber-400"
                            : "bg-[#5271ff]"
                        }`}
                      />
                      <span className="truncate flex-1">{task.title}</span>
                    </button>
                  ))}

                  {/* Over 2 tasks popover toggle */}
                  {dayTasks.length > 2 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPopoverDay(isPopoverOpen ? null : day.dateKey);
                      }}
                      className="w-full text-center text-[10px] font-bold text-[#5271ff] hover:underline cursor-pointer pt-0.5"
                    >
                      +{dayTasks.length - 2} more
                    </button>
                  )}
                </div>

                {/* Popover for All Day Tasks */}
                {isPopoverOpen && (
                  <div className="absolute left-0 top-full z-30 mt-1 w-56 rounded-xl border border-white/[0.12] bg-[#0a0826]/95 p-2 shadow-2xl backdrop-blur-2xl">
                    <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-1.5">
                      <span className="text-xs font-bold text-white">
                        {day.date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPopoverDay(null)}
                        className="text-xs text-white/40 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="max-h-48 space-y-1 overflow-y-auto custom-scrollbar">
                      {dayTasks.map((task) => (
                        <button
                          key={task.id}
                          type="button"
                          onClick={() => {
                            setSelectedTask(task);
                            setPopoverDay(null);
                          }}
                          className="flex w-full items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-left text-xs font-medium text-white hover:border-[#5271ff]/50 hover:bg-[#5271ff]/15 cursor-pointer truncate"
                        >
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${
                              task.priority === "Urgent" || task.priority === "Critical"
                                ? "bg-rose-400"
                                : task.priority === "High"
                                ? "bg-amber-400"
                                : "bg-[#5271ff]"
                            }`}
                          />
                          <span className="truncate flex-1">{task.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
              if (onUpdateTask) {
                await onUpdateTask(payload);
              }
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
            if (onDeleteTask) {
              onDeleteTask(taskId);
            }
            setDeleteTaskId(null);
          }}
        />
      ) : null}
    </>
  );
}
