"use client";

import React from "react";
import { Building2, Users, User, FileText, TrendingUp, Sparkles } from "lucide-react";

export interface ReportItemType {
  id: string;
  title: string;
  section: "BUSINESS" | "TEAMS" | "EMPLOYEE";
  category: string;
  generatedAt: string;
  generatedBy: string;
  status: "Verified" | "Completed" | "Pending";
  summaryText: string;
  metrics?: Record<string, string | number>;
}

interface StatsCardsProps {
  reports: ReportItemType[];
}

export default function ReportsStatsCards({ reports }: StatsCardsProps) {
  const totalCount = reports.length;
  const businessCount = reports.filter((r) => r.section === "BUSINESS").length;
  const teamsCount = reports.filter((r) => r.section === "TEAMS").length;
  const employeeCount = reports.filter((r) => r.section === "EMPLOYEE").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Reports */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#090724]/70 p-4 sm:p-5 backdrop-blur-md transition-all hover:border-[#5271ff]/30 hover:bg-[#0d0a33]/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
            Total Reports
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5271ff]/20 to-[#7f97ff]/20 border border-[#5271ff]/30 text-[#5271ff]">
            <FileText className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-white tracking-tight sm:text-3xl">
            {totalCount}
          </span>
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
            <Sparkles className="h-3 w-3" /> Active Library
          </span>
        </div>
        <div className="mt-3 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
          <div className="bg-[#5271ff] h-full rounded-full w-full" />
        </div>
      </div>

      {/* Card 2: Section 1 - Business Reports */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#090724]/70 p-4 sm:p-5 backdrop-blur-md transition-all hover:border-cyan-500/30 hover:bg-[#0d0a33]/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
            Business Reports
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Building2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-white tracking-tight sm:text-3xl">
            {businessCount}
          </span>
          <span className="text-xs font-semibold text-cyan-300">
            Section 1
          </span>
        </div>
        <div className="mt-3 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-cyan-400 h-full rounded-full transition-all"
            style={{ width: `${totalCount ? (businessCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Card 3: Section 2 - Team Reports */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#090724]/70 p-4 sm:p-5 backdrop-blur-md transition-all hover:border-amber-500/30 hover:bg-[#0d0a33]/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
            Team Reports
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-white tracking-tight sm:text-3xl">
            {teamsCount}
          </span>
          <span className="text-xs font-semibold text-amber-300">
            Section 2
          </span>
        </div>
        <div className="mt-3 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-amber-400 h-full rounded-full transition-all"
            style={{ width: `${totalCount ? (teamsCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Card 4: Section 3 - Employee Reports */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#090724]/70 p-4 sm:p-5 backdrop-blur-md transition-all hover:border-emerald-500/30 hover:bg-[#0d0a33]/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
            Employee Reports
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <User className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-white tracking-tight sm:text-3xl">
            {employeeCount}
          </span>
          <span className="text-xs font-semibold text-emerald-300">
            Section 3
          </span>
        </div>
        <div className="mt-3 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-400 h-full rounded-full transition-all"
            style={{ width: `${totalCount ? (employeeCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
