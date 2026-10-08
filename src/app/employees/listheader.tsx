"use client";
import React from "react";
import SearchBar from "./listsearch";
import { CardDescription, CardTitle } from "@/components/ui/card";

interface EmployeeListHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export default function EmployeeListHeader({ searchQuery, onSearch }: EmployeeListHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <CardDescription className="text-xs font-medium">Workspace directory</CardDescription>
        <CardTitle className="mt-1 text-lg font-semibold tracking-[-0.025em]">Employee list</CardTitle>
      </div>
      <div className="w-full sm:w-72">
        <SearchBar searchQuery={searchQuery} onSearch={onSearch} />
      </div>
    </div>
  );
}

