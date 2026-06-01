"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { BarChart2 } from "lucide-react";

const data = [
  { label: "In Progress", value: 12, color: "#5271ff" },
  { label: "Completed", value: 8, color: "#22d3ee" },
  { label: "On Hold", value: 3, color: "#a78bfa" },
  { label: "Delayed", value: 1, color: "#f59e0b" },
];

const maxValue = Math.max(...data.map((d) => d.value));
const gridLines = [0, 3, 6, 9, 12];
const containerHeight = 180;

export default function ProjectOverview() {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Bars grow upward from 0
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const targetHeight = bar.dataset.targetHeight || "0";
        bar.style.height = "0px";
        gsap.to(bar, {
          height: targetHeight + "px",
          duration: 0.9,
          ease: "power3.out",
          delay: 0.1 + i * 0.1,
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0826]/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#5271ff]/20">
      {/* Top accent line */}
      <div className="absolute left-0 top-0 h-[2px] w-24 bg-gradient-to-r from-[#5271ff] to-transparent" />

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Overview</p>
          <h2 className="mt-0.5 text-base font-semibold text-white">Project Status</h2>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#5271ff]/20 bg-[#5271ff]/10">
          <BarChart2 size={16} className="text-[#5271ff]" />
        </div>
      </div>

      {/* Chart area */}
      <div className="overflow-x-auto">
        <div className="relative flex min-w-[280px] gap-6 sm:min-w-0">
          {/* Y-axis grid */}
          <div
            className="relative mr-2 flex flex-col justify-between"
            style={{ height: containerHeight }}
          >
            {[...gridLines].reverse().map((num) => (
              <span key={num} className="text-[10px] text-white/25">
                {num}
              </span>
            ))}
          </div>

          {/* Bars + grid */}
          <div className="relative flex flex-1 items-end gap-4" style={{ height: containerHeight }}>
            {/* Horizontal grid lines */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
              {gridLines.map((_, i) => (
                <div
                  key={i}
                  className="w-full border-b border-white/[0.04]"
                />
              ))}
            </div>

            {data.map((item, i) => {
              const barH = Math.round((item.value / maxValue) * containerHeight);
              return (
                <div
                  key={item.label}
                  className="relative flex flex-1 flex-col items-center justify-end"
                  style={{ height: containerHeight }}
                >
                  {/* Value label on hover */}
                  <div
                    ref={(el) => {
                      barsRef.current[i] = el;
                    }}
                    data-target-height={barH}
                    className="w-full max-w-[44px] cursor-pointer rounded-t-lg transition-opacity duration-200"
                    style={{
                      background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}80 100%)`,
                      boxShadow: `0 -4px 16px ${item.color}40`,
                      height: 0,
                    }}
                  />
                  <span className="mt-2 text-center text-[10px] leading-tight text-white/40">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 border-t border-white/[0.05] pt-4">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }}
            />
            <span className="text-xs text-white/50">{item.label}</span>
            <span className="text-xs font-semibold text-white/80">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
