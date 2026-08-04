"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CookieManager } from "@/lib/cookieManager";
import AnalyticsHeader, { AnalyticsTab, TimeRange } from "./analyticsHeader";
import AnalyticsKpiCards from "./analyticsKpiCards";
import EmployeeAnalytics from "./employeeAnalytics";
import ClientAnalytics from "./clientAnalytics";
import TeamAnalytics from "./teamAnalytics";
import BusinessAnalytics from "./businessAnalytics";
import { getAnalyticsIndexesApi } from "./apis/getAnalyticsIndexesApi";
import getEmployeeAnalyticsApi from "./apis/getEmployeeAnalyticsApi";
import {
  AnalyticsData,
  AnalyticsIndexesResponse,
  EmployeeTelemetryResponse,
} from "./schemas/analytics";

function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getDateRange(range: TimeRange): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date();

  switch (range) {
    case "7d":
      start.setDate(end.getDate() - 7);
      break;
    case "30d":
      start.setDate(end.getDate() - 30);
      break;
    case "90d":
      start.setDate(end.getDate() - 90);
      break;
    case "ytd":
      start.setMonth(0, 1);
      break;
  }

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [employeeTelemetry, setEmployeeTelemetry] = useState<EmployeeTelemetryResponse | null>(null);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState<boolean>(false);
  const [employeeError, setEmployeeError] = useState<string | null>(null);

  const [telemetryInfo, setTelemetryInfo] = useState<{
    source: "cache" | "calculated";
    calculatedAt: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Role Access Guard
  useEffect(() => {
    const userRole = String(
      CookieManager("get", "primary_role") || CookieManager("get", "role") || ""
    ).toLowerCase();
    setRole(userRole);
    const isFounder = userRole.includes("founder");
    const isManager = userRole.includes("manager") || userRole.includes("admin");

    if (!isFounder && !isManager) {
      toast.error("Analytics is restricted to Managers and Founders.");
      router.replace(userRole === "client" ? "/projects" : "/dashboard");
    }
  }, [router]);

  const isManager = role.includes("manager") && !role.includes("founder");

  const visibleEmployees = useMemo(() => {
    const all = employeeTelemetry?.employees || [];
    if (isManager) {
      return all.filter((emp) => {
        const roleName = String(emp.role?.name || "").toLowerCase();
        const roleId = emp.role?.id;
        return roleId !== 1 && !roleName.includes("founder");
      });
    }
    return all;
  }, [employeeTelemetry?.employees, isManager]);

  const fetchAnalyticsData = useCallback(async (range: TimeRange) => {
    try {
      setIsLoading(true);
      const { startDate, endDate } = getDateRange(range);
      const res: AnalyticsIndexesResponse = await getAnalyticsIndexesApi(startDate, endDate);

      setAnalyticsData(res.data);
      setTelemetryInfo({
        source: res.source,
        calculatedAt: res.calculatedAt,
      });

      setIsEmployeeLoading(true);
      setEmployeeError(null);
      try {
        const empRes = await getEmployeeAnalyticsApi({ startDate, endDate });
        setEmployeeTelemetry(empRes);
      } catch (empErr) {
        console.warn("Could not fetch detailed employee telemetry:", empErr);
        setEmployeeError(empErr instanceof Error ? empErr.message : "Failed to fetch employee telemetry");
      } finally {
        setIsEmployeeLoading(false);
      }
    } catch (err) {
      console.error("Failed to load analytics data:", err);
      const msg = err instanceof Error ? err.message : "Failed to load analytics indexes";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAnalyticsData(timeRange);
  }, [timeRange, fetchAnalyticsData]);

  // GSAP Entrance Stagger Animation on Tab or Data change
  useEffect(() => {
    if (isLoading || !containerRef.current) return;
    const ctx = gsap.context(() => {
      const targets = containerRef.current?.querySelectorAll(".analytics-animate-item");
      if (targets && targets.length > 0) {
        gsap.killTweensOf(targets);
        gsap.fromTo(
          targets,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [activeTab, isLoading]);

  return (
    <div ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-[#030114] text-white">
      {/* Ambient Radial Background Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#5271ff]/[0.08] blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 right-0 h-[450px] w-[450px] rounded-full bg-[#a78bfa]/[0.06] blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-[#22d3ee]/[0.06] blur-[110px]" />

      <div className="relative z-10 space-y-8 max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="analytics-animate-item">
          <AnalyticsHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            calculatedAt={telemetryInfo?.calculatedAt}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/50">
            <Loader2 className="h-8 w-8 animate-spin text-[#5271ff]" />
            <p className="text-xs font-semibold tracking-wide">Loading workspace analytics indexes...</p>
          </div>
        ) : (
          <>
            {/* Top Metric Cards */}
            <div className="analytics-animate-item">
              <AnalyticsKpiCards
                activeTab={activeTab}
                onSelectDomain={setActiveTab}
                analyticsData={analyticsData}
              />
            </div>

            {/* Analytics Sections Content */}
            <div ref={contentRef} className="space-y-8">
              {/* Employee Analytics Section */}
              {(activeTab === "all" || activeTab === "employee") && (
                <div className="analytics-animate-item space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 pl-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    Employee Performance Telemetry
                  </div>
                  <EmployeeAnalytics
                    employees={visibleEmployees}
                    summary={employeeTelemetry?.summary}
                    startDate={getDateRange(timeRange).startDate}
                    endDate={getDateRange(timeRange).endDate}
                    isLoading={isEmployeeLoading}
                    error={employeeError}
                    onRetry={() => void fetchAnalyticsData(timeRange)}
                  />
                </div>
              )}

              {/* Client Analytics Section */}
              {(activeTab === "all" || activeTab === "client") && (
                <div className="analytics-animate-item space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5271ff] pl-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5271ff] shadow-[0_0_8px_#5271ff]" />
                    Client Account & Revenue Analytics
                  </div>
                  <ClientAnalytics
                    clients={analyticsData?.clients}
                    summary={analyticsData?.summary}
                  />
                </div>
              )}

              {/* Team Analytics Section */}
              {(activeTab === "all" || activeTab === "team") && (
                <div className="analytics-animate-item space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400 pl-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
                    Team Squad Velocity & Load Balancer
                  </div>
                  <TeamAnalytics teams={analyticsData?.teamExecutionVelocity?.teams} />
                </div>
              )}

              {/* Business Analytics Section */}
              {(activeTab === "all" || activeTab === "business") && (
                <div className="analytics-animate-item space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 pl-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                    Business Financial & Growth Trajectory
                  </div>
                  <BusinessAnalytics quarterlyGrowth={analyticsData?.quarterlyGrowth} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
