"use client";
import React, { useEffect, useRef, useState } from "react";

const ProjectStatus = ({ progress, startDate, dueDate }: any) => {
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
      <div className="overview-card p-4">
        <h3 className="font-semibold mb-2">Project Status</h3>
        <p className="text-2xl font-bold">{animatedProgress}%</p>
        <p className="text-sm mt-2">Start: {startDate}</p>
        <p className="text-sm">Due: {dueDate}</p>
      </div>
    </>
  );
};

export default ProjectStatus;
