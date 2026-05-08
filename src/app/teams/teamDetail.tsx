"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChartNoAxesColumn,
  Crown,
  FileText,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import type { Teams } from "./schemas/types";
import { getTeamProgress } from "./apis/getTeamProgress";

type TeamDetailProps = {
  team: Teams | null;
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
  <div className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm">
    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
      <span className="text-gray-400">{icon}</span>
      <span>{label}</span>
    </div>
    <p className="break-words text-sm font-semibold text-gray-900">{value}</p>
  </div>
);

const normalizeMember = (member: any) => {
  const user = member?.user ?? member;

  return {
    id: user?.user_id ?? user?.id ?? member?.id ?? user?.email ?? user?.name,
    name: user?.name ?? "Unnamed member",
    email: user?.email ?? "",
  };
};

const resolveTeamMembers = (team: Teams) => {
  if (Array.isArray(team.teamMembers) && team.teamMembers.length > 0) {
    return team.teamMembers.map(normalizeMember);
  }

  if (Array.isArray(team.members) && team.members.length > 0) {
    return team.members.map(normalizeMember);
  }

  return [];
};

const resolveLeaderName = (team: Teams) => {
  if (team.leader?.name) {
    return team.leader.name;
  }

  const matchedMember = resolveTeamMembers(team).find(
    (member) =>
      String(member.id) === String(team.leader_id) ||
      String(member.id) === String(team.leader?.id) ||
      String(member.id) === String(team.leader?.user_id)
  );

  return matchedMember?.name || "No leader assigned";
};

const resolveProgressValue = (response: unknown) => {
  if (typeof response === "number") {
    return response;
  }

  if (response && typeof response === "object") {
    const candidateKeys = ["progress", "teamProgress", "percentage", "value"];

    for (const key of candidateKeys) {
      const value = (response as Record<string, unknown>)[key];
      if (typeof value === "number") {
        return value;
      }
    }
  }

  return null;
};

export default function TeamDetailModal({
  team,
  open,
  onClose,
}: TeamDetailProps) {
  const [progress, setProgress] = useState<number | null>(null);
  const members = team ? resolveTeamMembers(team) : [];
  const progressLabel = progress === null ? "Not available" : `${progress}%`;

  useEffect(() => {
    const loadProgress = async () => {
      if (!open || !team?.id) {
        setProgress(null);
        return;
      }

      try {
        const response = await getTeamProgress(team.id);
        setProgress(resolveProgressValue(response));
      } catch (error) {
        setProgress(null);
      }
    };

    loadProgress();
  }, [open, team?.id]);

  if (!team) {
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
            aria-label="Close team details"
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-3xl overflow-hidden rounded-[28px] border border-gray-200 bg-gradient-to-br from-slate-200/35 via-white to-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
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
                      {team.name?.charAt(0)?.toUpperCase() || "T"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
                      Team Overview
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-gray-950">
                      {team.name || "Unnamed Team"}
                    </h2>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                        {members.length} member{members.length === 1 ? "" : "s"}
                      </span>
                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        Active Team
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
                icon={<Users className="h-4 w-4" />}
                label="Members"
                value={`${members.length}`}
              />
              <DetailRow
                icon={<Crown className="h-4 w-4" />}
                label="Team Leader"
                value={resolveLeaderName(team)}
              />
              <DetailRow
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Team ID"
                value={team.id || "N/A"}
              />
              <DetailRow
                icon={<ChartNoAxesColumn className="h-4 w-4" />}
                label="Progress"
                value={progressLabel}
              />
              <DetailRow
                icon={<FileText className="h-4 w-4" />}
                label="Description"
                value={team.description?.trim() || "No description available"}
              />
            </div>

            <div className="border-t border-gray-200/80 px-6 py-6 sm:px-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                Members List
              </h3>
              {members.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 shadow-sm"
                    >
                      <p className="text-sm font-semibold text-gray-900">
                        {member.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {member.email || "No email available"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 px-4 py-6 text-sm text-gray-500">
                  No members assigned yet.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
