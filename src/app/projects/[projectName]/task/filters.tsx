"use client";
import React from "react";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
  teams,
  viewMode,
  onViewModeChange,
  canManageTasks,
  statusOptions,
}: FiltersBarProps) {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className="min-w-[220px] flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="py-2 px-4 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {formatTaskLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dueFilter} onValueChange={onDueChange}>
          <SelectTrigger className="py-2 px-4 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="All Due Dates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Due Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
          </SelectContent>
        </Select>

        <div className="inline-flex items-center rounded-md border border-gray-300 bg-white p-1">
          <Button
            type="button"
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
          >
            Grid View
          </Button>
          <Button
            type="button"
            variant={viewMode === "kanban" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("kanban")}
          >
            Kanban View
          </Button>
        </div>

        {canManageTasks ? (
          <Button onClick={onAddTask}>
            <span className="inline-flex items-center gap-2">
              <Plus size={16} strokeWidth={2.25} aria-hidden="true" />
              <span>Add New Task</span>
            </span>
          </Button>
        ) : null}
      </div>
    </>
  );
}
