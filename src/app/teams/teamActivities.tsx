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
import { Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Teams } from "./schemas/types";

interface TeamActivitiesChartProps {
  teams?: Teams[];
}

const defaultData = [
  { name: "Design", Completed: 40, Ongoing: 10 },
  { name: "Development", Completed: 70, Ongoing: 15 },
  { name: "Marketing", Completed: 25, Ongoing: 8 },
  { name: "Sales", Completed: 50, Ongoing: 18 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 p-3 text-xs shadow-lg">
        <p className="font-semibold text-v2-neutral-600 mb-1.5">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4 text-v2-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-v2-neutral-500" />
              Completed:
            </span>
            <span className="font-semibold text-v2-neutral-600">{payload[0]?.value ?? 0}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-v2-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-v2-neutral-300" />
              Ongoing:
            </span>
            <span className="font-semibold text-v2-neutral-600">{payload[1]?.value ?? 0}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function TeamActivitiesChart({ teams }: TeamActivitiesChartProps) {
  const chartData =
    Array.isArray(teams) && teams.length > 0
      ? teams.map((team) => ({
          name: team.name || "Unnamed Team",
          Completed: team.completedTasks ?? 0,
          Ongoing: team.ongoingTasks ?? 0,
          Total: team.totalTasks ?? 0,
        }))
      : defaultData;

  return (
    <Card className="flex h-full flex-col min-h-[340px]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-v2-neutral-200 text-v2-neutral-500">
              <Activity className="size-4" />
            </span>
            <div>
              <CardTitle className="text-base">Team Activities</CardTitle>
              <CardDescription className="text-xs">
                Completed vs ongoing tasks per squad
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-v2-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-v2-neutral-500" />
              Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-v2-neutral-300" />
              Ongoing
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-[220px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={6}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ebedf1" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#706f70", fontSize: 11 }}
              axisLine={{ stroke: "#d4d8df" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#706f70", fontSize: 11 }}
              axisLine={{ stroke: "#d4d8df" }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Completed" fill="#353536" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="Ongoing" fill="#acadb1" radius={[4, 4, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
