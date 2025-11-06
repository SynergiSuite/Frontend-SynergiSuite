"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
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
// This ensures consistent size and styling across all charts
export function ChartContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-5 w-full h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">{title}</h2>
      <div className="flex-1">{children}</div>
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
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 12 }} />
          <YAxis tick={{ fill: "#555", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="Completed" fill="#4b4b4b" radius={[10, 10, 10, 10]} />
          <Bar dataKey="Ongoing" fill="#a9a9a9" radius={[10, 10, 10, 10]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
