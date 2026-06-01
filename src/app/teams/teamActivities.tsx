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

// ✅ Sample dataset
const data = [
  { name: "Design", Completed: 40, Ongoing: 10 },
  { name: "Development", Completed: 70, Ongoing: 15 },
  { name: "Marketing", Completed: 25, Ongoing: 8 },
  { name: "Sales", Completed: 50, Ongoing: 18 },
];

// ✅ Reusable wrapper for all charts
export function ChartContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0a0826]/60 border border-white/[0.08] backdrop-blur-md rounded-2xl p-5 w-full h-[320px] flex flex-col shadow-lg">
      <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

// ✅ Main component
export default function TeamActivitiesChart() {
  return (
    <ChartContainer title="Team Activities">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barGap={6}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis dataKey="name" tick={{ fill: "rgba(255, 255, 255, 0.4)", fontSize: 11 }} stroke="rgba(255,255,255,0.08)" />
          <YAxis tick={{ fill: "rgba(255, 255, 255, 0.4)", fontSize: 11 }} stroke="rgba(255,255,255,0.08)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0a0826",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              fontSize: "12px",
            }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "rgba(255, 255, 255, 0.5)", fontWeight: "semibold", marginBottom: "4px" }}
          />
          <Bar dataKey="Completed" fill="#5271ff" radius={[4, 4, 0, 0]} barSize={18} />
          <Bar dataKey="Ongoing" fill="rgba(82, 113, 255, 0.35)" radius={[4, 4, 0, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
