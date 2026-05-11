"use client";
import React from "react";
import SearchBar from "./listsearch";

interface EmployeeListHeaderProps {
  onSearch: (query: string) => void;
}

export default function EmployeeListHeader({
  onSearch,
}: EmployeeListHeaderProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-xl font-semibold">Employee List</h2>

      <div className="w-full sm:w-64">
        <SearchBar onSearch={onSearch} />
      </div>
    </div>
  );
}
