"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Building2,
  Calendar,
  CheckCircle2,
  Crown,
  DollarSign,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  UserRound,
  Users,
  X,
  Activity,
} from "lucide-react";
import type { UIEmployee } from "./schemas/employee";
import { fetchEmployeeDetail, EmployeeDetailData } from "./apis/getEmployeeDetailApi";
import { gsap } from "gsap";

type EmployeeDetailProps = {
  employee: UIEmployee | null;
  open: boolean;
  onClose: () => void;
};

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="detail-card rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-300 hover:border-[#5271ff]/30 hover:bg-white/[0.05]">
    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/40">
      <span className="text-[#5271ff]">{icon}</span>
      <span>{label}</span>
    </div>
    <p className="break-words text-sm font-semibold text-white/90">{value}</p>
  </div>
);

export default function EmployeeDetailModal({
  employee,
  open,
  onClose,
}: EmployeeDetailProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState<EmployeeDetailData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && employee?.id) {
      const loadDetail = async () => {
        setLoading(true);
        try {
          const numId = typeof employee.id === "number" ? employee.id : Number(employee.id);
          if (!isNaN(numId) && numId > 0) {
            const data = await fetchEmployeeDetail(numId);
            setDetailData(data);
          } else {
            setDetailData(null);
          }
        } catch (error) {
          console.error("Failed to load employee detail:", error);
          setDetailData(null);
        } finally {
          setLoading(false);
        }
      };
      loadDetail();
    } else {
      setDetailData(null);
    }
  }, [open, employee?.id]);

  useEffect(() => {
    if (open && !loading && containerRef.current) {
      const cards = containerRef.current.querySelectorAll(".detail-card, .team-item, .activity-item");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.04,
            ease: "power2.out",
          }
        );
      }
    }
  }, [open, loading, detailData]);

  if (!mounted || !employee) {
    return null;
  }

  const empDetail = detailData?.employee;
  const roleName = empDetail?.role?.name || employee.role || "N/A";
  const businessName = empDetail?.business?.name || employee.department || "N/A";
  const salaryText = empDetail?.salary ? `$${empDetail.salary}` : "Not specified";

  const regDateText = empDetail?.registrationDate
    ? new Date(empDetail.registrationDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const modal = (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.button
            type="button"
            aria-label="Close employee details"
            onClick={onClose}
            className="absolute inset-0 bg-[#030114]/65 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0a0826]/95 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* Top blue glow element */}
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(82,113,255,0.15),transparent_58%)] pointer-events-none" />

            <div className="relative flex-1 overflow-y-auto max-h-[calc(100vh-2.5rem)]" ref={containerRef}>
              {/* Header */}
              <div className="border-b border-white/[0.08] px-6 py-6 sm:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#5271ff]/30 bg-[#5271ff]/10 shadow-[0_0_20px_rgba(82,113,255,0.15)] shrink-0">
                      <span className="bg-gradient-to-br from-[#5271ff] to-cyan-400 bg-clip-text text-2xl font-black text-transparent">
                        {employee.name?.charAt(0)?.toUpperCase() || "E"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                        Employee Overview
                      </p>
                      <h2 className="mt-1 text-2xl font-bold text-white">
                        {employee.name || "Unnamed Employee"}
                      </h2>
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-0.5 text-xs font-semibold">
                          {employee.status || "Active"}
                        </span>
                        <span className="inline-flex rounded-full bg-[#5271ff]/15 text-[#5271ff] border border-[#5271ff]/25 px-3 py-0.5 text-xs font-medium">
                          {roleName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08] hover:text-white shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#5271ff] border-t-transparent" />
                  <p className="text-xs font-medium text-white/40">Loading employee metrics...</p>
                </div>
              ) : (
                <div className="space-y-6 px-6 py-6 sm:px-8">
                  {/* Grid details */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailRow
                      icon={<UserRound className="h-4 w-4" />}
                      label="Email Address"
                      value={empDetail?.email || "N/A"}
                    />
                    <DetailRow
                      icon={<BriefcaseBusiness className="h-4 w-4" />}
                      label="Designation"
                      value={roleName}
                    />
                    <DetailRow
                      icon={<Building2 className="h-4 w-4" />}
                      label="Business / Department"
                      value={businessName}
                    />
                    <DetailRow
                      icon={<DollarSign className="h-4 w-4" />}
                      label="Salary"
                      value={salaryText}
                    />
                    <DetailRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="Registration Date"
                      value={regDateText}
                    />
                    <DetailRow
                      icon={<ShieldCheck className="h-4 w-4" />}
                      label="Account Verification"
                      value={empDetail?.isVerified !== false ? "Verified" : "Pending"}
                    />
                  </div>

                  {/* Collaboration & Activity summary */}
                  {detailData?.collaboration && (
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-3">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[#5271ff]" />
                        Collaboration & Activity Metrics
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                          <p className="text-[10px] uppercase font-semibold text-white/40">Messages Sent</p>
                          <p className="text-lg font-bold text-white mt-0.5">
                            {detailData.collaboration.messagesSent ?? 0}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                          <p className="text-[10px] uppercase font-semibold text-white/40">Total Calls</p>
                          <p className="text-lg font-bold text-white mt-0.5">
                            {detailData.collaboration.totalCalls ?? 0}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                          <p className="text-[10px] uppercase font-semibold text-white/40">Tasks Done</p>
                          <p className="text-lg font-bold text-emerald-400 mt-0.5">
                            {detailData.taskActivity?.completedTasksFromActivity ?? 0}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                          <p className="text-[10px] uppercase font-semibold text-white/40">Meeting Mins</p>
                          <p className="text-lg font-bold text-[#5271ff] mt-0.5">
                            {detailData.collaboration.totalMeetingMinutes ?? 0}m
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Teams List */}
                  {detailData?.teams && detailData.teams.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40 flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#5271ff]" />
                        Assigned Teams ({detailData.teams.length})
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {detailData.teams.map((t) => (
                          <div
                            key={t.teamId}
                            className="team-item rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-semibold text-white text-sm">{t.name}</h4>
                              {t.leader?.name && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                                  <Crown className="h-3 w-3" />
                                  Lead: {t.leader.name}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/50 line-clamp-2">{t.description}</p>
                            <div className="pt-2 flex items-center justify-between text-[11px] text-white/40 border-t border-white/[0.04]">
                              <span>{t.totalProjects ?? 0} Projects</span>
                              <span>{t.completedTasks ?? 0} / {t.totalTasks ?? 0} Tasks</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Activity Feed */}
                  {detailData?.recentActivities && detailData.recentActivities.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-[#5271ff]" />
                        Recent Activities
                      </h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {detailData.recentActivities.slice(0, 5).map((act) => (
                          <div
                            key={act.id}
                            className="activity-item flex items-start justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-xs text-white/70"
                          >
                            <p className="flex-1 leading-relaxed">{act.description}</p>
                            <span className="shrink-0 text-[10px] font-medium text-white/40">
                              {new Date(act.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
