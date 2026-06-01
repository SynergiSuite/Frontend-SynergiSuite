"use client";
import React, { useEffect, useRef, useState } from "react";

const ProjectStatus = ({ progress, startDate, dueDate, managedBy }: any) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const prevProgressRef = useRef(0);

  useEffect(() => {
    const next = Number(progress);
    if (!Number.isFinite(next)) {
      return;
    }

    const from = prevProgressRef.current;
    const to = Math.max(0, Math.min(100, next));
    const durationMs = 700;
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
    <>
      <div className="bg-[#0a0826]/40 border border-white/[0.08] backdrop-blur-md rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all duration-300 hover:border-[#5271ff]/30">
        {/* Left Glowing Accent */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#5271ff] to-[#3a4ec4]" />

        <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2.5">
          Project Status
        </h3>
        
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {animatedProgress}%
          </span>
          <span className="text-xs text-white/40 font-medium">Completed</span>
        </div>

        {/* Progress Slider Track */}
        <div className="w-full bg-white/[0.06] rounded-full h-1.5 mt-3.5 overflow-hidden border border-white/[0.04]">
          <div
            className="bg-gradient-to-r from-[#5271ff] to-cyan-400 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_#5271ff]"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>

        {/* Metadata Details */}
        <div className="pt-4 space-y-2.5 border-t border-white/[0.06] mt-4.5 text-xs font-medium text-white/50">
          <p className="flex justify-between items-center">
            <span>Managed by</span>
            <span className="text-white font-semibold">{managedBy || "No Client"}</span>
          </p>
          <p className="flex justify-between items-center">
            <span>Start Date</span>
            <span className="text-white/90 font-semibold">{startDate}</span>
          </p>
          <p className="flex justify-between items-center">
            <span>Due Date</span>
            <span className="text-[#5271ff] font-semibold">{dueDate}</span>
          </p>
        </div>
      </div>
    </>
  );
};


export default ProjectStatus;
