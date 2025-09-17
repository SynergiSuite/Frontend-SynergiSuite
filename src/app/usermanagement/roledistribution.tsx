"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function RoleDistribution() {
  const roles = [
    { label: "Analysts", value: 20, color: "#3B82F6" },   // blue
    { label: "Designers", value: 15, color: "#EC4899" },  // pink
    { label: "Developers", value: 40, color: "#22C55E" }, // green
    { label: "Managers", value: 10, color: "#EAB308" },   // yellow
    { label: "Support", value: 15, color: "#8B5CF6" },    // purple
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Role Distribution</h2>

      {/* Pie Chart */}
      <div className="flex justify-center">
        <ResponsiveContainer width={250} height={250}>
          <PieChart>
            <Pie
              data={roles}
              dataKey="value"
              outerRadius={100}
              innerRadius={60} // makes it donut
              paddingAngle={2}
            >
              {roles.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Labels under the chart */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {roles.map((role, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: role.color }}
            ></span>
            <span className="text-sm">{role.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

