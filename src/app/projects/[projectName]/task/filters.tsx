"use client";
import React from "react";
import {
  Calendar as CalendarIcon,
  Flag,
  Kanban,
  LayoutGrid,
  List,
  Plus,
  Search,
  User,
  UserX,
  Users,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Team } from "@/app/projects/schemas/team";
import {
  getStatusConfig,
  getPriorityConfig,
  TASK_PRIORITY_OPTIONS,
} from "./task-utils";

export type TaskViewMode = "kanban" | "list" | "grid" | "calendar";

type FiltersBarProps = {
  searchQuery: string;
  statusFilter: string;
  dueFilter: string;
  priorityFilter?: string;
  assignmentFilter?: string;
  teams?: Team[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDueChange: (value: string) => void;
  onPriorityChange?: (value: string) => void;
  onAssignmentChange?: (value: string) => void;
  onAddTask: () => void;
  viewMode: TaskViewMode;
  onViewModeChange: (value: TaskViewMode) => void;
  canManageTasks: boolean;
  statusOptions: string[];
  totalTasksCount?: number;
};

export default function FiltersBar({
  searchQuery,
  statusFilter,
  dueFilter,
  priorityFilter = "all",
  assignmentFilter = "all",
  teams = [],
  onSearchChange,
  onStatusChange,
  onDueChange,
  onPriorityChange,
  onAssignmentChange,
  onAddTask,
  viewMode,
  onViewModeChange,
  canManageTasks,
  statusOptions,
  totalTasksCount,
}: FiltersBarProps) {
  const viewModes: { id: TaskViewMode; label: string; icon: React.ElementType }[] = [
    { id: "kanban", label: "Board", icon: Kanban },
    { id: "list", label: "List", icon: List },
    { id: "grid", label: "Grid", icon: LayoutGrid },
    { id: "calendar", label: "Calendar", icon: CalendarIcon },
  ];

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== "all" ||
    dueFilter !== "all" ||
    priorityFilter !== "all" ||
    assignmentFilter !== "all";

  const handleClearFilters = () => {
    onSearchChange("");
    onStatusChange("all");
    onDueChange("all");
    onPriorityChange?.("all");
    onAssignmentChange?.("all");
  };

  return (
    <div
      data-task-filter
      className="mb-5 flex flex-col gap-3.5 rounded-2xl border border-v2-neutral-500 bg-v2-neutral-600/90 p-3 sm:p-4 backdrop-blur-xl shadow-lg transition-all"
    >
      {/* Top row: View switchers on left, Quick CTA on right */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-v2-neutral-500/70 pb-3">
        {/* ClickUp-style View Switcher Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-v2-neutral-500 bg-v2-neutral-700/80 p-1">
          {viewModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onViewModeChange(mode.id)}
                className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-v2-neutral-500 text-v2-neutral-100 shadow-xs"
                    : "text-v2-neutral-400 hover:text-v2-neutral-200 hover:bg-v2-neutral-600/60"
                }`}
              >
                <Icon className={`size-3.5 ${isActive ? "text-primary" : ""}`} />
                <span>{mode.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action button & active count */}
        <div className="flex items-center gap-2.5">
          {totalTasksCount !== undefined && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-v2-neutral-500 bg-v2-neutral-700/50 px-2.5 py-1 text-xs font-medium text-v2-neutral-300">
              <span className="size-1.5 rounded-full bg-primary" />
              {totalTasksCount} {totalTasksCount === 1 ? "task" : "tasks"}
            </span>
          )}

          {canManageTasks && (
            <Button
              onClick={onAddTask}
              size="sm"
              className="gap-1.5 font-semibold shadow-md bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer rounded-xl h-9 px-3.5"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              <span>Add Task</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom row: Search & Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search input with search & clear icons */}
        <div className="relative min-w-[180px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-v2-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks, squads, or assignees..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-v2-neutral-500 bg-v2-neutral-700/80 py-2 pl-9 pr-8 text-xs sm:text-sm text-v2-neutral-100 placeholder:text-v2-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 h-9"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-v2-neutral-400 hover:text-v2-neutral-100 p-0.5 rounded cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Assignment Filter (All, Unassigned, Teams, Employees) */}
        {onAssignmentChange && (
          <Select value={assignmentFilter} onValueChange={onAssignmentChange}>
            <SelectTrigger className="h-9 min-w-[140px] rounded-xl border border-v2-neutral-500 bg-v2-neutral-700/80 px-3 text-xs font-medium text-v2-neutral-200 hover:border-v2-neutral-400 focus:ring-1 focus:ring-primary">
              <SelectValue placeholder="Assignee: All" />
            </SelectTrigger>
            <SelectContent className="max-h-72 rounded-xl border border-v2-neutral-500 bg-v2-neutral-600 text-v2-neutral-100 shadow-2xl backdrop-blur-xl">
              <SelectItem value="all" className="cursor-pointer text-xs">
                All Assignees
              </SelectItem>
              <SelectItem value="unassigned" className="cursor-pointer text-xs text-v2-neutral-300">
                <div className="flex items-center gap-2">
                  <UserX className="size-3 text-v2-neutral-400" />
                  <span>Unassigned</span>
                </div>
              </SelectItem>

              {teams.map((team) => {
                const membersList = [
                  ...(team.leader ? [team.leader] : []),
                  ...(team.members || []),
                  ...(team.employees || []),
                ];
                const uniqueMembers = membersList.filter(
                  (m, idx, self) =>
                    Boolean(m.user_id) &&
                    idx === self.findIndex((o) => o.user_id === m.user_id)
                );

                return (
                  <SelectGroup key={team.id} className="border-t border-v2-neutral-500/50 pt-1 mt-1">
                    <SelectLabel className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-v2-neutral-400">
                      {team.name}
                    </SelectLabel>
                    <SelectItem value={`team:${team.id}`} className="cursor-pointer text-xs">
                      <div className="flex items-center gap-2">
                        <Users className="size-3 text-primary" />
                        <span>Team: {team.name}</span>
                      </div>
                    </SelectItem>
                    {uniqueMembers.map((member) => (
                      <SelectItem
                        key={`${team.id}-${member.user_id}`}
                        value={`user:${member.user_id}`}
                        className="cursor-pointer text-xs pl-6"
                      >
                        <div className="flex items-center gap-2">
                          <User className="size-3 text-v2-neutral-400" />
                          <span>{member.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                );
              })}
            </SelectContent>
          </Select>
        )}

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="h-9 min-w-[130px] rounded-xl border border-v2-neutral-500 bg-v2-neutral-700/80 px-3 text-xs font-medium text-v2-neutral-200 hover:border-v2-neutral-400 focus:ring-1 focus:ring-primary">
            <SelectValue placeholder="Status: All" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-600 text-v2-neutral-100 shadow-2xl backdrop-blur-xl">
            <SelectItem value="all" className="cursor-pointer text-xs">
              All Statuses
            </SelectItem>
            {statusOptions.map((status) => {
              const cfg = getStatusConfig(status);
              return (
                <SelectItem key={status} value={status} className="cursor-pointer text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: cfg.dotColor }}
                    />
                    <span>{cfg.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        {onPriorityChange && (
          <Select value={priorityFilter} onValueChange={onPriorityChange}>
            <SelectTrigger className="h-9 min-w-[125px] rounded-xl border border-v2-neutral-500 bg-v2-neutral-700/80 px-3 text-xs font-medium text-v2-neutral-200 hover:border-v2-neutral-400 focus:ring-1 focus:ring-primary">
              <SelectValue placeholder="Priority: All" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-600 text-v2-neutral-100 shadow-2xl backdrop-blur-xl">
              <SelectItem value="all" className="cursor-pointer text-xs">
                All Priorities
              </SelectItem>
              {TASK_PRIORITY_OPTIONS.map((priority) => {
                const cfg = getPriorityConfig(priority);
                return (
                  <SelectItem key={priority} value={priority} className="cursor-pointer text-xs">
                    <div className="flex items-center gap-2">
                      <Flag className="size-3" style={{ color: cfg.flagColor }} />
                      <span>{cfg.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}

        {/* Due Date Filter */}
        <Select value={dueFilter} onValueChange={onDueChange}>
          <SelectTrigger className="h-9 min-w-[130px] rounded-xl border border-v2-neutral-500 bg-v2-neutral-700/80 px-3 text-xs font-medium text-v2-neutral-200 hover:border-v2-neutral-400 focus:ring-1 focus:ring-primary">
            <SelectValue placeholder="Due: All" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-600 text-v2-neutral-100 shadow-2xl backdrop-blur-xl">
            <SelectItem value="all" className="cursor-pointer text-xs">
              All Due Dates
            </SelectItem>
            <SelectItem value="overdue" className="cursor-pointer text-xs text-rose-400 font-medium">
              Overdue
            </SelectItem>
            <SelectItem value="today" className="cursor-pointer text-xs">
              Due Today
            </SelectItem>
            <SelectItem value="this-week" className="cursor-pointer text-xs">
              Due This Week
            </SelectItem>
            <SelectItem value="this-month" className="cursor-pointer text-xs">
              Due This Month
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Filters button when any filter is active */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer h-9"
          >
            <X className="size-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
