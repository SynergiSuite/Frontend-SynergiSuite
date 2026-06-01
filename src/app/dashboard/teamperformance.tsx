"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { PieChart } from "lucide-react";

const segments = [
  { label: "Development", value: 55, color: "#5271ff", glow: "rgba(82,113,255,0.5)" },
  { label: "Design", value: 30, color: "#22d3ee", glow: "rgba(34,211,238,0.5)" },
  { label: "Marketing", value: 15, color: "#a78bfa", glow: "rgba(167,139,250,0.5)" },
];

// SVG donut parameters
const SIZE = 160;
const STROKE = 22;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;
const CX = SIZE / 2;
const CY = SIZE / 2;

// Pre-compute dash offset/array per segment
function buildArcs() {
  let offset = 0; // starting rotation offset in degrees
  return segments.map((seg) => {
    const fraction = seg.value / 100;
    const dashLength = fraction * CIRCUMFERENCE;
    const dashGap = CIRCUMFERENCE - dashLength;
    // strokeDashoffset positions each arc — we rotate each circle element
    const rotation = -90 + offset * 3.6; // 3.6 deg per %
    offset += seg.value;
    return { ...seg, dashLength, dashGap, rotation };
  });
}

const arcs = buildArcs();

export default function TeamPerformance() {
  const svgRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      svgRefs.current.forEach((el, i) => {
        if (!el) return;
        // Animate strokeDashoffset from full circumference (invisible) → 0 (full arc)
        const dashLen = arcs[i].dashLength;
        gsap.fromTo(
          el,
          { strokeDashoffset: CIRCUMFERENCE },
          {
            strokeDashoffset: CIRCUMFERENCE - dashLen,
            duration: 1.1,
            ease: "power3.inOut",
            delay: 0.15 + i * 0.2,
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0826]/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#5271ff]/20">
      {/* Top accent line */}
      <div className="absolute left-0 top-0 h-[2px] w-24 bg-gradient-to-r from-[#a78bfa] to-transparent" />

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Breakdown</p>
          <h2 className="mt-0.5 text-base font-semibold text-white">Team Performance</h2>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#a78bfa]/20 bg-[#a78bfa]/10">
          <PieChart size={16} className="text-[#a78bfa]" />
        </div>
      </div>

      {/* Chart + Legend */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
        {/* SVG Donut */}
        <div className="relative flex-shrink-0">
          <svg width={SIZE} height={SIZE} className="overflow-visible">
            {/* Background track */}
            <circle
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={STROKE}
            />
            {/* Animated arcs */}
            {arcs.map((arc, i) => (
              <circle
                key={arc.label}
                ref={(el) => { svgRefs.current[i] = el; }}
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke={arc.color}
                strokeWidth={STROKE - 2}
                strokeDasharray={`${arc.dashLength} ${arc.dashGap}`}
                strokeDashoffset={CIRCUMFERENCE}
                strokeLinecap="round"
                transform={`rotate(${arc.rotation} ${CX} ${CY})`}
                style={{ filter: `drop-shadow(0 0 6px ${arc.glow})` }}
              />
            ))}
          </svg>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">3</span>
            <span className="text-[10px] text-white/40">Teams</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex w-full max-w-[180px] flex-col gap-3">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-3">
              <div
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ background: `${seg.color}25`, border: `1px solid ${seg.color}40` }}
              >
                {seg.value}%
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">{seg.label}</p>
                <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${seg.value}%`,
                      background: seg.color,
                      boxShadow: `0 0 6px ${seg.glow}`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
