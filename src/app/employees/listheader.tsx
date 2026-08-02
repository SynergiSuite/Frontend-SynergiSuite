"use client";
import React from "react";
import SearchBar from "./listsearch";

interface EmployeeListHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export default function EmployeeListHeader({ searchQuery, onSearch }: EmployeeListHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Directory</p>
        <h2 className="mt-0.5 text-base font-semibold text-white">Employee List</h2>
      </div>
      <div className="w-full sm:w-64">
        <SearchBar searchQuery={searchQuery} onSearch={onSearch} />
      </div>
    </div>
  );
}
