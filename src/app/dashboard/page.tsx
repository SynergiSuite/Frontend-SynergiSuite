"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import StateCards, { Card } from "./stateCard";
import ProjectOverview from "./projectoverview";
import TeamPerformance from "./teamperformance";
import RecentActivities from "./recentactivities";
import UpcomingDeadlines from "./upcomingdeadlines";
import ResourceAllocation from "./resourceallocation";
import { CookieManager } from "@/lib/cookieManager";

const cardsData: Card[] = [
  { title: "Active Projects", value: 24, change: "+12%", trend: "up", icon: "projects" },
  { title: "Team Members", value: 156, change: "+8%", trend: "up", icon: "team" },
  { title: "Active Clients", value: 38, change: "76% retention", trend: "up", icon: "clients", progress: 76 },
  { title: "Open Tasks", value: 284, change: "-4%", trend: "down", icon: "tasks" },
];

export default function Page() {
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Read user name from cookie for greeting
  const userName = typeof window !== "undefined"
    ? (CookieManager("get", "user") as string) || "there"
    : "there";

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger entrance for each major section
      gsap.from([headerRef.current, statsRef.current, chartsRef.current, bottomRef.current], {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
        clearProps: "all",
      });
    });
    return () => ctx.revert();
  }, []);

  // Get current date string
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Greeting based on hour
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative min-h-full w-full overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#5271ff]/[0.06] blur-[130px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-[#3a4ec4]/[0.06] blur-[120px]" />

      <div className="relative z-10 space-y-6">
        {/* Header / Greeting */}
        <div ref={headerRef}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#5271ff]/70">
                Dashboard Overview
              </p>
              <h1 className="mt-1 text-2xl font-bold text-white">
                {greeting},{" "}
                <span className="bg-gradient-to-r from-[#5271ff] to-[#a5b4fc] bg-clip-text text-transparent capitalize">
                  {userName}
                </span>{" "}
                👋
              </h1>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-xs text-white/40 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              {dateStr}
            </div>
          </div>

          {/* Thin separator glow line */}
          <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-transparent via-[#5271ff]/20 to-transparent" />
        </div>

        {/* Stat Cards Row */}
        <div ref={statsRef}>
          <StateCards cards={cardsData} />
        </div>

        {/* Charts Row */}
        <div ref={chartsRef} className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <ProjectOverview />
          <TeamPerformance />
        </div>

        {/* Bottom Row */}
        <div ref={bottomRef} className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          <RecentActivities />
          <UpcomingDeadlines />
          <ResourceAllocation />
        </div>
      </div>
    </div>
  );
}
