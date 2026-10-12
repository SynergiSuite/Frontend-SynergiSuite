"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Task } from "./schemas/task";
import { Team } from "@/app/projects/schemas/team";
import ViewAndEditModal, { type TaskViewEditPayload } from "./viewAndEdit";
import DeleteTaskModal from "./deleteTask";
import TaskDetailModal from "./taskDetailModal";
import {
  filterTasks,
  formatDueDate,
  getStatusConfig,
  TASK_STATUS_OPTIONS,
} from "./task-utils";

type TaskCalendarProps = {
  searchQuery?: string;
  statusFilter?: string;
  dueFilter?: string;
  priorityFilter?: string;
  assignmentFilter?: string;
  teams?: Team[];
  tasks?: Task[];
  onUpdateTask?: (
    payload: TaskViewEditPayload,
    options?: { showSuccessToast?: boolean }
  ) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void> | void;
  canEditTasks?: boolean;
  canDeleteTasks?: boolean;
  statusOptions?: string[];
};

export default function CalendarWidget({
  searchQuery = "",
  statusFilter = "all",
  dueFilter = "all",
  priorityFilter = "all",
  assignmentFilter = "all",
  teams = [],
  tasks = [],
  onUpdateTask,
  onDeleteTask,
  canEditTasks = false,
  canDeleteTasks = false,
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
        priorityFilter,
        assignmentFilter,
      }),
    [tasks, searchQuery, statusFilter, dueFilter, priorityFilter, assignmentFilter]
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

    // Next month trailing days
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
      <div className="flex flex-col h-full w-full rounded-2xl border border-v2-neutral-500 bg-v2-neutral-600/90 backdrop-blur-xl p-4 shadow-lg">
        {/* Header Controls */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-v2-neutral-500/60 pb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-bold text-v2-neutral-100 tracking-tight">
              {monthLabel}
            </h2>
            <button
              type="button"
              onClick={handleToday}
              className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-700/80 px-2.5 py-1 text-xs font-semibold text-v2-neutral-200 hover:text-v2-neutral-100 hover:bg-v2-neutral-500/50 transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="flex size-8 items-center justify-center rounded-xl border border-v2-neutral-500 bg-v2-neutral-700/80 text-v2-neutral-300 hover:text-v2-neutral-100 hover:bg-v2-neutral-500/50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="flex size-8 items-center justify-center rounded-xl border border-v2-neutral-500 bg-v2-neutral-700/80 text-v2-neutral-300 hover:text-v2-neutral-100 hover:bg-v2-neutral-500/50 transition-colors cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase tracking-wider text-v2-neutral-400 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-1.5">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid flex-1 grid-cols-7 gap-1.5 auto-rows-fr min-h-[480px]">
          {calendarDays.map((day) => {
            const dayTasks = tasksByDate[day.dateKey] || [];

            return (
              <div
                key={day.dateKey}
                className={`relative flex flex-col rounded-xl border p-2 transition-all min-h-[85px] ${
                  day.isToday
                    ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                    : day.isCurrentMonth
                    ? "border-v2-neutral-500/60 bg-v2-neutral-700/40 hover:bg-v2-neutral-700/70"
                    : "border-v2-neutral-500/20 bg-v2-neutral-700/10 opacity-40"
                }`}
              >
                {/* Date Number Header */}
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={`inline-flex size-5 items-center justify-center rounded-full text-xs font-bold ${
                      day.isToday
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : day.isCurrentMonth
                        ? "text-v2-neutral-200"
                        : "text-v2-neutral-400"
                    }`}
                  >
                    {day.dayNumber}
                  </span>

                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold text-primary bg-primary/15 px-1.5 py-0.2 rounded-full border border-primary/20">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Day Tasks Chips */}
                <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar max-h-[75px]">
                  {dayTasks.slice(0, 2).map((task) => {
                    const statusCfg = getStatusConfig(task.status);
                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => setSelectedTask(task)}
                        className="w-full text-left rounded-md border border-v2-neutral-500/60 bg-v2-neutral-600/90 px-1.5 py-0.5 text-[11px] font-medium text-v2-neutral-100 hover:border-primary hover:bg-v2-neutral-600 transition-all truncate flex items-center gap-1 cursor-pointer"
                      >
                        <span
                          className="size-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: statusCfg.dotColor }}
                        />
                        <span className="truncate flex-1">{task.title}</span>
                      </button>
                    );
                  })}

                  {dayTasks.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setPopoverDay(day.dateKey)}
                      className="text-[10px] font-semibold text-primary hover:underline block text-left pl-1"
                    >
                      +{dayTasks.length - 2} more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popover list for days with > 2 tasks */}
      <AnimatePresence>
        {popoverDay && tasksByDate[popoverDay] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPopoverDay(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-v2-neutral-500 bg-v2-neutral-600 p-5 shadow-2xl z-50"
            >
              <h3 className="text-sm font-bold text-v2-neutral-100 mb-3">
                Tasks for {formatDueDate(popoverDay)}
              </h3>
              <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                {tasksByDate[popoverDay].map((task) => {
                  const statusCfg = getStatusConfig(task.status);
                  return (
                    <div
                      key={task.id}
                      onClick={() => {
                        setSelectedTask(task);
                        setPopoverDay(null);
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-v2-neutral-500/70 bg-v2-neutral-700/60 hover:bg-v2-neutral-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="size-2 rounded-full shrink-0"
                          style={{ backgroundColor: statusCfg.dotColor }}
                        />
                        <span className="text-xs font-semibold text-v2-neutral-100 truncate">
                          {task.title}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusCfg.badgeClass}`}
                      >
                        {statusCfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setPopoverDay(null)}
                className="mt-4 w-full rounded-xl border border-v2-neutral-500 py-2 text-xs font-semibold text-v2-neutral-200 hover:bg-v2-neutral-500/50"
              >
                Close
              </button>
            </motion.div>
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
              if (onUpdateTask) {
                await onUpdateTask(payload);
              }
              setEditingTask(null);
            }}
            statusOptions={statusOptions}
            canEdit={canEditTasks}
          />
        )}
      </AnimatePresence>

      {canDeleteTasks && onDeleteTask && (
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
