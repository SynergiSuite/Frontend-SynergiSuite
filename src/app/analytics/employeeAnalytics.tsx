"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  BarChart3,
  Mail,
  ChevronRight,
  TrendingUp,
  Loader2,
  Shield,
} from "lucide-react";
import {
  EmployeeTelemetryItem,
  EmployeeTelemetrySummary,
} from "./schemas/analytics";
import EmployeeDetailModal from "./employeeDetailModal";

interface EmployeeAnalyticsProps {
  employees?: EmployeeTelemetryItem[];
  summary?: EmployeeTelemetrySummary;
  startDate?: string;
  endDate?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

type SortField =
  | "productivityIndex"
  | "completedTasks"
  | "overdueTasks"
  | "messagesSent"
  | "totalCalls";

export default function EmployeeAnalytics({
  employees = [],
  summary,
  startDate,
  endDate,
  isLoading = false,
  error = null,
  onRetry,
}: EmployeeAnalyticsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("productivityIndex");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeTelemetryItem | null>(null);

  // Compute summary values
  const totalEmployeesCount = summary?.totalEmployees ?? employees.length;
  const avgProdIndex = summary?.averageProductivityIndex ?? (
    employees.length > 0
      ? employees.reduce((acc, curr) => acc + (curr.analytics?.productivityIndex || 0), 0) / employees.length
      : 0
  );
  const totalAssigned = summary?.totalAssignedTasks ?? employees.reduce((acc, c) => acc + (c.taskAnalytics?.totalAssignedTasks || 0), 0);
  const totalCompleted = summary?.completedTasks ?? employees.reduce((acc, c) => acc + (c.taskAnalytics?.completedTasks || 0), 0);
  const totalOverdue = summary?.totalOverdueTasks ?? employees.reduce((acc, c) => acc + (c.deadlineAnalytics?.overdueTasks || 0), 0);
  const totalMsgs = summary?.totalMessagesSent ?? employees.reduce((acc, c) => acc + (c.collaborationAnalytics?.messagesSent || 0), 0);
  const totalCalls = summary?.totalCalls ?? employees.reduce((acc, c) => acc + (c.meetingAnalytics?.totalCalls || 0), 0);

  // Search & Filter
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      const nameMatch = (emp.userName || "").toLowerCase().includes(q);
      const emailMatch = (emp.userEmail || "").toLowerCase().includes(q);
      const roleMatch = (emp.role?.name || "").toLowerCase().includes(q);
      const teamMatch = emp.teams?.some((t) => t.teamName.toLowerCase().includes(q));
      return nameMatch || emailMatch || roleMatch || teamMatch;
    });
  }, [employees, searchQuery]);

  // Sorting: Default by analytics.productivityIndex descending
  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      let valA = 0;
      let valB = 0;

      switch (sortField) {
        case "productivityIndex":
          valA = a.analytics?.productivityIndex ?? 0;
          valB = b.analytics?.productivityIndex ?? 0;
          break;
        case "completedTasks":
          valA = a.taskAnalytics?.completedTasks ?? 0;
          valB = b.taskAnalytics?.completedTasks ?? 0;
          break;
        case "overdueTasks":
          valA = a.deadlineAnalytics?.overdueTasks ?? 0;
          valB = b.deadlineAnalytics?.overdueTasks ?? 0;
          break;
        case "messagesSent":
          valA = a.collaborationAnalytics?.messagesSent ?? 0;
          valB = b.collaborationAnalytics?.messagesSent ?? 0;
          break;
        case "totalCalls":
          valA = a.meetingAnalytics?.totalCalls ?? 0;
          valB = b.meetingAnalytics?.totalCalls ?? 0;
          break;
      }

      return sortOrder === "desc" ? valB - valA : valA - valB;
    });
  }, [filteredEmployees, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Telemetry Summary Highlights */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1 font-semibold uppercase tracking-wider">
            <span>Evaluated Staff</span>
            <Users className="h-4 w-4 text-[#5271ff]" />
          </div>
          <p className="text-xl font-extrabold text-white">
            {totalEmployeesCount} Employees
          </p>
          <span className="text-[10px] text-white/40 mt-1 block">
            Across active team squads
          </span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1 font-semibold uppercase tracking-wider">
            <span>Avg Productivity</span>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-xl font-extrabold text-cyan-400">
            {avgProdIndex.toFixed(1)} Index
          </p>
          <span className="text-[10px] text-cyan-300/70 mt-1 block">
            Movement & task update velocity
          </span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1 font-semibold uppercase tracking-wider">
            <span>Tasks Executed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-emerald-400">
            {totalCompleted} / {totalAssigned}
          </p>
          <span className="text-[10px] text-emerald-400/80 mt-1 block">
            {totalAssigned > 0 ? ((totalCompleted / totalAssigned) * 100).toFixed(0) : 0}% completion rate
          </span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1 font-semibold uppercase tracking-wider">
            <span>Overdue SLA Tasks</span>
            <AlertTriangle className={`h-4 w-4 ${totalOverdue > 0 ? "text-rose-400" : "text-emerald-400"}`} />
          </div>
          <p className={`text-xl font-extrabold ${totalOverdue > 0 ? "text-rose-400" : "text-emerald-400"}`}>
            {totalOverdue} Overdue
          </p>
          <span className="text-[10px] text-white/40 mt-1 block">
            {totalMsgs} msgs • {totalCalls} calls
          </span>
        </div>
      </div>

      {/* Main Employee Telemetry Container */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-5 sm:p-6 backdrop-blur-md shadow-lg space-y-5 relative overflow-hidden">
        <div className="absolute left-0 top-0 h-[2px] w-32 bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />

        {/* Toolbar Header: Title, Search & Sort */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.06] pb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              Employee Telemetry Index
            </h2>
            <p className="text-xs text-white/40 mt-0.5 font-medium">
              Search, filter, and sort individual employee performance metrics. Click any employee for full details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-3.5 w-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, role..."
                className="h-9 w-52 sm:w-64 rounded-xl border border-white/[0.08] bg-[#0c0a2f]/80 pl-9 pr-3 text-xs text-white placeholder-white/30 outline-none transition focus:border-cyan-400/50"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#0c0a2f]/80 px-3 py-1.5 text-xs text-white">
              <ArrowUpDown className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-white/50 text-[11px]">Sort:</span>
              <select
                value={sortField}
                onChange={(e) => {
                  setSortField(e.target.value as SortField);
                  setSortOrder("desc");
                }}
                className="bg-transparent font-semibold text-white outline-none cursor-pointer"
              >
                <option value="productivityIndex" className="bg-[#0c0a2f] text-white">Productivity Index</option>
                <option value="completedTasks" className="bg-[#0c0a2f] text-white">Completed Tasks</option>
                <option value="overdueTasks" className="bg-[#0c0a2f] text-white">Overdue Tasks</option>
                <option value="messagesSent" className="bg-[#0c0a2f] text-white">Messages Sent</option>
                <option value="totalCalls" className="bg-[#0c0a2f] text-white">Total Calls</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-white/40">
            <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
            <p className="text-xs font-semibold">Fetching employee telemetry index...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 border border-rose-500/20 bg-rose-500/5 rounded-2xl p-6">
            <AlertTriangle className="h-8 w-8 text-rose-400" />
            <p className="text-sm font-semibold text-rose-300">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
              >
                Retry Request
              </button>
            )}
          </div>
        ) : sortedEmployees.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center border border-white/[0.06] bg-white/[0.01] rounded-2xl p-8">
            <Users className="h-10 w-10 text-white/20 mb-3" />
            <h3 className="text-sm font-bold text-white/80">No Employees Found</h3>
            <p className="text-xs text-white/40 max-w-sm mt-1">
              No employee records matched your query "{searchQuery}". Try clearing search or filters.
            </p>
          </div>
        ) : (
          /* Employee Grid View */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedEmployees.map((emp) => {
              const overdue = emp.deadlineAnalytics?.overdueTasks ?? 0;
              const prod = emp.analytics?.productivityIndex ?? 0;
              const compRate = emp.taskAnalytics?.completionRate ?? 0;

              return (
                <div
                  key={emp.userId || emp.userEmail}
                  onClick={() => setSelectedEmployee(emp)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/[0.05] hover:shadow-[0_8px_32px_rgba(34,211,238,0.15)] flex flex-col justify-between space-y-4"
                >
                  {/* Card Header: User info & Role */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {emp.userName}
                        </h3>
                      </div>
                      <p className="truncate text-xs text-white/40 font-medium flex items-center gap-1">
                        <Mail className="h-3 w-3 shrink-0" />
                        {emp.userEmail}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      {emp.role?.name || "Employee"}
                    </span>
                  </div>

                  {/* Teams List Badges */}
                  {emp.teams && emp.teams.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {emp.teams.map((t) => (
                        <span
                          key={t.teamId || t.teamName}
                          className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/60"
                        >
                          {t.teamName}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Main Metrics Row */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-white/40 block">Productivity</span>
                      <span className="font-extrabold text-cyan-400 text-sm">{prod.toFixed(1)} Index</span>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-white/40 block">Tasks Done</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {emp.taskAnalytics?.completedTasks ?? 0} / {emp.taskAnalytics?.totalAssignedTasks ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* Secondary Metrics Bar */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      {/* Highlight Overdue Tasks when > 0 */}
                      {overdue > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                          <AlertTriangle className="h-3 w-3" />
                          {overdue} Overdue
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-white/40">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          0 Overdue
                        </span>
                      )}

                      <span className="text-[10px] text-white/40 flex items-center gap-1">
                        <MessageSquare className="h-3 w-3 text-cyan-400" />
                        {emp.collaborationAnalytics?.messagesSent ?? 0}
                      </span>
                      <span className="text-[10px] text-white/40 flex items-center gap-1">
                        <PhoneCall className="h-3 w-3 text-violet-400" />
                        {emp.meetingAnalytics?.totalCalls ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                      <span>Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
}
