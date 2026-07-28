"use client";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Teams } from "./schemas/types";

interface TeamPerformanceProps {
  teams?: Teams[];
}

const defaultData = [
  { name: "Design", value: 85, completed: 85, total: 100 },
  { name: "Development", value: 92, completed: 92, total: 100 },
  { name: "Marketing", value: 70, completed: 70, total: 100 },
  { name: "Sales", value: 78, completed: 78, total: 100 },
];

const COLORS = ["#22d3ee", "#5271ff", "#a78bfa", "#3a4ec4", "#10b981", "#f59e0b"];

export default function TeamPerformance({ teams }: TeamPerformanceProps) {
  const chartData =
    Array.isArray(teams) && teams.length > 0
      ? teams.map((t) => {
          const total = t.totalTasks ?? 0;
          const completed = t.completedTasks ?? 0;
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
          return {
            name: t.name || "Unnamed Team",
            value: percentage,
            completed,
            total,
          };
        })
      : defaultData;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-white/[0.08] bg-[#0a0826]/95 p-3 shadow-xl backdrop-blur-md text-xs text-white">
          <p className="font-bold text-white mb-1">{data.name}</p>
          <p className="text-[#5271ff] font-semibold">
            Performance: {data.value}%
          </p>
          <p className="text-white/50 text-[11px] mt-0.5">
            {data.completed} of {data.total} tasks completed
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0a0826]/60 border border-white/[0.08] backdrop-blur-md rounded-2xl p-5 shadow-lg flex flex-col h-[320px]">
      <h2 className="text-lg font-bold text-white mb-2">Team Performance</h2>

      {/* Donut Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={4}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-white/60">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.15)]"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <span>{item.name} ({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
