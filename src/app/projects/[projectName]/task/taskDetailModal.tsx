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
import {
  modalCloseButtonClass,
  modalOverlayClass,
} from "@/lib/modalStyles";

type TaskDetailModalProps = {
  task: Task;
  canEdit: boolean;
  onClose: () => void;
  onEdit: () => void;
};

const priorityStyles: Record<string, string> = {
  low: "bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200",
  medium: "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200",
  high: "bg-red-100 text-red-700 ring-1 ring-inset ring-red-200",
};

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  blocked: "bg-red-100 text-red-700 ring-1 ring-inset ring-red-200",
  in_progress: "bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200",
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
  <div className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm">
    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
      <span className="text-gray-400">{icon}</span>
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
    "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200";
  const priorityClass =
    priorityStyles[normalizedPriority ?? ""] ??
    "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.button
        type="button"
        aria-label="Close task details"
        className={modalOverlayClass}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-hidden rounded-[28px] border border-gray-200 bg-gradient-to-br from-slate-200/35 via-white to-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
      >
        <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.22),transparent_58%)]" />

        <div className="relative max-h-[calc(100vh-2rem)] overflow-y-auto">
          <div className="border-b border-gray-200/80 px-6 py-6 sm:px-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
                  Task Detail
                </p>
                <h2 className="mt-2 break-words text-2xl font-semibold text-gray-950">
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

              <div className="flex shrink-0 items-center gap-2">
                {canEdit ? (
                  <button
                    type="button"
                    aria-label="Edit task"
                    onClick={onEdit}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-500 transition hover:text-gray-900"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                ) : null}
                <button
                  type="button"
                  aria-label="Close task details"
                  onClick={onClose}
                  className={modalCloseButtonClass}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
            <DetailTile
              icon={<CalendarDays className="h-4 w-4" />}
              label="Due Date"
            >
              <p className="text-sm font-semibold text-gray-900">
                {task.due_date || "No due date"}
              </p>
            </DetailTile>

            <DetailTile icon={<CheckCircle2 className="h-4 w-4" />} label="Status">
              <p className="text-sm font-semibold text-gray-900">
                {formatTaskLabel(task.status)}
              </p>
            </DetailTile>

            <DetailTile icon={<Flag className="h-4 w-4" />} label="Priority">
              <p className="text-sm font-semibold text-gray-900">
                {formatTaskLabel(task.priority)}
              </p>
            </DetailTile>

            <DetailTile icon={<Users className="h-4 w-4" />} label="Teams">
              <p className="text-sm font-semibold text-gray-900">
                {task.teams?.length ? `${task.teams.length}` : "No team assigned"}
              </p>
            </DetailTile>
          </div>

          <div className="border-t border-gray-200/80 px-6 py-6 sm:px-8">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
              Description
            </h3>
            <div className="rounded-2xl border border-gray-200 bg-white/90 p-4 text-sm leading-6 text-gray-700 shadow-sm">
              {task.description?.trim() || "No description added."}
            </div>
          </div>

          <div className="border-t border-gray-200/80 px-6 py-6 sm:px-8">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
              Assigned Teams
            </h3>
            {task.teams?.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {task.teams.map((team) => (
                  <div
                    key={team.id}
                    className="rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {team.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {team.members?.length ?? 0} member
                      {(team.members?.length ?? 0) === 1 ? "" : "s"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 px-4 py-6 text-sm text-gray-500">
                No teams assigned yet.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
