"use client";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex items-center border border-white/[0.08] rounded-xl px-3 bg-white/[0.03] w-full h-11 focus-within:border-[#5271ff]/50 focus-within:bg-white/[0.05] transition-all duration-300">
      <Search size={18} className="text-white/40" />
      <input
        type="text"
        placeholder="Search teams..."
        className="outline-none px-2.5 py-1 text-sm bg-transparent w-full text-white placeholder-white/20"
      />
    </div>
  );
}

