"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex w-full items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 transition-all duration-200 focus-within:border-[#5271ff]/50 focus-within:bg-white/[0.05] focus-within:shadow-[0_0_12px_rgba(82,113,255,0.12)]">
      <Search size={15} className="shrink-0 text-white/30 transition-colors duration-200 group-focus-within:text-[#5271ff]" />
      <input
        type="text"
        placeholder="Search employees..."
        value={query}
        onChange={handleChange}
        className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
      />
      <button
        onClick={handleSearch}
        className="shrink-0 text-white/20 hover:text-[#5271ff] transition-colors duration-200"
        aria-label="Search"
      >
        <Search size={14} />
      </button>
    </div>
  );
}
