"use client";

import React, { useEffect, useRef, useState } from "react";
import { Building2, Calendar, Clock3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ProjectStatusProps {
  progress: number;
  startDate?: string;
  dueDate?: string;
  managedBy?: string;
  clientCompany?: string;
}

export default function ProjectStatus({
  progress,
  startDate,
  dueDate,
  managedBy,
  clientCompany,
}: ProjectStatusProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const prevProgressRef = useRef(0);

  useEffect(() => {
    const next = Number(progress);
    if (!Number.isFinite(next)) {
      return;
    }

    const from = prevProgressRef.current;
    const to = Math.max(0, Math.min(100, Math.round(next)));
    const durationMs = 600;
    const startTime = performance.now();

    let rafId = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (to - from) * eased);
      setAnimatedProgress(value);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        prevProgressRef.current = to;
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [progress]);

  return (
    <Card className="overflow-hidden border border-v2-neutral-300 bg-v2-neutral-100 shadow-sm">
      <CardHeader className="pb-3 border-b border-v2-neutral-200/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-lg bg-v2-neutral-200 text-v2-neutral-600">
              <TrendingUp className="size-3.5" />
            </span>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-v2-neutral-400">
              Project Lifecycle
            </h3>
          </div>
          <span className="rounded-full bg-v2-neutral-200 px-2.5 py-1 text-[11px] font-semibold text-v2-neutral-600">
            {animatedProgress === 100
              ? "Completed"
              : animatedProgress > 0
              ? "In Execution"
              : "Planning"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 text-xs">
        {/* Progress Display */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold tracking-tight text-v2-neutral-600">
              {animatedProgress}%
            </span>
            <span className="text-[11px] font-medium text-v2-neutral-400">
              Deliverables Completed
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-v2-neutral-200">
            <div
              className="h-full rounded-full bg-v2-neutral-600 transition-all duration-500 ease-out"
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
        </div>

        {/* Metadata Details */}
        <div className="space-y-3 pt-3.5 border-t border-v2-neutral-200/80 text-v2-neutral-500">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-v2-neutral-400">
              <Building2 className="size-3.5 text-v2-neutral-400 shrink-0" />
              Client
            </span>
            <span className="font-semibold text-v2-neutral-600 truncate max-w-[160px] text-right">
              {clientCompany || managedBy || "No Client Assigned"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-v2-neutral-400">
              <Calendar className="size-3.5 text-v2-neutral-400 shrink-0" />
              Start Date
            </span>
            <span className="font-semibold text-v2-neutral-600">
              {startDate || "—"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-v2-neutral-400">
              <Clock3 className="size-3.5 text-v2-neutral-400 shrink-0" />
              Timeline
            </span>
            <span className="font-semibold text-v2-neutral-600">
              {dueDate || "—"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
