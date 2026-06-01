"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CalendarDays, Clock } from "lucide-react";

const deadlines = [
  { project: "E-commerce Platform", date: "Dec 15, 2024", daysLeft: 8 },
  { project: "Mobile App Development", date: "Dec 20, 2024", daysLeft: 13 },
  { project: "Website Redesign", date: "Dec 25, 2024", daysLeft: 18 },
];

function getUrgency(days: number): {
  bg: string;
  border: string;
  text: string;
  label: string;
} {
  if (days <= 10)
    return {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400",
      label: "Urgent",
    };
  if (days <= 15)
    return {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      label: "Soon",
    };
  return {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    label: "On Track",
  };
}

export default function UpcomingDeadlines() {
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      rowsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          opacity: 0,
          y: 12,
          duration: 0.45,
          ease: "power3.out",
          delay: 0.3 + i * 0.1,
          clearProps: "all",
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0826]/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#5271ff]/20">
      {/* Top accent line */}
      <div className="absolute left-0 top-0 h-[2px] w-20 bg-gradient-to-r from-[#f59e0b] to-transparent" />

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Schedule</p>
          <h2 className="mt-0.5 text-base font-semibold text-white">Upcoming Deadlines</h2>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f59e0b]/20 bg-[#f59e0b]/10">
          <CalendarDays size={16} className="text-[#f59e0b]" />
        </div>
      </div>

      {/* Deadline rows */}
      <div className="space-y-3">
        {deadlines.map((item, i) => {
          const urgency = getUrgency(item.daysLeft);
          return (
            <div
              key={item.project}
              ref={(el) => { rowsRef.current[i] = el; }}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition-colors duration-200 hover:border-white/[0.08] hover:bg-white/[0.03]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white/90">{item.project}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-white/35">
                  <Clock size={10} />
                  <span>{item.date}</span>
                </div>
              </div>

              {/* Urgency badge */}
              <div
                className={`flex-shrink-0 rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${urgency.bg} ${urgency.border} ${urgency.text}`}
              >
                {urgency.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
