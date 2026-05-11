"use client";
import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  setSearchQuery: (value: string) => void;
}

export default function SearchBar({ setSearchQuery }: SearchBarProps) {
  return (
    <>
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search projects..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-gray-300 sm:w-64"
        />
      </div>
    </>
  );
}
