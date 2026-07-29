"use client";
import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { Users, Award, Clock, CheckCircle2 } from "lucide-react";
import { EmployeeProductivity } from "./schemas/analytics";

const fallbackEmployees: EmployeeProductivity[] = [
  { userId: 1, userName: "Alex Rivers", userEmail: "alex@company.com", productivityIndex: 98, statusMovementScore: 40, taskUpdateScore: 58, statusChanges: 12, taskUpdates: 30 },
  { userId: 2, userName: "Elena Rostova", userEmail: "elena@company.com", productivityIndex: 95, statusMovementScore: 38, taskUpdateScore: 57, statusChanges: 10, taskUpdates: 28 },
  { userId: 3, userName: "Marcus Vance", userEmail: "marcus@company.com", productivityIndex: 88, statusMovementScore: 35, taskUpdateScore: 53, statusChanges: 9, taskUpdates: 26 },
  { userId: 4, userName: "Sophia Chen", userEmail: "sophia@company.com", productivityIndex: 96, statusMovementScore: 39, taskUpdateScore: 57, statusChanges: 11, taskUpdates: 29 },
  { userId: 5, userName: "David Kim", userEmail: "david@company.com", productivityIndex: 89, statusMovementScore: 34, taskUpdateScore: 55, statusChanges: 8, taskUpdates: 23 },
];

interface EmployeeAnalyticsProps {
  employees?: EmployeeProductivity[];
}

export default function EmployeeAnalytics({ employees }: EmployeeAnalyticsProps) {
  const displayEmployees = (employees && employees.length > 0) ? employees : fallbackEmployees;

  // Compute average productivity
  const avgProductivity = displayEmployees.length > 0
    ? (displayEmployees.reduce((acc, curr) => acc + (curr.productivityIndex || 0), 0) / displayEmployees.length).toFixed(1)
    : "93.2";

  // Map for Recharts bar chart
  const chartData = displayEmployees.map((emp) => ({
    name: emp.userName || `User ${emp.userId}`,
    productivity: Number(emp.productivityIndex || 0),
    statusChanges: emp.statusChanges || 0,
    taskUpdates: emp.taskUpdates || 0,
  }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Workload Capacity vs Output Chart */}
      <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0c0a2f]/70 p-5 sm:p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
        {/* Top Glow Accent Line */}
        <div className="absolute left-0 top-0 h-[2px] w-32 bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />

        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Users className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Employee Productivity Index
              </h2>
            </div>
            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-0.5 text-[11px] font-semibold text-cyan-400">
              Avg. {avgProductivity}% Efficiency
            </span>
          </div>
          <p className="text-xs text-white/50 mb-6 font-medium">
            Calculated productivity scores based on status movement, task updates, and SLA resolution velocity.
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
                  tick={{ fill: "rgba(255, 255, 255, 0.6)", fontSize: 11 }}
                  stroke="rgba(255,255,255,0.08)"
                />
                <YAxis
                  tick={{ fill: "rgba(255, 255, 255, 0.6)", fontSize: 11 }}
                  stroke="rgba(255,255,255,0.08)"
                />
                <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.2)" />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                  contentStyle={{
                    backgroundColor: "#0c0a2f",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    fontSize: "12px",
                    color: "#fff",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600, marginBottom: "4px" }}
                />
                <Bar dataKey="productivity" name="Productivity Index" barSize={16}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.productivity >= 0 ? "#22d3ee" : "#f43f5e"}
                    />
                  ))}
                </Bar>
                <Bar dataKey="taskUpdates" name="Task Updates" fill="rgba(82, 113, 255, 0.5)" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="mt-4 pt-4 border-t border-white/[0.08] grid grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-white/50">Total Evaluated</span>
            <p className="text-sm font-bold text-white mt-0.5">{displayEmployees.length} Employees</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/50">Avg Index</span>
            <p className={`text-sm font-bold mt-0.5 ${Number(avgProductivity) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {avgProductivity}%
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/50">Status Score</span>
            <p className="text-sm font-bold text-cyan-400 mt-0.5">High Velocity</p>
          </div>
        </div>
      </div>

      {/* Right Column: Top Performers Leaderboard */}
      <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0c0a2f]/70 p-5 sm:p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
        {/* Top Glow Accent Line */}
        <div className="absolute left-0 top-0 h-[2px] w-32 bg-[#5271ff] shadow-[0_0_12px_#5271ff]" />

        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5271ff]/10 border border-[#5271ff]/20 text-[#5271ff]">
                <Award className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Top Performers Roster
              </h2>
            </div>
            <span className="text-xs font-semibold text-white/50">Telemetry</span>
          </div>
          <p className="text-xs text-white/50 mb-4 font-medium">
            Ranked individual productivity scores, status movements, and task updates.
          </p>

          {/* Employee Leaderboard List */}
          <div className="space-y-3.5 max-h-[260px] overflow-y-auto custom-scrollbar pr-1">
            {displayEmployees.slice(0, 5).map((emp, index) => (
              <div
                key={emp.userId || emp.userName}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/15 text-xs font-bold text-white">
                    #{index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-white">{emp.userName}</p>
                    <p className="truncate text-[10px] text-white/50 font-medium">{emp.userEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className={`text-xs font-extrabold ${(emp.productivityIndex || 0) >= 0 ? "text-white" : "text-rose-400"}`}>
                      {emp.productivityIndex?.toFixed(1)} Index
                    </span>
                    <span className="block text-[10px] text-emerald-400 font-semibold">{emp.taskUpdates || 0} updates</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Quick Insight */}
        <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/60">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#5271ff]" />
            Real-time Calculated Telemetry
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Active SLA Compliance
          </span>
        </div>
      </div>
    </div>
  );
}
