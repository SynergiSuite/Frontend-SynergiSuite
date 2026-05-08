"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BriefcaseBusiness, Building2, Fingerprint, UserRound, X } from "lucide-react";
import type { UIEmployee } from "./schemas/employee";

type EmployeeDetailProps = {
  employee: UIEmployee | null;
  open: boolean;
  onClose: () => void;
};

const statusStyles = (status?: string) =>
  status === "Active"
    ? "bg-green-100 text-green-700 ring-1 ring-inset ring-green-200"
    : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200";

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm">
    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
      <span className="text-gray-400">{icon}</span>
      <span>{label}</span>
    </div>
    <p className="break-words text-sm font-semibold text-gray-900">{value}</p>
  </div>
);

export default function EmployeeDetailModal({
  employee,
  open,
  onClose,
}: EmployeeDetailProps) {
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
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-gray-200 bg-gradient-to-br from-slate-200/35 via-white to-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.22),transparent_58%)]" />

            <div className="relative border-b border-gray-200/80 px-6 py-6 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/70 bg-white/80 shadow-sm">
                    <span className="text-2xl font-bold text-gray-700">
                      {employee.name?.charAt(0)?.toUpperCase() || "E"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
                      Employee Profile
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-gray-950">
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
                      <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                        {employee.role || "No role"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-500 transition hover:text-gray-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
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
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
