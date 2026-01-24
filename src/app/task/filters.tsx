"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Team } from "@/app/projects/schemas/team";

type FiltersBarProps = {
  searchQuery: string;
  statusFilter: string;
  dueFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDueChange: (value: string) => void;
  onAddTask: () => void;
  teams: Team[];
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
}: FiltersBarProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className="flex-1 py-2 px-4 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="py-2 px-4 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
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

        <Button onClick={onAddTask}>+ Add New Task</Button>
      </div>
    </>
  );
}
