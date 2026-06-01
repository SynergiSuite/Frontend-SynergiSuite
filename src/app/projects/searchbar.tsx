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
        <Search className="absolute left-3 top-3.5 text-white/30 w-4 h-4" />
        <input
          type="text"
          placeholder="Search projects..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 backdrop-blur-md py-2.5 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 transition-all duration-300 sm:w-64"
        />
      </div>
    </>
  );
}

