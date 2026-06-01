"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Activity } from "lucide-react";

const activities = [
  {
    name: "Sarah Chen",
    action: "Updated the UI design for Project X",
    time: "2 hours ago",
    initials: "SC",
    color: "#5271ff",
  },
  {
    name: "Michael Park",
    action: "Completed sprint planning for Team Alpha",
    time: "4 hours ago",
    initials: "MP",
    color: "#22d3ee",
  },
  {
    name: "Emily Rodriguez",
    action: "Added new client project requirements",
    time: "5 hours ago",
    initials: "ER",
    color: "#a78bfa",
  },
];

export default function RecentActivities() {
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      rowsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          opacity: 0,
          x: -16,
          duration: 0.5,
          ease: "power3.out",
          delay: 0.25 + i * 0.12,
          clearProps: "all",
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0826]/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#5271ff]/20">
      {/* Top accent line */}
      <div className="absolute left-0 top-0 h-[2px] w-20 bg-gradient-to-r from-[#22d3ee] to-transparent" />

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Live Feed</p>
          <h2 className="mt-0.5 text-base font-semibold text-white">Recent Activities</h2>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#22d3ee]/20 bg-[#22d3ee]/10">
          <Activity size={16} className="text-[#22d3ee]" />
        </div>
      </div>

      {/* Activity rows */}
      <div className="relative space-y-4">
        {/* Vertical timeline line */}
        <div className="absolute left-[17px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-white/10 via-white/[0.04] to-transparent" />

        {activities.map((item, i) => (
          <div
            key={item.name}
            ref={(el) => { rowsRef.current[i] = el; }}
            className="flex gap-3"
          >
            {/* Avatar */}
            <div
              className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ring-2 ring-[#030114]"
              style={{
                background: `linear-gradient(135deg, ${item.color}40, ${item.color}20)`,
                border: `1px solid ${item.color}50`,
                boxShadow: `0 0 10px ${item.color}30`,
              }}
            >
              {item.initials}
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-sm font-semibold text-white/90">{item.name}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-white/45">{item.action}</p>
              <p className="mt-1 text-[10px] font-medium text-white/25">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
