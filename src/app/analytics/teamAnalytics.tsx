"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Zap, ShieldAlert, Cpu, CheckCircle } from "lucide-react";
import { TeamExecutionVelocity } from "./schemas/analytics";

const fallbackTeams: TeamExecutionVelocity[] = [
  { teamId: "team-1", teamName: "Frontend Squad", totalTasks: 52, completedTasks: 48, weightedCompletedScore: 94, periodDays: 30, executionVelocity: 94 },
  { teamId: "team-2", teamName: "Backend Core", totalTasks: 57, completedTasks: 52, weightedCompletedScore: 91, periodDays: 30, executionVelocity: 91 },
  { teamId: "team-3", teamName: "UI/UX Design", totalTasks: 38, completedTasks: 36, weightedCompletedScore: 96, periodDays: 30, executionVelocity: 96 },
  { teamId: "team-4", teamName: "DevOps / Infra", totalTasks: 31, completedTasks: 28, weightedCompletedScore: 88, periodDays: 30, executionVelocity: 88 },
  { teamId: "team-5", teamName: "QA & Testing", totalTasks: 36, completedTasks: 34, weightedCompletedScore: 92, periodDays: 30, executionVelocity: 92 },
];

interface TeamAnalyticsProps {
  teams?: TeamExecutionVelocity[];
}

export default function TeamAnalytics({ teams }: TeamAnalyticsProps) {
  const displayTeams = (teams && teams.length > 0) ? teams : fallbackTeams;

  // Compute average velocity
  const avgVelocity = displayTeams.length > 0
    ? (displayTeams.reduce((acc, curr) => acc + (curr.executionVelocity || 0), 0) / displayTeams.length).toFixed(1)
    : "88.5";

  // Map for Recharts bar chart
  const chartData = displayTeams.map((t) => ({
    name: t.teamName || `Team ${t.teamId}`,
    velocity: Number(t.executionVelocity || 0),
    totalTasks: t.totalTasks || 0,
    completedTasks: t.completedTasks || 0,
  }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Team Velocity Chart */}
      <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0c0a2f]/70 p-5 sm:p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
        {/* Top Glow Accent Line */}
        <div className="absolute left-0 top-0 h-[2px] w-32 bg-violet-400 shadow-[0_0_12px_#a78bfa]" />

        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <Zap className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Team Execution Velocity
              </h2>
            </div>
            <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-0.5 text-[11px] font-semibold text-violet-400">
              {avgVelocity}% Execution Rate
            </span>
          </div>
          <p className="text-xs text-white/50 mb-6 font-medium">
            Comparative task throughput and sprint goal completion rates across organizational teams.
          </p>

          <div className="h-[220px] w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                barGap={6}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "rgba(255, 255, 255, 0.6)", fontSize: 10 }}
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
                <Bar dataKey="velocity" name="Execution Velocity (%)" fill="#a78bfa" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="completedTasks" name="Completed Tasks" fill="#5271ff" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="mt-4 pt-4 border-t border-white/[0.08] grid grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-white/50">Active Teams</span>
            <p className="text-sm font-bold text-white mt-0.5">{displayTeams.length} Squads</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/50">Avg. Velocity</span>
            <p className="text-sm font-bold text-violet-400 mt-0.5">{avgVelocity}%</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/50">Sprint Stability</span>
            <p className="text-sm font-bold text-emerald-400 mt-0.5">99.1%</p>
          </div>
        </div>
      </div>

      {/* Right Column: Squad Bandwidth & Load Overview */}
      <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0c0a2f]/70 p-5 sm:p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
        {/* Top Glow Accent Line */}
        <div className="absolute left-0 top-0 h-[2px] w-32 bg-[#5271ff] shadow-[0_0_12px_#5271ff]" />

        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5271ff]/10 border border-[#5271ff]/20 text-[#5271ff]">
                <Cpu className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Team Task Throughput
              </h2>
            </div>
            <span className="text-xs font-semibold text-white/50">Telemetry</span>
          </div>
          <p className="text-xs text-white/50 mb-4 font-medium">
            Task resolution breakdown, completed counts, and calculated execution rates.
          </p>

          <div className="space-y-3.5 max-h-[260px] overflow-y-auto custom-scrollbar pr-1">
            {displayTeams.map((team) => (
              <div
                key={team.teamId || team.teamName}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div>
                  <p className="text-xs font-bold text-white">{team.teamName}</p>
                  <p className="text-[10px] text-white/50 font-medium mt-0.5">
                    {team.completedTasks} / {team.totalTasks} tasks completed
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-violet-400">{team.executionVelocity?.toFixed(1)}% Velocity</span>
                  <span className="block text-[10px] text-emerald-400 font-semibold">{team.periodDays}d period</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Insight */}
        <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/60">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            No bottleneck blockers
          </span>
          <span className="flex items-center gap-1.5 text-white/50">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            SLA SLA Protected
          </span>
        </div>
      </div>
    </div>
  );
}
