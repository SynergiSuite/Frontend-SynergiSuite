"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TrendingUp, TrendingDown, Users, FolderOpen, Building2, CheckSquare } from "lucide-react";

export type Card = {
  title: string;
  value: number | string;
  change: string;
  trend: "up" | "down";
  icon: "projects" | "team" | "clients" | "tasks";
  progress?: number;
};

const iconMap = {
  projects: FolderOpen,
  team: Users,
  clients: Building2,
  tasks: CheckSquare,
};

const accentColors: Record<Card["icon"], string> = {
  projects: "#5271ff",
  team: "#22d3ee",
  clients: "#a78bfa",
  tasks: "#f59e0b",
};

function StateCard({ title, value, change, trend, icon, progress }: Card) {
  const numRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = iconMap[icon];
  const accent = accentColors[icon];
  const isPositive = trend === "up";
  const numericValue = typeof value === "number" ? value : parseInt(String(value));

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card entrance
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.05,
        clearProps: "all",
      });

      // Number counter
      if (numRef.current && !isNaN(numericValue)) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: numericValue,
          duration: 1.4,
          ease: "power2.out",
          delay: 0.2,
          onUpdate: () => {
            if (numRef.current) {
              numRef.current.textContent = Math.round(obj.val).toLocaleString();
            }
          },
        });
      }

      // Progress bar
      if (progressRef.current && progress !== undefined) {
        gsap.from(progressRef.current, {
          width: "0%",
          duration: 1.2,
          ease: "power2.out",
          delay: 0.4,
        });
      }
    });
    return () => ctx.revert();
  }, [numericValue, progress]);

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0826]/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#5271ff]/30 hover:shadow-[0_0_25px_rgba(82,113,255,0.08)]"
    >
      {/* Top corner accent line */}
      <div
        className="absolute left-0 top-0 h-[2px] w-20 rounded-tr-full transition-all duration-500 group-hover:w-32"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      {/* Icon + title row */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
          {title}
        </span>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110"
          style={{
            borderColor: `${accent}30`,
            background: `${accent}12`,
            boxShadow: `0 0 14px ${accent}20`,
          }}
        >
          <Icon size={16} style={{ color: accent }} />
        </div>
      </div>

      {/* Big number */}
      <div className="flex items-baseline gap-2">
        <span
          ref={numRef}
          className="text-4xl font-bold tracking-tight text-white"
        >
          {isNaN(numericValue) ? value : "0"}
        </span>
      </div>

      {/* Change indicator */}
      <div className="mt-2 flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp size={13} className="text-emerald-400" />
        ) : (
          <TrendingDown size={13} className="text-red-400" />
        )}
        <span className={`text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {change}
        </span>
        <span className="text-xs text-white/25">vs last month</span>
      </div>

      {/* Optional progress bar */}
      {progress !== undefined && (
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              ref={progressRef}
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${accent}, ${accent}99)`,
                boxShadow: `0 0 8px ${accent}60`,
              }}
            />
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-[10px] text-white/30">Allocation</span>
            <span className="text-[10px] font-medium text-white/40">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StateCards({ cards }: { cards: Card[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <StateCard key={index} {...card} />
      ))}
    </div>
  );
}
