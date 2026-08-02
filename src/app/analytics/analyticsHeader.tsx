"use client";
import React from "react";
import { Sparkles, Calendar, Activity, Zap } from "lucide-react";

export type AnalyticsTab = "all" | "employee" | "client" | "team" | "business";
export type TimeRange = "7d" | "30d" | "90d" | "ytd";

interface AnalyticsHeaderProps {
  activeTab: AnalyticsTab;
  setActiveTab: (tab: AnalyticsTab) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  calculatedAt?: string;
}

export default function AnalyticsHeader({
  activeTab,
  setActiveTab,
  timeRange,
  setTimeRange,
  calculatedAt,
}: AnalyticsHeaderProps) {
  const tabs: { id: AnalyticsTab; label: string }[] = [
    { id: "all", label: "Overview" },
    { id: "employee", label: "Employee Analytics" },
    { id: "client", label: "Client Analytics" },
    { id: "team", label: "Team Analytics" },
    { id: "business", label: "Business Insights" },
  ];

  const timeRanges: { id: TimeRange; label: string }[] = [
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "90d", label: "90 Days" },
    { id: "ytd", label: "YTD" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5271ff]/30 bg-[#5271ff]/15 px-3 py-1 text-[11px] font-semibold text-[#5271ff] shadow-[0_0_12px_rgba(82,113,255,0.2)]">
              <Activity className="h-3 w-3 animate-pulse" />
              Live Workspace Telemetry
            </span>
            {calculatedAt && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#0c0a2f]/80 px-3 py-1 text-[11px] font-medium text-white/70 backdrop-blur-md shadow-sm">
                <Zap className="h-3 w-3 text-[#5271ff]" />
                Calculated: {new Date(calculatedAt).toLocaleString()}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Analytics Overview
          </h1>
          <p className="mt-1 text-xs text-white/60 font-medium">
            Unified telemetry across employees, client relationships, team velocity, and business growth.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-white/[0.08] bg-[#0c0a2f]/80 p-1.5 backdrop-blur-md self-start sm:self-auto shadow-lg">
          <span className="pl-2 pr-1 text-white/40">
            <Calendar className="h-3.5 w-3.5" />
          </span>
          {timeRanges.map((range) => {
            const isActive = timeRange === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => setTimeRange(range.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] text-white shadow-[0_0_12px_rgba(82,113,255,0.4)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/[0.08] custom-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative shrink-0 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer border ${
                isActive
                  ? "border-[#5271ff]/50 bg-gradient-to-r from-[#5271ff]/30 to-[#3a4ec4]/20 text-white shadow-[0_0_20px_rgba(82,113,255,0.25)]"
                  : "border-white/[0.08] bg-[#0c0a2f]/60 text-white/60 hover:border-white/20 hover:text-white hover:bg-[#0c0a2f]/90"
              }`}
            >
              <span className="flex items-center gap-2">
                {isActive && <Sparkles className="h-3.5 w-3.5 text-[#5271ff]" />}
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#5271ff] to-transparent shadow-[0_0_8px_#5271ff]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
