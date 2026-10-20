"use client";

import React from "react";
import { LayoutGrid, List, RotateCcw, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "Document", label: "Documents (PDF, Doc)" },
  { value: "Image", label: "Images (PNG, JPG)" },
  { value: "Media", label: "Media (Video, Audio)" },
  { value: "Archive", label: "Archives (ZIP, Tar)" },
  { value: "Other", label: "Other Files" },
];

export const SCOPE_OPTIONS = [
  { value: "all", label: "All Classifications" },
  { value: "personal", label: "Personal" },
  { value: "team", label: "Team Shared" },
  { value: "project", label: "Project Bound" },
  { value: "client", label: "Client Scope" },
  { value: "other", label: "Other" },
];

interface CloudFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedScope: string;
  onScopeChange: (scope: string) => void;
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export default function CloudFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedScope,
  onScopeChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  hasActiveFilters,
}: CloudFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-v2-neutral-400" />
        <input
          type="text"
          placeholder="Search by file name, category, or label..."
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

      {/* Controls & Selectors */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Category Dropdown */}
        <div className="w-40 sm:w-44">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-10 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="z-[100] rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
              {CATEGORY_OPTIONS.map((opt) => (
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

        {/* Scope Dropdown */}
        <div className="w-40 sm:w-44">
          <Select value={selectedScope} onValueChange={onScopeChange}>
            <SelectTrigger className="h-10 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
              <SelectValue placeholder="All Scopes" />
            </SelectTrigger>
            <SelectContent className="z-[100] rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
              {SCOPE_OPTIONS.map((opt) => (
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

        {/* View Mode Switcher (Table vs Grid) */}
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(val) => {
            if (val === "table" || val === "grid") {
              onViewModeChange(val);
            }
          }}
          className="h-10"
        >
          <ToggleGroupItem
            value="table"
            aria-label="Table view"
            className="h-8 px-2.5"
          >
            <List className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="grid"
            aria-label="Grid view"
            className="h-8 px-2.5"
          >
            <LayoutGrid className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="h-10 gap-1.5 text-xs text-v2-neutral-500 hover:text-v2-neutral-600"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}
