"use client";

import React from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Layers,
  ListTodo,
  PlayCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface QuickStatsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    blocked: number;
    todo: number;
  };
}

export default function QuickStats({ stats }: QuickStatsProps) {
  return (
    <Card className="overflow-hidden border border-v2-neutral-300 bg-v2-neutral-100 shadow-sm">
      <CardHeader className="pb-3 border-b border-v2-neutral-200/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-lg bg-v2-neutral-200 text-v2-neutral-600">
              <BarChart3 className="size-3.5" />
            </span>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-v2-neutral-400">
              Task Breakdown
            </h3>
          </div>
          <span className="rounded-full bg-v2-neutral-200 px-2.5 py-1 text-[11px] font-semibold text-v2-neutral-600">
            {stats.total} Total
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          {/* In Progress */}
          <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 text-sky-900 transition-colors">
            <div className="flex items-center justify-between text-[11px] text-sky-700 mb-1.5 font-medium">
              <span>In Progress</span>
              <PlayCircle className="size-3.5 text-sky-600 shrink-0" />
            </div>
            <span className="text-xl font-bold tracking-tight text-sky-950">
              {stats.inProgress}
            </span>
          </div>

          {/* Completed */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-emerald-900 transition-colors">
            <div className="flex items-center justify-between text-[11px] text-emerald-700 mb-1.5 font-medium">
              <span>Completed</span>
              <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
            </div>
            <span className="text-xl font-bold tracking-tight text-emerald-950">
              {stats.completed}
            </span>
          </div>

          {/* Todo */}
          <div className="rounded-xl border border-v2-neutral-300 bg-v2-neutral-200/50 p-3.5 text-v2-neutral-600 transition-colors">
            <div className="flex items-center justify-between text-[11px] text-v2-neutral-400 mb-1.5 font-medium">
              <span>To Do</span>
              <ListTodo className="size-3.5 text-v2-neutral-500 shrink-0" />
            </div>
            <span className="text-xl font-bold tracking-tight text-v2-neutral-600">
              {stats.todo}
            </span>
          </div>

          {/* Blocked */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-rose-900 transition-colors">
            <div className="flex items-center justify-between text-[11px] text-rose-700 mb-1.5 font-medium">
              <span>Blocked</span>
              <AlertCircle className="size-3.5 text-rose-600 shrink-0" />
            </div>
            <span className="text-xl font-bold tracking-tight text-rose-950">
              {stats.blocked}
            </span>
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div className="pt-3 border-t border-v2-neutral-200/80">
          <div className="flex items-center justify-between text-[11px] text-v2-neutral-400 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <Layers className="size-3.5 text-v2-neutral-400" />
              Delivery Velocity
            </span>
            <span className="font-semibold text-v2-neutral-600">
              {stats.total > 0
                ? Math.round((stats.completed / stats.total) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-v2-neutral-200">
            <div
              className="h-full rounded-full bg-v2-neutral-600 transition-all duration-500"
              style={{
                width: `${
                  stats.total > 0
                    ? Math.round((stats.completed / stats.total) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

