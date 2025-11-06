"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import React from "react";

const data = [
  { name: "Design", value: 85 },
  { name: "Development", value: 92 },
  { name: "Marketing", value: 70 },
  { name: "Sales", value: 78 },
];

const COLORS = ["#4b4b4b", "#6E6E6E", "#8b8b8b", "#a8a8a8"];

export default function TeamPerformance() {
  return (
    <>
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Team Performance</h2>

        {/* Donut Chart */}
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex justify-around mt-4 text-sm text-gray-600">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center space-x-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
