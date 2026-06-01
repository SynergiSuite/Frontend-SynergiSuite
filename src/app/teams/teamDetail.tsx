"use client";

import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
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
  <div className="detail-card opacity-0 rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 p-4 backdrop-blur-md transition-all duration-300 hover:border-[#5271ff]/30 hover:bg-[#0a0826]/60">
    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white/60">
      <span className="text-[#5271ff]">{icon}</span>
      <span>{label}</span>
    </div>
    <p className="break-words text-sm font-semibold text-white">{value}</p>
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
  const containerRef = useRef<HTMLDivElement>(null);

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

  // GSAP Entrance animation on opening modal or when dependencies load
  useEffect(() => {
    if (open && containerRef.current) {
      const timer = setTimeout(() => {
        const items = containerRef.current?.querySelectorAll(".detail-card, .member-card");
        if (items && items.length > 0) {
          gsap.killTweensOf(items);
          gsap.fromTo(
            items,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.04,
              ease: "power2.out",
            }
          );
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, team?.id, progress]);

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
            className="absolute inset-0 bg-[#030114]/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0a0826]/90 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            {/* Top blue glow element */}
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(82,113,255,0.15),transparent_58%)]" />

            <div ref={containerRef} className="relative overflow-y-auto max-h-[calc(100vh-2.5rem)]">
              <div className="border-b border-white/[0.08] px-6 py-6 sm:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm shadow-inner">
                      <span className="bg-gradient-to-br from-[#5271ff] to-cyan-400 bg-clip-text text-2xl font-black text-transparent">
                        {team.name?.charAt(0)?.toUpperCase() || "T"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
                        Team Overview
                      </p>
                      <h2 className="mt-1 text-2xl font-bold text-white">
                        {team.name || "Unnamed Team"}
                      </h2>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-full bg-[#5271ff]/10 border border-[#5271ff]/20 px-3 py-1 text-xs font-semibold text-[#5271ff]">
                          {members.length} member{members.length === 1 ? "" : "s"}
                        </span>
                        <span className="inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                          Active Team
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/60 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
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
                <div className="sm:col-span-2">
                  <DetailRow
                    icon={<FileText className="h-4 w-4" />}
                    label="Description"
                    value={team.description?.trim() || "No description available"}
                  />
                </div>
              </div>

              <div className="border-t border-white/[0.08] px-6 py-6 sm:px-8">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/50">
                  Members List
                </h3>
                {members.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="member-card opacity-0 rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:border-[#5271ff]/30 hover:bg-[#0a0826]/60"
                      >
                        <p className="text-sm font-semibold text-white">
                          {member.name}
                        </p>
                        <p className="mt-1 text-xs text-white/60">
                          {member.email || "No email available"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] px-4 py-6 text-sm text-white/40 text-center">
                    No members assigned yet.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
