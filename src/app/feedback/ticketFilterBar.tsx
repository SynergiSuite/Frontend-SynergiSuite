"use client";

import React from "react";
import { RotateCcw, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ClientFeedbackStatus,
  TICKET_TYPE_OPTIONS,
} from "./types/ticket";

type StatusTab = "all" | ClientFeedbackStatus;

interface TicketFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusTab: StatusTab;
  onStatusTabChange: (status: StatusTab) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedProjectId: string;
  onProjectChange: (projectId: string) => void;
  projectOptions: Array<{ id: string; name: string }>;
  statusCounts: Record<StatusTab, number>;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

const STATUS_TABS: Array<{
  value: StatusTab;
  label: string;
  dotColor: string;
  activeRing: string;
}> = [
  {
    value: "all",
    label: "All Tickets",
    dotColor: "bg-v2-neutral-400",
    activeRing: "ring-v2-neutral-400/30",
  },
  {
    value: "open",
    label: "Open",
    dotColor: "bg-blue-500",
    activeRing: "ring-blue-500/30",
  },
  {
    value: "in_progress",
    label: "In Progress",
    dotColor: "bg-violet-500",
    activeRing: "ring-violet-500/30",
  },
  {
    value: "in_review",
    label: "In Review",
    dotColor: "bg-amber-500",
    activeRing: "ring-amber-500/30",
  },
  {
    value: "resolved",
    label: "Resolved",
    dotColor: "bg-emerald-500",
    activeRing: "ring-emerald-500/30",
  },
  {
    value: "rejected",
    label: "Rejected",
    dotColor: "bg-rose-500",
    activeRing: "ring-rose-500/30",
  },
];

export default function TicketFilterBar({
  searchQuery,
  onSearchChange,
  statusTab,
  onStatusTabChange,
  selectedType,
  onTypeChange,
  selectedProjectId,
  onProjectChange,
  projectOptions,
  statusCounts,
  onResetFilters,
  hasActiveFilters,
}: TicketFilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Search and Dropdowns Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-v2-neutral-400" />
          <input
            type="text"
            placeholder="Search by ticket title, message, or client..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 pl-10 pr-9 text-xs text-v2-neutral-600 outline-none placeholder:text-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-v2-neutral-400 hover:text-v2-neutral-600 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category / Type Selector */}
          <div className="w-40 sm:w-44">
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger className="h-10 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="z-[100] rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                <SelectItem
                  value="all"
                  className="cursor-pointer rounded-lg py-1.5 text-xs text-v2-neutral-600 focus:bg-v2-neutral-200/80 focus:text-v2-neutral-600"
                >
                  All Categories
                </SelectItem>
                {TICKET_TYPE_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="cursor-pointer rounded-lg py-1.5 text-xs text-v2-neutral-600 focus:bg-v2-neutral-200/80 focus:text-v2-neutral-600"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Project Selector */}
          <div className="w-40 sm:w-48">
            <Select
              value={selectedProjectId}
              onValueChange={onProjectChange}
            >
              <SelectTrigger className="h-10 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent className="z-[100] max-h-56 rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                <SelectItem
                  value="all"
                  className="cursor-pointer rounded-lg py-1.5 text-xs text-v2-neutral-600 focus:bg-v2-neutral-200/80 focus:text-v2-neutral-600"
                >
                  All Projects
                </SelectItem>
                {projectOptions.map((proj) => (
                  <SelectItem
                    key={proj.id}
                    value={proj.id}
                    className="cursor-pointer rounded-lg py-1.5 text-xs text-v2-neutral-600 focus:bg-v2-neutral-200/80 focus:text-v2-neutral-600"
                  >
                    {proj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters Action */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="h-10 px-3 gap-1.5 text-xs text-v2-neutral-500 hover:text-v2-neutral-600"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Modern Status Segmented Dock */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-0.5 custom-scrollbar">
        <ToggleGroup
          type="single"
          value={statusTab}
          onValueChange={(val) => {
            if (val) onStatusTabChange(val as StatusTab);
          }}
          variant="subtle"
          className="border border-v2-neutral-300 bg-v2-neutral-100 p-1 shadow-xs"
        >
          {STATUS_TABS.map((tab) => {
            const isActive = statusTab === tab.value;
            const count = statusCounts[tab.value] ?? 0;

            return (
              <ToggleGroupItem
                key={tab.value}
                value={tab.value}
                size="sm"
                className={`group relative inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium cursor-pointer select-none transition-all duration-200 ${
                  isActive
                    ? "!bg-v2-neutral-600 !text-v2-neutral-100 shadow-sm font-semibold !border !border-v2-neutral-600"
                    : "!text-v2-neutral-400 hover:!text-v2-neutral-600 hover:!bg-v2-neutral-200/60"
                }`}
              >
                <span
                  className={`size-2 rounded-full transition-transform ${
                    tab.dotColor
                  } ${
                    isActive
                      ? `ring-2 ring-white/70 scale-110 shadow-xs`
                      : "opacity-75 group-hover:opacity-100"
                  }`}
                />
                <span className="whitespace-nowrap">{tab.label}</span>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold leading-none transition-colors ${
                    isActive
                      ? "bg-white/20 text-v2-neutral-100"
                      : "bg-v2-neutral-200 text-v2-neutral-500 group-hover:bg-v2-neutral-300/80 group-hover:text-v2-neutral-600"
                  }`}
                >
                  {count}
                </span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>

        <div className="hidden md:flex items-center gap-1.5 text-xs text-v2-neutral-400 shrink-0">
          <span>Active view:</span>
          <span className="font-semibold text-v2-neutral-600">
            {STATUS_TABS.find((t) => t.value === statusTab)?.label}
          </span>
          <span className="text-[11px] text-v2-neutral-400">
            ({statusCounts[statusTab] ?? 0})
          </span>
        </div>
      </div>
    </div>
  );
}
