"use client";
import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  setSearchQuery: (value: string) => void;
}

export default function SearchBar({ setSearchQuery }: SearchBarProps) {
  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search projects..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-200 bg-white rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
      </div>
    </>
  );
}
