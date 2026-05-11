"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type Role = {
  label: string;
  value: number;
};

type Props = {
  roles: Role[];
};

const COLORS = ["#4b4b4b", "#6E6E6E", "#8b8b8b", "#a8a8a8"];


export default function RoleDistribution({ roles }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Role Distribution</h2>

      {/* Pie Chart */}
      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={roles}
              dataKey="value"
              outerRadius={100}
              innerRadius={60} // makes it donut
              paddingAngle={2}
            >
              {roles.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            ></span>
            <span className="text-sm">{role.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
