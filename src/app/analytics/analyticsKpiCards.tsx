"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Users, Briefcase, Zap, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AnalyticsTab } from "./analyticsHeader";
import { AnalyticsData } from "./schemas/analytics";

export type KpiItem = {
  id: string;
  title: string;
  domain: AnalyticsTab;
  value: number;
  prefix?: string;
  suffix?: string;
  change: string;
  isPositive: boolean;
  subtitle: string;
  color: string;
  glow: string;
};

interface AnalyticsKpiCardsProps {
  activeTab: AnalyticsTab;
  onSelectDomain: (domain: AnalyticsTab) => void;
  analyticsData?: AnalyticsData | null;
}

export default function AnalyticsKpiCards({
  activeTab,
  onSelectDomain,
  analyticsData,
}: AnalyticsKpiCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const kpiOverview = analyticsData?.kpiOverview;

  // Employee Productivity KPI Data
  const empProductivity = kpiOverview?.employeeProductivity;
  const employees = analyticsData?.employeeProductivity?.employees || [];
  const avgEmpProductivity = empProductivity?.averageProductivityIndex ?? (
    employees.length > 0
      ? employees.reduce((acc, curr) => acc + (curr.productivityIndex || 0), 0) / employees.length
      : 94.2
  );
  const totalEmployees = empProductivity?.totalEmployees ?? employees.length ?? 0;
  const topEmpName = empProductivity?.topEmployee?.userName;

  // Team Velocity KPI Data
  const teamVelocity = kpiOverview?.teamExecutionVelocity;
  const teams = analyticsData?.teamExecutionVelocity?.teams || [];
  const avgTeamVelocity = teamVelocity?.averageExecutionVelocity ?? (
    teams.length > 0
      ? teams.reduce((acc, curr) => acc + (curr.executionVelocity || 0), 0) / teams.length
      : 88.5
  );
  const totalTeams = teamVelocity?.totalTeams ?? teams.length ?? 0;
  const topTeamName = teamVelocity?.topTeam?.teamName;

  // Quarterly Growth KPI Data
  const quarterlyGrowth = kpiOverview?.quarterlyGrowth || analyticsData?.quarterlyGrowth;
  const growthIndex = quarterlyGrowth?.quarterlyGrowthIndex ?? 28.4;
  const growthChangePercent = quarterlyGrowth?.growthChangePercent ?? 5.2;
  const growthChange = `${growthChangePercent >= 0 ? "+" : ""}${growthChangePercent.toFixed(1)}%`;

  const kpis: KpiItem[] = [
    {
      id: "employee",
      title: "Employee Productivity Index",
      domain: "employee",
      value: Number(avgEmpProductivity.toFixed(1)),
      suffix: "%",
      change: "+4.1%",
      isPositive: true,
      subtitle: topEmpName
        ? `Top: ${topEmpName} • ${totalEmployees} evaluated`
        : `${totalEmployees} active employees evaluated`,
      color: "#22d3ee",
      glow: "rgba(34,211,238,0.3)",
    },
    {
      id: "client",
      title: "Client Retention & Value",
      domain: "client",
      value: 96.8,
      suffix: "%",
      change: "+2.4%",
      isPositive: true,
      subtitle: "$142.5k avg. annual contract value",
      color: "#5271ff",
      glow: "rgba(82,113,255,0.3)",
    },
    {
      id: "team",
      title: "Team Execution Velocity",
      domain: "team",
      value: Number(avgTeamVelocity.toFixed(1)),
      suffix: "%",
      change: "+6.8%",
      isPositive: true,
      subtitle: topTeamName
        ? `Top: ${topTeamName} • ${totalTeams} teams`
        : `${totalTeams} teams execution telemetry`,
      color: "#a78bfa",
      glow: "rgba(167,139,250,0.3)",
    },
    {
      id: "business",
      title: "Quarterly Growth Index",
      domain: "business",
      value: Number(growthIndex.toFixed(1)),
      prefix: growthIndex >= 0 ? "+" : "",
      suffix: "%",
      change: growthChange,
      isPositive: growthChangePercent >= 0,
      subtitle: "Projected revenue & output trajectory",
      color: "#10b981",
      glow: "rgba(16,185,129,0.3)",
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".kpi-value-target");
    cards.forEach((el, index) => {
      const targetVal = kpis[index]?.value ?? 0;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: targetVal,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => {
          if (el) {
            el.textContent = obj.val.toFixed(1);
          }
        },
      });
    });
  }, [activeTab, analyticsData]);

  const getDomainIcon = (domain: AnalyticsTab) => {
    switch (domain) {
      case "employee":
        return <Users className="h-4 w-4 text-cyan-400" />;
      case "client":
        return <Briefcase className="h-4 w-4 text-[#5271ff]" />;
      case "team":
        return <Zap className="h-4 w-4 text-violet-400" />;
      case "business":
        return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      default:
        return <Zap className="h-4 w-4 text-white" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {kpis.map((kpi) => {
        const isSelected = activeTab === kpi.domain;
        return (
          <div
            key={kpi.id}
            onClick={() => onSelectDomain(kpi.domain)}
            className={`group relative overflow-hidden rounded-2xl border p-5 backdrop-blur-md transition-all duration-300 cursor-pointer ${
              isSelected
                ? "border-[#5271ff]/50 bg-[#0c0a2f]/95 shadow-[0_0_30px_rgba(82,113,255,0.25)]"
                : "border-white/[0.08] bg-[#0c0a2f]/70 hover:border-white/20 hover:bg-[#0c0a2f]/90"
            }`}
          >
            {/* Top Glowing Color Stripe */}
            <div
              className="absolute left-0 top-0 h-[2px] w-full transition-all duration-300"
              style={{
                background: `linear-gradient(90deg, ${kpi.color}, transparent)`,
                boxShadow: `0 0 10px ${kpi.glow}`,
              }}
            />

            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60 group-hover:text-white/90 transition-colors">
                {kpi.title}
              </span>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-transform duration-300 group-hover:scale-110"
                style={{ borderColor: `${kpi.color}30`, background: `${kpi.color}15` }}
              >
                {getDomainIcon(kpi.domain)}
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {kpi.prefix && <span>{kpi.prefix}</span>}
                <span className="kpi-value-target">0.0</span>
                {kpi.suffix && <span>{kpi.suffix}</span>}
              </div>

              <div
                className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold border ${
                  kpi.isPositive
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {kpi.isPositive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {kpi.change}
              </div>
            </div>

            <p className="mt-3 text-[11px] font-medium text-white/50 group-hover:text-white/70 transition-colors line-clamp-1">
              {kpi.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
