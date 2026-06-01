"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Users, FolderOpen, UserCheck, Sparkles } from "lucide-react";
import { StatsCardProps } from "./schemas/stateCard";

const icons = [Users, UserCheck, FolderOpen, Sparkles];
const accentColors = ["#5271ff", "#22d3ee", "#a78bfa", "#f59e0b"];

function StatsCard({ title, value, change, index }: StatsCardProps & { index: number }) {
  const numRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = icons[index % icons.length];
  const accent = accentColors[index % accentColors.length];
  const numericValue = typeof value === "number" ? value : parseInt(String(value ?? "0"));

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (numRef.current && !isNaN(numericValue)) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: numericValue,
          duration: 1.3,
          ease: "power2.out",
          delay: 0.1 + index * 0.08,
          onUpdate: () => {
            if (numRef.current) {
              numRef.current.textContent = Math.round(obj.val).toLocaleString();
            }
          },
        });
      }
    });
    return () => ctx.revert();
  }, [numericValue, index]);

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0826]/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#5271ff]/25 hover:shadow-[0_0_20px_rgba(82,113,255,0.06)]"
    >
      {/* Corner accent line */}
      <div
        className="absolute left-0 top-0 h-[2px] w-16 transition-all duration-500 group-hover:w-28"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
          {title}
        </span>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110"
          style={{
            borderColor: `${accent}30`,
            background: `${accent}12`,
          }}
        >
          <Icon size={16} style={{ color: accent }} />
        </div>
      </div>

      <p ref={numRef} className="text-3xl font-bold tracking-tight text-white">
        {isNaN(numericValue) ? (value ?? "—") : "0"}
      </p>

      {change && (
        <p className="mt-1.5 text-xs text-white/35">{change}</p>
      )}
    </div>
  );
}

export default function StatsCards({ stats }: { stats: StatsCardProps[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => (
        <StatsCard key={stat.title} {...stat} index={i} />
      ))}
    </div>
  );
}
