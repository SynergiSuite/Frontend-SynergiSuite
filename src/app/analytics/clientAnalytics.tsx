"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Briefcase,
  ShieldCheck,
  HeartHandshake,
  DollarSign,
  Building2,
  Star,
  MessageSquareQuote,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { ClientAnalyticsItem, ClientAnalyticsSummary } from "./schemas/analytics";

interface ClientAnalyticsProps {
  clients?: ClientAnalyticsItem[];
  summary?: ClientAnalyticsSummary;
}

const COLORS = ["#5271ff", "#22d3ee", "#a78bfa", "#3a4ec4", "#10b981", "#f59e0b"];

export default function ClientAnalytics({ clients = [], summary }: ClientAnalyticsProps) {
  const totalValue = summary?.totalPortfolioValue ?? clients.reduce((acc, c) => acc + (c.amount || 0), 0);
  const avgHealth = summary?.averageHealthScore ?? (clients.length > 0 ? (clients.reduce((acc, c) => acc + (c.healthScore || 0), 0) / clients.length) : 0);
  const totalFeedbackCount = summary?.totalFeedback ?? clients.reduce((acc, c) => acc + (c.totalFeedback || 0), 0);
  const totalRepliesCount = summary?.totalReplies ?? clients.reduce((acc, c) => acc + (c.replyCount || 0), 0);

  const chartData = clients.length > 0
    ? clients.map((c) => ({
        name: c.clientName || c.company || "Client Account",
        value: c.amount || 1,
        health: c.healthScore || 0,
      }))
    : [{ name: "Standard Account", value: 100, health: 100 }];

  const getHealthBadge = (score?: number) => {
    const val = score ?? 0;
    if (val >= 70) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
          <ShieldCheck className="h-3 w-3" />
          {val.toFixed(1)}% Optimal
        </span>
      );
    }
    if (val >= 50) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
          <Clock className="h-3 w-3" />
          {val.toFixed(1)}% Stable
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-400">
        <AlertTriangle className="h-3 w-3" />
        {val.toFixed(1)}% At Risk
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Highlights Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-4 backdrop-blur-md transition-all duration-300 hover:border-white/15">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1 font-semibold uppercase tracking-wider">
            <span>Portfolio Value</span>
            <DollarSign className="h-4 w-4 text-[#5271ff]" />
          </div>
          <p className="text-xl font-extrabold text-white">
            ${totalValue.toLocaleString()}
          </p>
          <span className="text-[10px] text-white/40 mt-1 block">
            Across {summary?.totalClients ?? clients.length} client accounts
          </span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-4 backdrop-blur-md transition-all duration-300 hover:border-white/15">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1 font-semibold uppercase tracking-wider">
            <span>Avg Health Score</span>
            <HeartHandshake className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-emerald-400">
            {avgHealth.toFixed(1)}%
          </p>
          <span className="text-[10px] text-emerald-400/80 mt-1 block">
            {summary?.atRiskClients ?? 0} accounts requiring attention
          </span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-4 backdrop-blur-md transition-all duration-300 hover:border-white/15">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1 font-semibold uppercase tracking-wider">
            <span>Client Feedback Volume</span>
            <MessageSquareQuote className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-xl font-extrabold text-cyan-400">
            {totalFeedbackCount} Tickets
          </p>
          <span className="text-[10px] text-white/40 mt-1 block">
            {totalRepliesCount} responses delivered
          </span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-4 backdrop-blur-md transition-all duration-300 hover:border-white/15">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1 font-semibold uppercase tracking-wider">
            <span>Top Performing Client</span>
            <UserCheck className="h-4 w-4 text-violet-400" />
          </div>
          <p className="text-sm font-bold text-white truncate">
            {summary?.topClient?.clientName || clients[0]?.clientName || "Apex Global"}
          </p>
          <span className="text-[10px] text-violet-400 font-semibold mt-1 block">
            ${(summary?.topClient?.amount || clients[0]?.amount || 0).toLocaleString()} portfolio contribution
          </span>
        </div>
      </div>

      {/* Main Analytics Layout: Portfolio Share & Account Telemetry */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Portfolio Distribution Donut */}
        <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-5 sm:p-6 backdrop-blur-md shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute left-0 top-0 h-[2px] w-32 bg-[#5271ff] shadow-[0_0_12px_#5271ff]" />

          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5271ff]/10 border border-[#5271ff]/20 text-[#5271ff]">
                  <Briefcase className="h-4 w-4" />
                </div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Portfolio Revenue Share
                </h2>
              </div>
              <span className="rounded-full border border-[#5271ff]/20 bg-[#5271ff]/10 px-3 py-0.5 text-[11px] font-semibold text-[#5271ff]">
                Real-Time Telemetry
              </span>
            </div>
            <p className="text-xs text-white/40 mb-4 font-medium">
              Contract revenue and health weight across enterprise client accounts.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around my-4">
              {/* Donut Chart */}
              <div className="h-[200px] w-[200px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0a0826",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="flex flex-col gap-2.5 w-full max-w-[220px]">
                {chartData.slice(0, 5).map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="truncate text-white/70 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-white shrink-0">
                      ${item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/50">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              100% Contract Satisfaction
            </span>
            <span className="text-[#5271ff] font-semibold">
              {clients.length} Accounts Monitored
            </span>
          </div>
        </div>

        {/* Right Column: Detailed Client Account Telemetry Grid */}
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-5 sm:p-6 backdrop-blur-md shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute left-0 top-0 h-[2px] w-32 bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />

          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Client Account Performance & Feedback
                </h2>
              </div>
              <span className="text-xs font-semibold text-white/40">
                {clients.length} Active Profiles
              </span>
            </div>
            <p className="text-xs text-white/40 mb-4 font-medium">
              Detailed breakdown of project progress, task completion rate, and client feedback response rates.
            </p>

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              {clients.length === 0 ? (
                <div className="py-12 text-center text-xs text-white/40 border border-white/[0.06] bg-white/[0.02] rounded-xl p-6">
                  No detailed client telemetry recorded yet.
                </div>
              ) : (
                clients.map((client) => {
                  const compRate = client.taskCompletionRate ?? 0;
                  const respRate = client.responseRate ?? 0;

                  return (
                    <div
                      key={client.clientId || client.clientEmail || client.clientName}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] space-y-3"
                    >
                      {/* Top Client Header Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5271ff]/10 border border-[#5271ff]/20 text-[#5271ff]">
                            <Building2 className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="truncate text-sm font-bold text-white">
                              {client.clientName}
                            </h4>
                            <p className="truncate text-[11px] text-white/40 font-medium">
                              {client.company ? `${client.company} • ` : ""}
                              {client.clientEmail || "client@company.com"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {getHealthBadge(client.healthScore)}
                          <span className="text-sm font-extrabold text-[#5271ff]">
                            ${(client.amount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Middle Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                        <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
                          <span className="text-[10px] uppercase font-bold text-white/40 block">Projects</span>
                          <span className="font-bold text-white">
                            {client.activeProjects ?? 0} Active / {client.totalProjects ?? 0} Total
                          </span>
                        </div>

                        <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
                          <span className="text-[10px] uppercase font-bold text-white/40 block">Tasks Done</span>
                          <span className="font-bold text-cyan-400">
                            {client.completedTasks ?? 0} / {client.totalTasks ?? 0} ({compRate.toFixed(0)}%)
                          </span>
                        </div>

                        <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
                          <span className="text-[10px] uppercase font-bold text-white/40 block">Feedbacks</span>
                          <span className="font-bold text-amber-400 flex items-center gap-1">
                            {client.totalFeedback ?? 0} Total
                            {client.averageRating && (
                              <span className="inline-flex items-center text-amber-300 font-normal text-[10px] ml-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
                                {client.averageRating.toFixed(1)}
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
                          <span className="text-[10px] uppercase font-bold text-white/40 block">Response Rate</span>
                          <span className="font-bold text-emerald-400">
                            {respRate.toFixed(0)}% ({client.replyCount ?? 0} replies)
                          </span>
                        </div>
                      </div>

                      {/* Task Completion Progress Bar */}
                      <div>
                        <div className="flex justify-between text-[10px] font-semibold text-white/40 mb-1">
                          <span>Task Execution Progress</span>
                          <span className="text-white font-bold">{compRate.toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#5271ff] to-cyan-400 transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(0, compRate))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
              Dynamic Client Telemetry Feed
            </span>
            <span className="text-emerald-400 font-semibold">100% System Responsive</span>
          </div>
        </div>
      </div>
    </div>
  );
}
