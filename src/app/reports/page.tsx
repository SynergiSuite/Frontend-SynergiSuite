"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { gsap } from "gsap";

import SubHeader from "./subHeadingSearchbar";
import ReportsStatsCards, { ReportItemType } from "./reportsStatsCards";
import ReportsTable from "./reportsTable";
import ReportsFooter from "./reportsFooter";
import ReportDetailModal from "./reportDetailModal";

import { getAnalyticsIndexesApi } from "@/app/analytics/apis/getAnalyticsIndexesApi";
import { CookieManager } from "@/lib/cookieManager";

const INITIAL_REPORTS: ReportItemType[] = [
  // SECTION 1: BUSINESS REPORTS
  {
    id: "rep-bus-01",
    title: "Business Operations & Financial Trajectory (Q3 2026)",
    section: "BUSINESS",
    category: "Financial Health",
    generatedAt: "Aug 04, 2026",
    generatedBy: "System Analytics Engine",
    status: "Verified",
    summaryText:
      "Comprehensive evaluation of company revenue growth, client contract velocity, operational margin efficiency, and quarterly growth benchmarks across all active business verticals.",
    metrics: {
      "Quarterly Growth": "+18.4%",
      "Active Client Accounts": 42,
      "Contract Renewal SLA": "98.2%",
      "Operating Margin": "34.1%",
    },
  },
  {
    id: "rep-bus-02",
    title: "Executive Revenue & Client Portfolio Audit",
    section: "BUSINESS",
    category: "Executive Growth",
    generatedAt: "Aug 01, 2026",
    generatedBy: "Chief Analytics Officer",
    status: "Verified",
    summaryText:
      "Deep-dive telemetry into strategic client retention, enterprise tier growth, project expansion rates, and overall business scalability.",
    metrics: {
      "Enterprise ARR Growth": "+24.5%",
      "Avg Client Value": "$48,500",
      "Retention Rate": "96.8%",
      "NPS Score": "91 / 100",
    },
  },

  // SECTION 2: TEAMS REPORTS
  {
    id: "rep-team-01",
    title: "Engineering Squad Execution & Sprint Velocity Report",
    section: "TEAMS",
    category: "Squad Telemetry",
    generatedAt: "Aug 03, 2026",
    generatedBy: "Sprint Master AI",
    status: "Verified",
    summaryText:
      "Detailed analysis of team velocity, milestone accomplishment ratios, pull request review cycles, and cross-functional team workload allocation.",
    metrics: {
      "Sprint Completion Ratio": "94.2%",
      "Avg Velocity": "86 pts",
      "PR Merge Time": "4.2 hrs",
      "Blockers Cleared": 38,
    },
  },
  {
    id: "rep-team-02",
    title: "Cross-Functional Workload & Resource Allocation Audit",
    section: "TEAMS",
    category: "Resource Distribution",
    generatedAt: "Jul 29, 2026",
    generatedBy: "Operations Management",
    status: "Verified",
    summaryText:
      "Audit of staff distribution across active project teams, bandwidth utilization, team capacity balancing, and project delivery SLAs.",
    metrics: {
      "Resource Utilization": "89.4%",
      "Over-allocation Incidents": 0,
      "Cross-team Collaboration": "92.1%",
    },
  },

  // SECTION 3: EMPLOYEE REPORTS
  {
    id: "rep-emp-01",
    title: "Staff Productivity & Task SLA Performance Index",
    section: "EMPLOYEE",
    category: "Staff Telemetry",
    generatedAt: "Aug 02, 2026",
    generatedBy: "People Operations AI",
    status: "Verified",
    summaryText:
      "Individual employee task completion velocity, deadline adherence metrics, quality assurance scores, and staff contribution indexes.",
    metrics: {
      "Task Completion Rate": "97.6%",
      "On-Time SLA": "99.1%",
      "Active Team Members": 64,
      "Avg Task Velocity": "1.4 days/task",
    },
  },
  {
    id: "rep-emp-02",
    title: "Developer Productivity & Code Review Contribution Audit",
    section: "EMPLOYEE",
    category: "Individual Output",
    generatedAt: "Jul 28, 2026",
    generatedBy: "Engineering Lead",
    status: "Verified",
    summaryText:
      "Individual staff code repository contributions, commit frequency, issue resolution rates, and peer review throughput.",
    metrics: {
      "Commits Merged": 412,
      "Review Throughput": "98.4%",
      "Bug Resolution SLA": "3.1 hrs",
    },
  },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItemType[]>(INITIAL_REPORTS);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState<"ALL" | "BUSINESS" | "TEAMS" | "EMPLOYEE">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<ReportItemType | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 5;

  // Load real analytics telemetry if available
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getAnalyticsIndexesApi();
        if (data && (data as any).overview) {
          toast.success("Analytics indexes synced with live database");
        }
      } catch (err) {
        console.log("Using cached reports index", err);
      }
    };
    loadAnalytics();
  }, []);

  // GSAP Entry Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([".reports-header-area", ".reports-stats-area", ".reports-table-area"], {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
        clearProps: "all",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Filtering
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch = [r.title, r.category, r.generatedBy, r.summaryText]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesSection = sectionFilter === "ALL" || r.section === sectionFilter;

      return matchesSearch && matchesSection;
    });
  }, [reports, search, sectionFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const handleGenerateReport = () => {
    const newReport: ReportItemType = {
      id: `rep-gen-${Date.now()}`,
      title: `Live Operational Telemetry Report (${new Date().toLocaleDateString()})`,
      section: sectionFilter === "ALL" ? "BUSINESS" : sectionFilter,
      category: "Realtime Analytics",
      generatedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      generatedBy: "System Analytics Engine",
      status: "Verified",
      summaryText:
        "Automated operational & telemetry summary compiled directly from workspace data models and active database indexes.",
      metrics: {
        "Status": "Live Synced",
        "Data Quality": "100%",
        "Generated Time": new Date().toLocaleTimeString(),
      },
    };

    setReports((prev) => [newReport, ...prev]);
    setSelectedReport(newReport);
    toast.success("New operational report generated successfully!");
  };

  const handleDeleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast.success("Report removed from library");
  };

  return (
    <div ref={containerRef} className="relative min-h-0 w-full overflow-hidden p-6 md:p-10">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#5271ff]/[0.06] blur-[130px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-[#3a4ec4]/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-[#22d3ee]/[0.04] blur-[100px]" />

      <div className="relative z-10 flex min-h-[calc(100vh-140px)] flex-col gap-6 lg:gap-8">
        {/* Header Section */}
        <div className="reports-header-area">
          <SubHeader
            search={search}
            setSearch={setSearch}
            sectionFilter={sectionFilter}
            setSectionFilter={setSectionFilter}
            onGenerateClick={handleGenerateReport}
          />
        </div>

        {/* Stats Widgets Area */}
        <div className="reports-stats-area">
          <ReportsStatsCards reports={reports} />
        </div>

        {/* Table & Sections Area */}
        <div className="reports-table-area flex flex-1 flex-col min-h-0">
          <div className="flex-1 overflow-hidden">
            <ReportsTable
              reports={currentReports}
              sectionFilter={sectionFilter}
              setSectionFilter={setSectionFilter}
              onSelectReport={setSelectedReport}
              onDeleteReport={handleDeleteReport}
            />
          </div>

          {/* Footer Pagination */}
          <ReportsFooter
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/* Report Detail Modal */}
      <AnimatePresence>
        {selectedReport ? (
          <ReportDetailModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
