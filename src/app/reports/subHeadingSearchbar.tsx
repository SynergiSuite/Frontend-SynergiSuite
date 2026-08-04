"use client";

import React from "react";
import { Search, FileText, Download, Sparkles, Filter } from "lucide-react";

interface SubHeaderProps {
  search: string;
  setSearch: (value: string) => void;
  sectionFilter: "ALL" | "BUSINESS" | "TEAMS" | "EMPLOYEE";
  setSectionFilter: (filter: "ALL" | "BUSINESS" | "TEAMS" | "EMPLOYEE") => void;
  onGenerateClick: () => void;
}

export default function SubHeader({
  search,
  setSearch,
  sectionFilter,
  setSectionFilter,
  onGenerateClick,
}: SubHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-white/[0.08] pb-6">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5271ff]/15 border border-[#5271ff]/30 px-3 py-0.5 text-xs font-bold text-[#5271ff]">
            <Sparkles className="h-3.5 w-3.5" /> Intelligence Center
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl flex items-center gap-3">
          <FileText className="h-7 w-7 text-[#5271ff]" /> Reports Hub
        </h1>
        <p className="text-xs text-white/50 mt-1 max-w-xl">
          Comprehensive operational telemetry, financial trajectory, team velocity, and individual employee performance analytics.
        </p>
      </div>

      {/* Controls & Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 sm:w-64 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by title, category, date..."
            className="w-full rounded-xl border border-white/10 bg-[#06041d]/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 outline-none transition-all focus:border-[#5271ff]/50 focus:bg-[#09072a] focus:ring-2 focus:ring-[#5271ff]/20"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={onGenerateClick}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_16px_rgba(82,113,255,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(82,113,255,0.5)] active:scale-95 shrink-0"
        >
          <Sparkles className="h-4 w-4" /> Quick Analytics Report
        </button>
      </div>
    </div>
  );
}
