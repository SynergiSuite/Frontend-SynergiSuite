"use client";

import React from "react";
import {
  Building2,
  Users,
  User,
  FileText,
  Eye,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Download,
} from "lucide-react";
import { ReportItemType } from "./reportsStatsCards";

interface ReportsTableProps {
  reports: ReportItemType[];
  sectionFilter: "ALL" | "BUSINESS" | "TEAMS" | "EMPLOYEE";
  setSectionFilter: (filter: "ALL" | "BUSINESS" | "TEAMS" | "EMPLOYEE") => void;
  onSelectReport: (report: ReportItemType) => void;
  onDeleteReport: (id: string) => void;
}

export default function ReportsTable({
  reports,
  sectionFilter,
  setSectionFilter,
  onSelectReport,
  onDeleteReport,
}: ReportsTableProps) {
  const filteredReports = reports.filter((r) => {
    if (sectionFilter === "ALL") return true;
    return r.section === sectionFilter;
  });

  const getSectionBadge = (section: "BUSINESS" | "TEAMS" | "EMPLOYEE") => {
    switch (section) {
      case "BUSINESS":
        return (
          <span className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-bold text-cyan-300">
            <Building2 className="h-3 w-3" /> Section 1: Business
          </span>
        );
      case "TEAMS":
        return (
          <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-300">
            <Users className="h-3 w-3" /> Section 2: Teams
          </span>
        );
      case "EMPLOYEE":
        return (
          <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
            <User className="h-3 w-3" /> Section 3: Employee
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full w-full rounded-2xl border border-white/10 bg-[#090724]/60 backdrop-blur-md overflow-hidden">
      {/* 3 SECTIONS TABS NAVIGATION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-white/10 bg-white/[0.02]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSectionFilter("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sectionFilter === "ALL"
                ? "bg-[#5271ff] text-white shadow-[0_4px_14px_rgba(82,113,255,0.4)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            All Reports ({reports.length})
          </button>

          <button
            onClick={() => setSectionFilter("BUSINESS")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sectionFilter === "BUSINESS"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Building2 className="h-3.5 w-3.5 text-cyan-400" /> Section 1: Business (
            {reports.filter((r) => r.section === "BUSINESS").length})
          </button>

          <button
            onClick={() => setSectionFilter("TEAMS")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sectionFilter === "TEAMS"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="h-3.5 w-3.5 text-amber-400" /> Section 2: Teams (
            {reports.filter((r) => r.section === "TEAMS").length})
          </button>

          <button
            onClick={() => setSectionFilter("EMPLOYEE")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sectionFilter === "EMPLOYEE"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <User className="h-3.5 w-3.5 text-emerald-400" /> Section 3: Employee (
            {reports.filter((r) => r.section === "EMPLOYEE").length})
          </button>
        </div>
      </div>

      {/* TABLE / LIST CONTENT */}
      <div className="flex-1 overflow-x-auto">
        {filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/40 mb-3">
              <FileText className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-white">No Reports Found</p>
            <p className="text-xs text-white/40 mt-1 max-w-sm">
              No performance reports match your selected section filter or search criteria.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-white/40">
                <th className="py-3 px-4">Report Title</th>
                <th className="py-3 px-4">Section / Scope</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Generated Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs font-medium">
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="group transition-colors hover:bg-white/[0.04]"
                >
                  {/* Report Title */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5271ff]/15 border border-[#5271ff]/20 text-[#5271ff] shrink-0 group-hover:scale-105 transition-transform">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p
                          onClick={() => onSelectReport(report)}
                          className="font-bold text-white tracking-wide hover:text-[#5271ff] cursor-pointer truncate"
                        >
                          {report.title}
                        </p>
                        <span className="text-[10px] text-white/40 flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="h-3 w-3 text-white/30" /> {report.generatedBy}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Section Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getSectionBadge(report.section)}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-white/70">
                    <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[11px]">
                      {report.category}
                    </span>
                  </td>

                  {/* Generated Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-white/60 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-white/40" /> {report.generatedAt}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> {report.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {report.url && (
                        <a
                          href={report.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/15 px-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500 hover:text-white transition-all shadow-sm"
                          title="Open PDF"
                        >
                          <Download className="h-3.5 w-3.5" /> PDF
                        </a>
                      )}

                      <button
                        onClick={() => onSelectReport(report)}
                        className="flex h-8 items-center gap-1.5 rounded-lg border border-[#5271ff]/30 bg-[#5271ff]/15 px-3 text-xs font-bold text-[#5271ff] hover:bg-[#5271ff] hover:text-white transition-all shadow-sm"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>

                      <button
                        onClick={() => onDeleteReport(report.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
