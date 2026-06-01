"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Users } from "lucide-react";

type Role = {
  label: string;
  value: number;
};

type Props = {
  roles: Role[];
};

// Brand-aligned colors
const COLORS = ["#5271ff", "#22d3ee", "#a78bfa", "#f59e0b", "#34d399", "#fb7185"];

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: Role }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const entry = payload[0];
    return (
      <div className="rounded-xl border border-white/[0.08] bg-[#0f0c2e]/90 px-3 py-2 text-xs backdrop-blur-md">
        <p className="font-semibold text-white">{entry.payload.label}</p>
        <p className="text-white/50">{entry.value} employees</p>
      </div>
    );
  }
  return null;
}

export default function RoleDistribution({ roles }: Props) {
  const total = roles.reduce((sum, r) => sum + r.value, 0);

  if (roles.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03]">
          <Users size={20} className="text-white/30" />
        </div>
        <p className="text-sm text-white/30">No roles to display yet</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Breakdown</p>
        <h2 className="mt-0.5 text-base font-semibold text-white">Role Distribution</h2>
      </div>

      {/* Donut chart */}
      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={roles}
              dataKey="value"
              nameKey="label"
              outerRadius={90}
              innerRadius={58}
              paddingAngle={3}
              stroke="none"
            >
              {roles.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ filter: `drop-shadow(0 0 6px ${COLORS[index % COLORS.length]}60)` }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center overlay */}
        <div className="pointer-events-none absolute flex flex-col items-center">
          <span className="text-2xl font-bold text-white">{total}</span>
          <span className="text-[10px] text-white/40">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-col gap-2.5">
        {roles.map((role, idx) => {
          const color = COLORS[idx % COLORS.length];
          const pct = total > 0 ? Math.round((role.value / total) * 100) : 0;
          return (
            <div key={role.label} className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ background: color, boxShadow: `0 0 6px ${color}80` }}
              />
              <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
                <span className="truncate text-sm text-white/60">{role.label}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="h-1 w-14 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs font-semibold text-white/50">{pct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
