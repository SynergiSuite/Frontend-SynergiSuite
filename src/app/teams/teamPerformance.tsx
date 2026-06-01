"use client";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Design", value: 85 },
  { name: "Development", value: 92 },
  { name: "Marketing", value: 70 },
  { name: "Sales", value: 78 },
];

const COLORS = ["#22d3ee", "#5271ff", "#a78bfa", "#3a4ec4"];

export default function TeamPerformance() {
  return (
    <div className="bg-[#0a0826]/60 border border-white/[0.08] backdrop-blur-md rounded-2xl p-5 shadow-lg flex flex-col h-[320px]">
      <h2 className="text-lg font-bold text-white mb-2">Team Performance</h2>

      {/* Donut Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
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

      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-white/60">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.15)]"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
