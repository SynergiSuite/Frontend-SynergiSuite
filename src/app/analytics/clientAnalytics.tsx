"use client";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Briefcase, ShieldCheck, HeartHandshake, DollarSign, Building2 } from "lucide-react";

const clientPortfolio = [
  { name: "Apex Global", value: 45, clients: 12, health: "Optimal", rev: "$180,000" },
  { name: "Nexus Innovations", value: 30, clients: 8, health: "Strong", rev: "$120,000" },
  { name: "Vanguard Tech", value: 15, clients: 5, health: "Good", rev: "$60,000" },
  { name: "Horizon Enterprise", value: 10, clients: 3, health: "Stable", rev: "$40,000" },
];

const COLORS = ["#5271ff", "#22d3ee", "#a78bfa", "#3a4ec4"];

const topClients = [
  { company: "Apex Global Systems", project: "Enterprise Cloud Migration", value: "$180k", status: "Active", retention: 99 },
  { company: "Nexus Innovations Inc.", project: "AI Workflow Engine", value: "$120k", status: "Active", retention: 96 },
  { company: "Vanguard Digital", project: "Cyber Security Suite", value: "$95k", status: "Review", retention: 94 },
];

export default function ClientAnalytics() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Client Revenue Share & Satisfaction */}
      <div className="lg:col-span-6 rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-5 sm:p-6 backdrop-blur-md shadow-lg flex flex-col justify-between relative overflow-hidden">
        {/* Top Glow Accent Line */}
        <div className="absolute left-0 top-0 h-[2px] w-32 bg-[#5271ff] shadow-[0_0_12px_#5271ff]" />

        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5271ff]/10 border border-[#5271ff]/20 text-[#5271ff]">
                <Briefcase className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Client Portfolio Value & Share
              </h2>
            </div>
            <span className="rounded-full border border-[#5271ff]/20 bg-[#5271ff]/10 px-3 py-0.5 text-[11px] font-semibold text-[#5271ff]">
              96.8% Retention
            </span>
          </div>
          <p className="text-xs text-white/40 mb-4 font-medium">
            Contract revenue distribution and satisfaction weight per key enterprise client group.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around my-2">
            {/* Donut Chart */}
            <div className="h-[180px] w-[180px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clientPortfolio}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                  >
                    {clientPortfolio.map((entry, index) => (
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
            <div className="flex flex-col gap-2.5 w-full max-w-[200px]">
              {clientPortfolio.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="truncate text-white/70 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-white shrink-0">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-white/40">Active Clients</span>
            <p className="text-sm font-bold text-white mt-0.5">28 Clients</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/40">Total Contract Value</span>
            <p className="text-sm font-bold text-[#5271ff] mt-0.5">$400,000</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/40">NPS Score</span>
            <p className="text-sm font-bold text-emerald-400 mt-0.5">4.9 / 5.0</p>
          </div>
        </div>
      </div>

      {/* Right Column: Key Client Relationships & Project Health */}
      <div className="lg:col-span-6 rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-5 sm:p-6 backdrop-blur-md shadow-lg flex flex-col justify-between relative overflow-hidden">
        {/* Top Glow Accent Line */}
        <div className="absolute left-0 top-0 h-[2px] w-32 bg-emerald-400 shadow-[0_0_12px_#10b981]" />

        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Client Relationship Health
              </h2>
            </div>
            <span className="text-xs font-semibold text-white/40">Real-time Telemetry</span>
          </div>
          <p className="text-xs text-white/40 mb-4 font-medium">
            Active key accounts, ongoing deliverables, and satisfaction health scores.
          </p>

          <div className="space-y-3.5">
            {topClients.map((client) => (
              <div
                key={client.company}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/70">
                    <Building2 className="h-4 w-4 text-[#5271ff]" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-white">{client.company}</p>
                    <p className="truncate text-[10px] text-white/40 font-medium">{client.project}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div>
                    <span className="text-xs font-extrabold text-white">{client.value}</span>
                    <span className="block text-[10px] text-emerald-400 font-semibold">{client.retention}% health</span>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                    <ShieldCheck className="h-3 w-3" />
                    {client.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Insight */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/50">
          <span className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
            Avg Contract Growth: +18.4% YoY
          </span>
          <span className="text-emerald-400 font-semibold">100% On-Time Delivery Rate</span>
        </div>
      </div>
    </div>
  );
}
