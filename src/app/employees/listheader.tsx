"use client";
import React from "react";
import SearchBar from "./listSearch";

interface EmployeeListHeaderProps {
  onSearch: (query: string) => void;
}

export default function EmployeeListHeader({
  onSearch,
}: EmployeeListHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Employee List</h2>

      <div className="w-64">
        <SearchBar onSearch={onSearch} />
      </div>
    </div>
  );
}
