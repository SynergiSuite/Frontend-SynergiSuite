"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp, DollarSign, Activity, Sparkles, CheckCircle2 } from "lucide-react";
import { QuarterlyGrowth } from "./schemas/analytics";

interface BusinessAnalyticsProps {
  quarterlyGrowth?: QuarterlyGrowth;
}

export default function BusinessAnalytics({ quarterlyGrowth }: BusinessAnalyticsProps) {
  const current = quarterlyGrowth?.current || {
    newProjects: 12,
    newClients: 6,
    newEmployees: 8,
    completedTasks: 165,
    score: 85,
  };

  const previous = quarterlyGrowth?.previous || {
    newProjects: 9,
    newClients: 4,
    newEmployees: 5,
    completedTasks: 130,
    score: 68,
  };

  const growthIndex = quarterlyGrowth?.quarterlyGrowthIndex ?? 28.4;
  const growthChange = quarterlyGrowth?.growthChangePercent ?? 5.2;

  const chartData = [
    { label: "New Projects", current: current.newProjects, previous: previous.newProjects },
    { label: "New Clients", current: current.newClients, previous: previous.newClients },
    { label: "New Employees", current: current.newEmployees, previous: previous.newEmployees },
    { label: "Completed Tasks", current: current.completedTasks, previous: previous.completedTasks },
  ];

  const businessHealthMetrics = [
    { label: "Quarterly Growth Index", value: `${growthIndex.toFixed(1)}%`, status: `${growthChange >= 0 ? "+" : ""}${growthChange.toFixed(1)}% vs prev`, color: "text-emerald-400" },
    { label: "Completed Tasks Output", value: `${current.completedTasks}`, status: `${previous.completedTasks} prev period`, color: "text-[#5271ff]" },
    { label: "New Accounts & Projects", value: `+${current.newProjects + current.newClients}`, status: `${current.newProjects} proj, ${current.newClients} clients`, color: "text-cyan-400" },
    { label: "Team Scale Score", value: `${current.score.toFixed(0)}`, status: `Growth index score`, color: "text-violet-400" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Revenue Trajectory Area Chart */}
      <div className="lg:col-span-8 rounded-2xl border border-white/[0.08] bg-[#0c0a2f]/70 p-5 sm:p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
        {/* Top Glow Accent Line */}
        <div className="absolute left-0 top-0 h-[2px] w-32 bg-emerald-400 shadow-[0_0_12px_#10b981]" />

        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Quarterly Business Growth Comparison
              </h2>
            </div>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-[11px] font-semibold text-emerald-400">
              {growthChange >= 0 ? "+" : ""}{growthChange.toFixed(1)}% Growth Rate
            </span>
          </div>
          <p className="text-xs text-white/50 mb-6 font-medium">
            Comparing current vs previous quarterly period metrics across projects, clients, hires, and tasks.
          </p>

          <div className="h-[230px] w-full min-h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5271ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5271ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "rgba(255, 255, 255, 0.6)", fontSize: 11 }}
                  stroke="rgba(255,255,255,0.08)"
                />
                <YAxis
                  tick={{ fill: "rgba(255, 255, 255, 0.6)", fontSize: 11 }}
                  stroke="rgba(255,255,255,0.08)"
                />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                  contentStyle={{
                    backgroundColor: "#0c0a2f",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600, marginBottom: "4px" }}
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  name="Current Period"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCurrent)"
                />
                <Area
                  type="monotone"
                  dataKey="previous"
                  name="Previous Period"
                  stroke="#5271ff"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorPrevious)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="mt-4 pt-4 border-t border-white/[0.08] grid grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-white/50">Growth Index</span>
            <p className="text-sm font-bold text-white mt-0.5">{growthIndex.toFixed(1)}%</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/50">New Projects</span>
            <p className="text-sm font-bold text-emerald-400 mt-0.5">+{current.newProjects}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/50">New Clients</span>
            <p className="text-sm font-bold text-[#5271ff] mt-0.5">+{current.newClients}</p>
          </div>
        </div>
      </div>

      {/* Right Column: Business Operational Health Index */}
      <div className="lg:col-span-4 rounded-2xl border border-white/[0.08] bg-[#0c0a2f]/70 p-5 sm:p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
        {/* Top Glow Accent Line */}
        <div className="absolute left-0 top-0 h-[2px] w-32 bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />

        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Activity className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Quarterly Telemetry
              </h2>
            </div>
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-xs text-white/50 mb-4 font-medium">
            Calculated expansion, hiring scale, and goal realization metrics.
          </p>

          <div className="space-y-3">
            {businessHealthMetrics.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/70">{item.label}</span>
                  <span className={`text-sm font-extrabold ${item.color}`}>{item.value}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-white/50 font-medium">
                  <span>{item.status}</span>
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/60">
          <span className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
            Growth Trajectory: Positive
          </span>
          <span className="text-emerald-400 font-semibold">Scale Operational</span>
        </div>
      </div>
    </div>
  );
}
