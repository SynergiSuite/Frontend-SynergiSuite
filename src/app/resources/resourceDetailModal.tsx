"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HardDrive, Server, Layers, DollarSign, Activity, X } from "lucide-react";
import { ResourceType } from "./statesCards";

type ResourceDetailProps = {
  resource: ResourceType | null;
  open: boolean;
  onClose: () => void;
};

const getStatusConfig = (status: string) => {
  if (status === "Available") {
    return {
      label: "Available",
      chipClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
      accentClass: "from-emerald-500/10 via-[#0c0a2f]/90 to-[#0a0826] border-emerald-500/20",
      glowColor: "bg-emerald-500/10",
    };
  }

  if (status === "Allocated") {
    return {
      label: "Allocated",
      chipClass: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.2)]",
      accentClass: "from-cyan-500/10 via-[#0c0a2f]/90 to-[#0a0826] border-cyan-500/20",
      glowColor: "bg-cyan-500/10",
    };
  }

  return {
    label: "Under Maintenance",
    chipClass: "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    accentClass: "from-amber-500/10 via-[#0c0a2f]/90 to-[#0a0826] border-amber-500/20",
    glowColor: "bg-amber-500/10",
  };
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
  <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/[0.15]">
    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
      <span className="text-[#5271ff]/70">{icon}</span>
      <span>{label}</span>
    </div>
    <p className="break-words text-sm font-semibold text-white">{value}</p>
  </div>
);

export default function ResourceDetailModal({
  resource,
  open,
  onClose,
}: ResourceDetailProps) {
  if (!resource) {
    return null;
  }

  const statusConfig = getStatusConfig(resource.status);

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
            aria-label="Close resource details"
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className={`relative w-full max-w-2xl overflow-hidden rounded-[28px] border bg-gradient-to-br ${statusConfig.accentClass} shadow-[0_24px_80px_rgba(0,0,0,0.6)]`}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            {/* Custom glowing backdrop */}
            <div className={`absolute -right-16 -top-16 h-36 w-36 rounded-full blur-3xl ${statusConfig.glowColor}`} />
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(82,113,255,0.15),transparent_58%)]" />

            <div className="relative border-b border-white/[0.08] px-6 py-6 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 shadow-inner">
                    <span className="text-2xl font-extrabold text-white">
                      {resource.name?.charAt(0)?.toUpperCase() || "R"}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">
                      Resource Overview
                    </p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
                      {resource.name || "Unnamed Resource"}
                    </h2>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${statusConfig.chipClass}`}
                      >
                        <Activity className="h-3.5 w-3.5" />
                        {statusConfig.label}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs font-semibold text-white/80">
                        {resource.type || "Other"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-white/50 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
              <DetailRow
                icon={<Server className="h-4 w-4" />}
                label="Resource Type"
                value={resource.type || "N/A"}
              />
              <DetailRow
                icon={<Layers className="h-4 w-4" />}
                label="Deploy Quantity"
                value={String(resource.quantity) || "N/A"}
              />
              <DetailRow
                icon={<DollarSign className="h-4 w-4" />}
                label="Estimated Allocation Cost"
                value={resource.cost || "N/A"}
              />
              <DetailRow
                icon={<HardDrive className="h-4 w-4" />}
                label="Deployment Id"
                value={`SYS-RES-00${resource.id}`}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
