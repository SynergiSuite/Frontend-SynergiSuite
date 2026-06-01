"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Cpu } from "lucide-react";

const resources = [
  {
    name: "Development",
    value: 85,
    color: "#5271ff",
    glow: "rgba(82,113,255,0.5)",
    from: "#5271ff",
    to: "#3a4ec4",
  },
  {
    name: "Design",
    value: 70,
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.5)",
    from: "#22d3ee",
    to: "#06b6d4",
  },
  {
    name: "Marketing",
    value: 60,
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.5)",
    from: "#a78bfa",
    to: "#7c3aed",
  },
];

export default function ResourceAllocation() {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      barsRef.current.forEach((el, i) => {
        if (!el) return;
        const target = el.dataset.target || "0";
        gsap.from(el, {
          width: "0%",
          duration: 1.1,
          ease: "power3.out",
          delay: 0.25 + i * 0.15,
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0826]/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#5271ff]/20">
      {/* Top accent line */}
      <div className="absolute left-0 top-0 h-[2px] w-20 bg-gradient-to-r from-[#a78bfa] to-transparent" />

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Capacity</p>
          <h2 className="mt-0.5 text-base font-semibold text-white">Resource Allocation</h2>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#a78bfa]/20 bg-[#a78bfa]/10">
          <Cpu size={16} className="text-[#a78bfa]" />
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-5">
        {resources.map((item, i) => (
          <div key={item.name}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: item.color, boxShadow: `0 0 6px ${item.glow}` }}
                />
                <span className="text-sm font-medium text-white/70">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-white/50">{item.value}%</span>
            </div>

            {/* Track */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
              <div
                ref={(el) => { barsRef.current[i] = el; }}
                data-target={`${item.value}%`}
                className="h-full rounded-full"
                style={{
                  width: `${item.value}%`,
                  background: `linear-gradient(90deg, ${item.from}, ${item.to})`,
                  boxShadow: `0 0 10px ${item.glow}`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary footer */}
      <div className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-2.5">
        <span className="text-xs text-white/35">Overall utilisation</span>
        <span className="text-sm font-bold text-white/80">
          {Math.round(resources.reduce((acc, r) => acc + r.value, 0) / resources.length)}%
        </span>
      </div>
    </div>
  );
}
