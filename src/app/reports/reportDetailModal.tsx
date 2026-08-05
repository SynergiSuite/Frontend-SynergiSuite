"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  X,
  FileText,
  Building2,
  Users,
  User,
  Calendar,
  CheckCircle2,
  Sparkles,
  Printer,
  Download,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { ReportItemType } from "./reportsStatsCards";

interface ReportDetailModalProps {
  report: ReportItemType | null;
  onClose: () => void;
}

export default function ReportDetailModal({ report, onClose }: ReportDetailModalProps) {
  if (!report) return null;

  const getSectionIcon = () => {
    switch (report.section) {
      case "BUSINESS":
        return <Building2 className="h-5 w-5 text-cyan-400" />;
      case "TEAMS":
        return <Users className="h-5 w-5 text-amber-400" />;
      case "EMPLOYEE":
        return <User className="h-5 w-5 text-emerald-400" />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#0e0c33] via-[#090724] to-[#040317] p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.7)] text-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 pb-6 border-b border-white/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5271ff]/20 to-[#3a4ec4]/20 border border-[#5271ff]/30 shrink-0">
            {getSectionIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#5271ff]/15 border border-[#5271ff]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#7f97ff]">
                <Sparkles className="h-3 w-3" /> Section {report.section === "BUSINESS" ? "1: Business" : report.section === "TEAMS" ? "2: Teams" : "3: Employee"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> {report.status}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {report.title}
            </h2>
            <p className="text-xs text-white/50 mt-0.5 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-white/40" /> Generated: {report.generatedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-[#5271ff]" /> Author: {report.generatedBy}
              </span>
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="space-y-6 py-6 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
          {/* Executive Summary Card */}
          <div className="rounded-2xl border border-white/10 bg-[#030114]/50 p-4 sm:p-5 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-[#5271ff]" /> Executive Summary
            </span>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-normal whitespace-pre-wrap">
              {report.summaryText}
            </p>
          </div>

          {/* Metrics Grid */}
          {report.metrics && Object.keys(report.metrics).length > 0 && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 block">
                Key Performance Metrics & Telemetry
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(report.metrics).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex flex-col justify-between"
                  >
                    <span className="text-[10px] font-semibold uppercase text-white/40 truncate">
                      {key}
                    </span>
                    <span className="text-sm font-extrabold text-white mt-1">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between gap-2 pt-5 border-t border-white/10">
          <div className="flex items-center gap-2">
            {report.url && (
              <a
                href={report.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500 hover:text-white transition-all shadow-sm"
              >
                <Download className="h-3.5 w-3.5" /> Download / View PDF
              </a>
            )}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-white/60" /> Print Report
            </button>
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl bg-[#5271ff] px-5 py-2 text-xs font-bold text-white shadow-[0_0_14px_rgba(82,113,255,0.4)] hover:bg-[#4362ef] transition-all cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </motion.div>
    </div>
  );
}
