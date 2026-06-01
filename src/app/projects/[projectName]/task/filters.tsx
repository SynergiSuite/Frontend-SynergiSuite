"use client";
import React from "react";
import { Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Team } from "@/app/projects/schemas/team";
import { formatTaskLabel } from "./task-utils";

type TaskViewMode = "grid" | "kanban";

type FiltersBarProps = {
  searchQuery: string;
  statusFilter: string;
  dueFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDueChange: (value: string) => void;
  onAddTask: () => void;
  teams: Team[];
  viewMode: TaskViewMode;
  onViewModeChange: (value: TaskViewMode) => void;
  canManageTasks: boolean;
  statusOptions: string[];
};

export default function FiltersBar({
  searchQuery,
  statusFilter,
  dueFilter,
  onSearchChange,
  onStatusChange,
  onDueChange,
  onAddTask,
  viewMode,
  onViewModeChange,
  canManageTasks,
  statusOptions,
}: FiltersBarProps) {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-[#0a0826]/40 border border-white/[0.08] backdrop-blur-md p-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] task-animate-item opacity-0">
        {/* Search bar input with search icon overlay */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3.5 top-3.5 text-white/30 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-[#030114]/40 py-2.5 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 transition-all duration-300"
          />
        </div>

        {/* Status Filter Dropdown */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="py-2.5 px-4 border border-white/[0.08] rounded-xl bg-[#030114]/40 text-white focus:ring-1 focus:ring-[#5271ff]/30 focus:border-[#5271ff]/50 cursor-pointer hover:border-white/[0.15] transition-all duration-300 h-[44px] flex items-center justify-between min-w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="border border-white/[0.08] bg-[#0a0826] text-white rounded-xl shadow-2xl backdrop-blur-2xl">
            <SelectItem value="all" className="cursor-pointer focus:bg-[#5271ff]/20 focus:text-white rounded-lg py-2 px-3 transition-colors text-white/80">All Status</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status} className="cursor-pointer focus:bg-[#5271ff]/20 focus:text-white rounded-lg py-2 px-3 transition-colors text-white/80">
                {formatTaskLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Due Filter Dropdown */}
        <Select value={dueFilter} onValueChange={onDueChange}>
          <SelectTrigger className="py-2.5 px-4 border border-white/[0.08] rounded-xl bg-[#030114]/40 text-white focus:ring-1 focus:ring-[#5271ff]/30 focus:border-[#5271ff]/50 cursor-pointer hover:border-white/[0.15] transition-all duration-300 h-[44px] flex items-center justify-between min-w-[150px]">
            <SelectValue placeholder="All Due Dates" />
          </SelectTrigger>
          <SelectContent className="border border-white/[0.08] bg-[#0a0826] text-white rounded-xl shadow-2xl backdrop-blur-2xl">
            <SelectItem value="all" className="cursor-pointer focus:bg-[#5271ff]/20 focus:text-white rounded-lg py-2 px-3 transition-colors text-white/80">All Due Dates</SelectItem>
            <SelectItem value="today" className="cursor-pointer focus:bg-[#5271ff]/20 focus:text-white rounded-lg py-2 px-3 transition-colors text-white/80">Today</SelectItem>
            <SelectItem value="this-week" className="cursor-pointer focus:bg-[#5271ff]/20 focus:text-white rounded-lg py-2 px-3 transition-colors text-white/80">This Week</SelectItem>
            <SelectItem value="this-month" className="cursor-pointer focus:bg-[#5271ff]/20 focus:text-white rounded-lg py-2 px-3 transition-colors text-white/80">This Month</SelectItem>
          </SelectContent>
        </Select>

        {/* Custom Toggle View Mode group */}
        <div className="inline-flex items-center rounded-xl border border-white/[0.08] bg-[#030114]/40 p-1">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] text-white shadow-[0_0_10px_rgba(82,113,255,0.2)]"
                : "text-white/60 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            Grid View
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("kanban")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${
              viewMode === "kanban"
                ? "bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] text-white shadow-[0_0_10px_rgba(82,113,255,0.2)]"
                : "text-white/60 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            Kanban View
          </button>
        </div>

        {/* Add New Task Button */}
        {canManageTasks ? (
          <button
            onClick={onAddTask}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:shadow-[0_0_22px_rgba(82,113,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Plus size={16} strokeWidth={2.25} aria-hidden="true" />
            <span>Add New Task</span>
          </button>
        ) : null}
      </div>
    </>
  );
}

