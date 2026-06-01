"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BriefcaseBusiness, Building2, Fingerprint, UserRound, X } from "lucide-react";
import type { UIEmployee } from "./schemas/employee";
import { gsap } from "gsap";

type EmployeeDetailProps = {
  employee: UIEmployee | null;
  open: boolean;
  onClose: () => void;
};

const statusStyles = (status?: string) =>
  status === "Active"
    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
    : "bg-white/[0.05] text-white/40 border border-white/[0.06]";

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="detail-card rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-[#5271ff]/30 hover:bg-white/[0.05]">
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && containerRef.current) {
      const cards = containerRef.current.querySelectorAll(".detail-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.15,
          }
        );
      }
    }
  }, [open]);

  if (!employee) {
    return null;
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.button
            type="button"
            aria-label="Close employee details"
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0a0826]/90 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            {/* Top-left blue glow */}
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(82,113,255,0.12),transparent_60%)] pointer-events-none" />

            <div className="relative overflow-y-auto" ref={containerRef}>
              <div className="border-b border-white/[0.07] px-6 py-6 sm:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#5271ff]/30 bg-[#5271ff]/10 shadow-[0_0_20px_rgba(82,113,255,0.15)]">
                      <span className="text-2xl font-bold text-white">
                        {employee.name?.charAt(0)?.toUpperCase() || "E"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                        Employee Profile
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold text-white">
                        {employee.name || "Unnamed Employee"}
                      </h2>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles(
                            employee.status
                          )}`}
                        >
                          {employee.status || "Unknown"}
                        </span>
                        <span className="inline-flex rounded-full bg-[#5271ff]/15 text-[#5271ff] border border-[#5271ff]/25 px-3 py-1 text-xs font-medium">
                          {employee.role || "No role"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/50 transition hover:text-white hover:bg-white/[0.08]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
                <DetailRow
                  icon={<UserRound className="h-4 w-4" />}
                  label="Full Name"
                  value={employee.name || "N/A"}
                />
                <DetailRow
                  icon={<BriefcaseBusiness className="h-4 w-4" />}
                  label="Role"
                  value={employee.role || "N/A"}
                />
                <DetailRow
                  icon={<Building2 className="h-4 w-4" />}
                  label="Department"
                  value={employee.department || "N/A"}
                />
                <DetailRow
                  icon={<Fingerprint className="h-4 w-4" />}
                  label="Employee ID"
                  value={String(employee.id ?? "N/A")}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
