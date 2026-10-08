"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Teams } from "./schemas/types";

interface TeamPerformanceProps {
  teams?: Teams[];
}

const defaultData = [
  { name: "Design", value: 85, completed: 85, total: 100 },
  { name: "Development", value: 92, completed: 92, total: 100 },
  { name: "Marketing", value: 70, completed: 70, total: 100 },
  { name: "Sales", value: 78, completed: 78, total: 100 },
];

const COLORS = ["#353536", "#706f70", "#acadb1", "#4f46e5", "#0ea5e9", "#10b981"];

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
        <div className="rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 p-3 text-xs shadow-lg">
          <p className="font-semibold text-v2-neutral-600 mb-1">{data.name}</p>
          <p className="text-v2-neutral-500 font-medium">
            Completion Rate: <span className="font-semibold text-v2-neutral-600">{data.value}%</span>
          </p>
          <p className="text-v2-neutral-400 text-[11px] mt-0.5">
            {data.completed} of {data.total} tasks completed
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex h-full flex-col min-h-[340px]">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-v2-neutral-200 text-v2-neutral-500">
            <Target className="size-4" />
          </span>
          <div>
            <CardTitle className="text-base">Team Performance</CardTitle>
            <CardDescription className="text-xs">
              Task completion efficiency across teams
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col items-center justify-between pt-2">
        <div className="h-[170px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={74}
                paddingAngle={4}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#ebedf1"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 flex w-full flex-wrap justify-center gap-x-4 gap-y-2 border-t border-v2-neutral-200/70 pt-3 text-xs text-v2-neutral-500">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="font-medium text-v2-neutral-600 truncate max-w-28">
                {item.name}
              </span>
              <span className="text-v2-neutral-400">({item.value}%)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
