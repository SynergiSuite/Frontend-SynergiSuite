"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Flag,
  Pencil,
  Users,
  X,
} from "lucide-react";
import { Task } from "./schemas/task";
import { formatTaskLabel } from "./task-utils";

type TaskDetailModalProps = {
  task: Task;
  canEdit: boolean;
  onClose: () => void;
  onEdit: () => void;
};

const priorityStyles: Record<string, string> = {
  low: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  high: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
};

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  blocked: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  in_progress: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
};

const DetailTile = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-white/[0.08] bg-[#030114]/40 p-4 shadow-sm">
    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/40">
      <span className="text-[#5271ff]/80">{icon}</span>
      <span>{label}</span>
    </div>
    {children}
  </div>
);

export default function TaskDetailModal({
  task,
  canEdit,
  onClose,
  onEdit,
}: TaskDetailModalProps) {
  const normalizedStatus = task.status?.trim().toLowerCase();
  const normalizedPriority = task.priority?.trim().toLowerCase();
  const statusClass =
    statusStyles[normalizedStatus ?? ""] ??
    "bg-white/[0.04] text-white/60 border border-white/[0.08]";
  const priorityClass =
    priorityStyles[normalizedPriority ?? ""] ??
    "bg-white/[0.04] text-white/60 border border-white/[0.08]";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.button
        type="button"
        aria-label="Close task details"
        className="fixed inset-0 bg-[#030114]/80 backdrop-blur-md z-45"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      />

      <motion.div
        className="relative max-h-[calc(100vh-4rem)] w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0a0826]/90 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] z-50 flex flex-col"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
      >
        {/* Top Accent Neon Stripe */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#5271ff] via-cyan-400 to-[#3a4ec4] z-10" />

        <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(82,113,255,0.1),transparent_58%)] pointer-events-none" />

        <div className="relative overflow-y-auto flex-1 custom-scrollbar">
          {/* Header */}
          <div className="border-b border-white/[0.08] px-6 py-6 sm:px-8 bg-white/[0.01]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#5271ff]">
                  Task Detail
                </p>
                <h2 className="mt-2 break-words text-2xl font-bold text-white tracking-tight">
                  {task.title || "Untitled task"}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}
                  >
                    {formatTaskLabel(task.status)}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${priorityClass}`}
                  >
                    {formatTaskLabel(task.priority)}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2.5">
                {canEdit ? (
                  <button
                    type="button"
                    aria-label="Edit task"
                    onClick={onEdit}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/60 transition hover:text-white hover:bg-white/[0.06] hover:border-white/[0.15] hover:scale-[1.02] active:scale-[0.98] duration-300 shadow-md"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                ) : null}
                <button
                  type="button"
                  aria-label="Close task details"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#030114]/45 text-white/40 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300 shadow-md"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid Tiles */}
          <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
            <DetailTile
              icon={<CalendarDays className="h-4 w-4" />}
              label="Due Date"
            >
              <p className="text-sm font-bold text-white/80">
                {task.due_date || "No due date"}
              </p>
            </DetailTile>

            <DetailTile icon={<CheckCircle2 className="h-4 w-4" />} label="Status">
              <p className="text-sm font-bold text-white/80">
                {formatTaskLabel(task.status)}
              </p>
            </DetailTile>

            <DetailTile icon={<Flag className="h-4 w-4" />} label="Priority">
              <p className="text-sm font-bold text-white/80">
                {formatTaskLabel(task.priority)}
              </p>
            </DetailTile>

            <DetailTile icon={<Users className="h-4 w-4" />} label="Teams">
              <p className="text-sm font-bold text-white/80">
                {task.teams?.length ? `${task.teams.length}` : "No team assigned"}
              </p>
            </DetailTile>
          </div>

          {/* Description Section */}
          <div className="border-t border-white/[0.08] px-6 py-6 sm:px-8">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#5271ff]">
              Description
            </h3>
            <div className="rounded-2xl border border-white/[0.08] bg-[#030114]/40 p-4 text-sm leading-6 text-white/70 shadow-sm whitespace-pre-wrap">
              {task.description?.trim() || "No description added."}
            </div>
          </div>

          {/* Assigned Teams Section */}
          <div className="border-t border-white/[0.08] px-6 py-6 sm:px-8">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#5271ff]">
              Assigned Teams
            </h3>
            {task.teams?.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {task.teams.map((team) => (
                  <div
                    key={team.id}
                    className="rounded-2xl border border-white/[0.08] bg-[#030114]/40 px-4 py-3.5 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-white/80">
                      {team.name}
                    </p>
                    <p className="mt-1 text-xs text-white/40 font-medium">
                      {team.members?.length ?? 0} member
                      {(team.members?.length ?? 0) === 1 ? "" : "s"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#030114]/20 px-4 py-6 text-sm text-white/30 text-center font-medium">
                No teams assigned yet.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
