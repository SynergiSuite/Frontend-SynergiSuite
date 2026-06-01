"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Users, Layout, CheckSquare, BarChart } from "lucide-react";

type StateCardProps = {
  title: string;
  value?: number | string; 
  change?: string;
};

const getIcon = (title: string) => {
  switch (title) {
    case "Total Teams":
      return <Users className="h-5 w-5 text-[#5271ff]" />;
    case "Active Projects":
      return <Layout className="h-5 w-5 text-cyan-400" />;
    case "Pending Tasks":
      return <CheckSquare className="h-5 w-5 text-amber-400" />;
    case "Reports":
      return <BarChart className="h-5 w-5 text-violet-400" />;
    default:
      return <Users className="h-5 w-5 text-[#5271ff]" />;
  }
};

function StateCard({ title, value, change }: StateCardProps) {
  const numberRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (value !== undefined && typeof value === "number" && numberRef.current) {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.innerText = String(Math.floor(obj.val));
          }
        },
      });
    }
  }, [value]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-5 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-[#5271ff]/30 hover:shadow-[0_0_20px_rgba(82,113,255,0.1)]">
      {/* Top blue corner line highlight */}
      <div className="absolute left-0 top-0 h-[2px] w-8 bg-[#5271ff]" />

      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-white/40">
            {title}
          </h3>
          {value !== undefined ? (
            <p
              ref={numberRef}
              className="text-3xl font-extrabold text-white mt-2 tracking-tight"
            >
              {typeof value === "number" ? 0 : value}
            </p>
          ) : (
            <p className="text-3xl font-extrabold text-white mt-2 tracking-tight">
              --
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] shadow-inner">
          {getIcon(title)}
        </div>
      </div>
      {change && (
        <p className="text-xs text-white/30 mt-3 font-medium flex items-center gap-1">
          {change}
        </p>
      )}
    </div>
  );
}

export default function StateCards({ states }: { states: StateCardProps[] }) {
  return (
    <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {states.map((state) => (
        <StateCard
          key={state.title}
          title={state.title}
          value={state.value}
          change={state.change}
        />
      ))}
    </div>
  );
}
