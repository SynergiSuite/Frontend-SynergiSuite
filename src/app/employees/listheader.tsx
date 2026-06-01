"use client";
import React from "react";
import { Search } from "lucide-react";
import SearchBar from "./listsearch";

interface EmployeeListHeaderProps {
  onSearch: (query: string) => void;
}

export default function EmployeeListHeader({ onSearch }: EmployeeListHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Directory</p>
        <h2 className="mt-0.5 text-base font-semibold text-white">Employee List</h2>
      </div>
      <div className="w-full sm:w-64">
        <SearchBar onSearch={onSearch} />
      </div>
    </div>
  );
}
