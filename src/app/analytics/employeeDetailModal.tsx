"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Shield,
  Users,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PhoneCall,
  MessageSquare,
  Activity,
  Layers,
  Award,
  Loader2,
  Calendar,
} from "lucide-react";
import { EmployeeTelemetryItem } from "./schemas/analytics";
import getEmployeeAnalyticsApi from "./apis/getEmployeeAnalyticsApi";

interface EmployeeDetailModalProps {
  employee: EmployeeTelemetryItem | null;
  startDate?: string;
  endDate?: string;
  onClose: () => void;
}

export default function EmployeeDetailModal({
  employee,
  startDate,
  endDate,
  onClose,
}: EmployeeDetailModalProps) {
  const [detailData, setDetailData] = useState<EmployeeTelemetryItem | null>(employee);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!employee) return;
    setDetailData(employee);

    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await getEmployeeAnalyticsApi({
          userId: employee.userId,
          startDate,
          endDate,
        });
        if (res.employees && res.employees.length > 0) {
          setDetailData(res.employees[0]);
        }
      } catch (err) {
        console.error("Failed to load employee detail telemetry:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [employee, startDate, endDate]);

  if (!employee) return null;

  const data = detailData || employee;
  const prodIndex = data.analytics?.productivityIndex ?? 0;
  const overdueCount = data.deadlineAnalytics?.overdueTasks ?? 0;
  const upcomingList = [...(data.deadlineAnalytics?.upcomingDeadlines || [])].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  const activitiesList = data.recentActivities || [];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop Overlay */}
        <div
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 18 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 14 }}
          className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/[0.1] bg-[#0c0a2f] bg-gradient-to-br from-[#22d3ee]/10 via-[#0c0a2f] to-[#0a0826] shadow-[0_24px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
        >
          {/* Top Neon Stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-[#5271ff] to-violet-400" />

          {/* Modal Header */}
          <div className="flex items-start justify-between border-b border-white/[0.08] p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5271ff]/20 to-cyan-500/20 border border-cyan-400/30 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                <User className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {data.userName}
                  </h2>
                  <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    {data.role?.name || "Employee"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-white/40" />
                    {data.userEmail}
                  </span>
                  <span>•</span>
                  <span>ID #{data.userId}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="max-h-[72vh] space-y-6 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Refreshing real-time telemetry details...</span>
              </div>
            )}

            {/* General Info Row: Teams & Projects */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/50 p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-[#5271ff]" />
                  Assigned Teams ({data.teams?.length || 0})
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {data.teams && data.teams.length > 0 ? (
                    data.teams.map((t) => (
                      <span
                        key={t.teamId || t.teamName}
                        className="rounded-lg border border-[#5271ff]/30 bg-[#5271ff]/10 px-3 py-1 text-xs font-semibold text-[#5271ff]"
                      >
                        {t.teamName}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-white/40">No teams assigned</span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/50 p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-violet-400" />
                  Assigned Projects ({data.projects?.length || 0})
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {data.projects && data.projects.length > 0 ? (
                    data.projects.map((p) => (
                      <span
                        key={p.projectId || p.projectName}
                        className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300"
                      >
                        {p.projectName} {p.duration ? `(${p.duration})` : ""}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-white/40">No projects assigned</span>
                  )}
                </div>
              </div>
            </div>

            {/* Productivity & Task Telemetry Section */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                  Productivity Index
                </span>
                <p className="text-2xl font-extrabold text-cyan-400">
                  {prodIndex.toFixed(1)}
                </p>
                <span className="text-[10px] text-cyan-300/70 block">
                  Movement: {data.analytics?.statusMovementScore ?? 0} • Update: {data.analytics?.taskUpdateScore ?? 0}
                </span>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/50 p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                  Task Completion Rate
                </span>
                <p className="text-2xl font-extrabold text-emerald-400">
                  {(data.taskAnalytics?.completionRate ?? 0).toFixed(0)}%
                </p>
                <span className="text-[10px] text-white/40 block">
                  {data.taskAnalytics?.completedTasks ?? 0} / {data.taskAnalytics?.totalAssignedTasks ?? 0} Tasks Done
                </span>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/50 p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                  Deadlines & Overdue
                </span>
                <p className={`text-2xl font-extrabold ${overdueCount > 0 ? "text-rose-400" : "text-white"}`}>
                  {overdueCount} Overdue
                </p>
                <span className="text-[10px] text-white/40 block">
                  Out of {data.deadlineAnalytics?.totalTasksWithDeadline ?? 0} deadline tasks
                </span>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/50 p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                  Collaboration & Calls
                </span>
                <p className="text-2xl font-extrabold text-violet-400">
                  {data.meetingAnalytics?.totalCalls ?? 0} Calls
                </p>
                <span className="text-[10px] text-white/40 block">
                  {data.collaborationAnalytics?.messagesSent ?? 0} messages • {data.meetingAnalytics?.totalMeetingMinutes ?? 0} mins
                </span>
              </div>
            </div>

            {/* Detailed Tasks Breakdown */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-[#5271ff]" />
                Task Execution & Status Distribution
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                  <span className="text-[10px] text-white/40 block font-semibold uppercase">Todo</span>
                  <span className="font-bold text-white text-sm">{data.taskAnalytics?.todoTasks ?? 0}</span>
                </div>
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-2.5">
                  <span className="text-[10px] text-cyan-400/70 block font-semibold uppercase">In Progress</span>
                  <span className="font-bold text-cyan-400 text-sm">{data.taskAnalytics?.inProgressTasks ?? 0}</span>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5">
                  <span className="text-[10px] text-amber-400/70 block font-semibold uppercase">In Review</span>
                  <span className="font-bold text-amber-400 text-sm">{data.taskAnalytics?.reviewTasks ?? 0}</span>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <span className="text-[10px] text-emerald-400/70 block font-semibold uppercase">Completed</span>
                  <span className="font-bold text-emerald-400 text-sm">{data.taskAnalytics?.completedTasks ?? 0}</span>
                </div>
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-2.5">
                  <span className="text-[10px] text-rose-400/70 block font-semibold uppercase">Blocked / On Hold</span>
                  <span className="font-bold text-rose-400 text-sm">
                    {(data.taskAnalytics?.blockedTasks ?? 0) + (data.taskAnalytics?.onHoldTasks ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  Upcoming Deadlines ({upcomingList.length})
                </h3>
                {overdueCount > 0 && (
                  <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-400">
                    {overdueCount} Overdue Task(s)
                  </span>
                )}
              </div>

              {upcomingList.length === 0 ? (
                <p className="text-xs text-white/40 py-2">No upcoming deadline tasks recorded.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {upcomingList.map((item, idx) => (
                    <div
                      key={item.taskId || idx}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-bold text-white truncate">{item.taskTitle}</p>
                        <p className="text-[10px] text-white/40 truncate">{item.projectName}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                          Due {item.dueDate}
                        </span>
                        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase font-bold text-white/60">
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Meetings & Collaboration Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-5 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                  <PhoneCall className="h-4 w-4 text-violet-400" />
                  Meeting & Call Telemetry
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-white/40 text-[10px] block">Started:</span>
                    <strong className="text-white">{data.meetingAnalytics?.callsStarted ?? 0}</strong>
                  </div>
                  <div>
                    <span className="text-white/40 text-[10px] block">Received:</span>
                    <strong className="text-white">{data.meetingAnalytics?.callsReceived ?? 0}</strong>
                  </div>
                  <div>
                    <span className="text-white/40 text-[10px] block">Ended:</span>
                    <strong className="text-emerald-400">{data.meetingAnalytics?.endedCalls ?? 0}</strong>
                  </div>
                  <div>
                    <span className="text-white/40 text-[10px] block">Missed / Rejected:</span>
                    <strong className="text-rose-400">
                      {(data.meetingAnalytics?.missedCalls ?? 0) + (data.meetingAnalytics?.rejectedCalls ?? 0)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-5 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-cyan-400" />
                  Collaboration Activity
                </h3>
                <div className="space-y-1 text-xs pt-1">
                  <div className="flex justify-between">
                    <span className="text-white/40">Chat Messages Sent:</span>
                    <strong className="text-cyan-400 font-bold">{data.collaborationAnalytics?.messagesSent ?? 0}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Total Activities:</span>
                    <strong className="text-white font-bold">{data.analytics?.totalActivities ?? 0}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Stream */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-cyan-400" />
                Recent Activity Log ({activitiesList.length})
              </h3>

              {activitiesList.length === 0 ? (
                <p className="text-xs text-white/40 py-2">No recent activity logs recorded.</p>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                  {activitiesList.map((act, idx) => (
                    <div
                      key={act.activityId || idx}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-white/50 text-[10px]">
                        <span className="font-semibold text-cyan-400 uppercase">
                          {act.action || "Activity"} • {act.module || "Task"}
                        </span>
                        {act.createdAt && (
                          <span>
                            {new Date(act.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-white">
                        {act.entityName || act.entityType || "Entity item"}
                      </p>
                      {act.fieldChanged && (
                        <p className="text-white/60 text-[11px]">
                          Field <span className="text-cyan-300">{act.fieldChanged}</span> changed from{" "}
                          <span className="text-rose-300 font-mono">{act.oldValue || "none"}</span> to{" "}
                          <span className="text-emerald-300 font-mono">{act.newValue || "updated"}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end border-t border-white/[0.08] bg-[#0a0826]/40 p-6 sm:px-8">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white cursor-pointer"
            >
              Close Telemetry Detail
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
