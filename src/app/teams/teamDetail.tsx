"use client";

import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import {
  Crown,
  CheckCircle2,
  Clock,
  FolderKanban,
  LoaderCircle,
  TrendingUp,
  Users,
  ShieldCheck,
  UserCheck,
  Mail,
  Activity,
  Layers,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Teams } from "./schemas/types";
import { getTeamProgress } from "./apis/getTeamProgress";

type TeamDetailProps = {
  team: Teams | null;
  open: boolean;
  onClose: () => void;
};

function Metric({
  label,
  value,
  icon,
  subtext,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  subtext?: string;
}) {
  return (
    <Card data-detail-item size="sm" variant="outline" className="min-w-0 transition-all hover:border-v2-neutral-300">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 text-v2-neutral-400">
          <span className="text-xs font-medium">{label}</span>
          <span className="text-v2-neutral-500">{icon}</span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-v2-neutral-600">
          {value}
        </p>
        {subtext && (
          <p className="mt-1 text-xs text-v2-neutral-400 truncate">{subtext}</p>
        )}
      </CardContent>
    </Card>
  );
}

const normalizeMember = (member: any) => {
  const user = member?.user ?? member;

  return {
    id: user?.user_id ?? user?.id ?? member?.id ?? user?.email ?? user?.name,
    name: user?.name ?? "Unnamed member",
    email: user?.email ?? "",
    role: user?.role?.name || user?.role || "Member",
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

const resolveLeader = (team: Teams) => {
  if (team.leader?.name) {
    return {
      name: team.leader.name,
      email: team.leader.email || "",
      id: team.leader.user_id || team.leader.id,
    };
  }

  const membersList = resolveTeamMembers(team);
  const matchedMember = membersList.find(
    (member) =>
      String(member.id) === String(team.leader_id) ||
      String(member.id) === String(team.leader?.id) ||
      String(member.id) === String(team.leader?.user_id)
  );

  return matchedMember || null;
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

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function TeamDetailModal({
  team,
  open,
  onClose,
}: TeamDetailProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!open || !team?.id) {
      setProgress(null);
      return;
    }

    let isMounted = true;
    setLoadingProgress(true);

    getTeamProgress(team.id)
      .then((res) => {
        if (isMounted) {
          setProgress(resolveProgressValue(res));
        }
      })
      .catch(() => {
        if (isMounted) {
          setProgress(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingProgress(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [open, team?.id]);

  useLayoutEffect(() => {
    if (
      !open ||
      !contentRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.from("[data-detail-item]", {
        autoAlpha: 0,
        y: 10,
        duration: 0.35,
        stagger: 0.04,
        ease: "power3.out",
      });
    }, contentRef.current);

    return () => context.revert();
  }, [open, team]);

  if (!team) return null;

  const membersList = resolveTeamMembers(team);
  const leader = resolveLeader(team);
  const leaderName = leader?.name || "No leader assigned";
  const totalTasks = team.totalTasks ?? 0;
  const completedTasks = team.completedTasks ?? 0;
  const ongoingTasks = team.ongoingTasks ?? 0;
  const calculatedProgress =
    progress !== null
      ? progress
      : totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        ref={contentRef}
        className="max-h-[calc(100dvh-2rem)] overflow-hidden border-v2-neutral-200 bg-v2-neutral-100 p-0 text-v2-neutral-600 shadow-[0_24px_80px_rgba(53,53,54,0.22)] sm:max-w-3xl"
      >
        <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto" data-sidebar-scroll>
          {/* Header Profile Banner */}
          <DialogHeader
            data-detail-item
            className="border-b border-v2-neutral-200 px-6 py-6 sm:px-8 pr-16 bg-gradient-to-b from-v2-neutral-200/40 to-transparent"
          >
            <div className="flex items-start gap-4 sm:gap-5">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-v2-neutral-500 text-v2-neutral-100 text-xl font-bold shadow-md">
                {team.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-v2-neutral-400">
                  Squad Profile
                </p>
                <DialogTitle className="mt-1 truncate text-2xl font-semibold tracking-[-0.035em] text-v2-neutral-600 sm:text-3xl">
                  {team.name}
                </DialogTitle>
                <DialogDescription className="mt-2 text-xs leading-5 text-v2-neutral-400 max-w-xl">
                  {team.description || "Active squad unit within workspace."}
                </DialogDescription>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 px-2.5 py-1 text-xs font-medium text-v2-neutral-600 shadow-xs">
                    <Users className="size-3.5 text-v2-neutral-400" />
                    {membersList.length} squad {membersList.length === 1 ? "member" : "members"}
                  </span>
                  {leader && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 shadow-xs">
                      <Crown className="size-3 text-amber-600" />
                      Lead: {leaderName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-7 px-6 py-6 sm:px-8">
            {/* Velocity & Progress Banner */}
            <Card data-detail-item variant="subtle" size="sm" className="overflow-hidden border-v2-neutral-200/80">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="size-4 text-v2-neutral-500" />
                      <h3 className="text-sm font-semibold text-v2-neutral-600">
                        Execution Velocity & Completion
                      </h3>
                    </div>
                    <p className="mt-1 text-xs text-v2-neutral-400">
                      Overall task deliverable progress recorded across assigned workspace initiatives.
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1.5 shrink-0">
                    <span className="text-3xl font-bold tracking-tight text-v2-neutral-600">
                      {loadingProgress ? (
                        <LoaderCircle className="size-6 animate-spin text-v2-neutral-400" />
                      ) : (
                        `${calculatedProgress}%`
                      )}
                    </span>
                    <span className="text-xs font-medium text-v2-neutral-400">efficiency</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2.5 w-full rounded-full bg-v2-neutral-300/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-v2-neutral-500 transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(calculatedProgress, 100)}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-v2-neutral-400 font-medium">
                  <span>{completedTasks} tasks completed</span>
                  <span>{ongoingTasks} ongoing in flight</span>
                  <span>{totalTasks} total in scope</span>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Overview Grid */}
            <section data-detail-item aria-labelledby="metrics-title">
              <h3 id="metrics-title" className="text-sm font-semibold text-v2-neutral-600 mb-3">
                Squad Performance Metrics
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Metric
                  label="Completed Deliverables"
                  value={completedTasks}
                  icon={<CheckCircle2 className="size-4 text-emerald-600" />}
                  subtext="Tasks successfully delivered"
                />
                <Metric
                  label="In-Flight Tasks"
                  value={ongoingTasks}
                  icon={<Clock className="size-4 text-amber-600" />}
                  subtext="Currently in active progress"
                />
                <Metric
                  label="Squad Size"
                  value={membersList.length}
                  icon={<UserCheck className="size-4 text-indigo-600" />}
                  subtext="Active assigned personnel"
                />
              </div>
            </section>

            {/* Team Leadership Card */}
            {leader && (
              <section data-detail-item aria-labelledby="leadership-title">
                <h3 id="leadership-title" className="text-sm font-semibold text-v2-neutral-600 mb-3">
                  Designated Squad Leader
                </h3>
                <Card variant="outline" size="sm" className="bg-v2-neutral-100">
                  <CardContent className="flex items-center justify-between gap-4 p-4 sm:p-5">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Avatar className="size-11 rounded-xl">
                        <AvatarFallback className="rounded-xl bg-amber-100 text-amber-900 font-bold text-sm">
                          {getInitials(leader.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-v2-neutral-600 truncate">
                            {leader.name}
                          </h4>
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            <Crown className="size-3" /> Team Lead
                          </span>
                        </div>
                        {leader.email && (
                          <p className="mt-0.5 text-xs text-v2-neutral-400 truncate">
                            {leader.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Members Roster List */}
            <section data-detail-item aria-labelledby="members-roster-title">
              <div className="flex items-center justify-between mb-3 border-b border-v2-neutral-200 pb-2">
                <h3 id="members-roster-title" className="text-sm font-semibold text-v2-neutral-600">
                  Squad Personnel ({membersList.length})
                </h3>
                <span className="text-xs text-v2-neutral-400 font-medium">
                  Assigned Team Members
                </span>
              </div>

              {membersList.length > 0 ? (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {membersList.map((member, idx) => {
                    const isLead =
                      String(member.id) === String(team.leader_id) ||
                      String(member.id) === String(team.leader?.user_id) ||
                      String(member.id) === String(team.leader?.id);

                    return (
                      <div
                        key={member.id ?? idx}
                        className="flex items-center justify-between gap-3 rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 p-3.5 transition-all hover:border-v2-neutral-300 hover:shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="size-9 rounded-lg">
                            <AvatarFallback className="rounded-lg bg-v2-neutral-200 text-xs font-semibold text-v2-neutral-600">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-v2-neutral-600">
                              {member.name}
                            </p>
                            <p className="truncate text-[11px] text-v2-neutral-400">
                              {member.email || "Workspace employee"}
                            </p>
                          </div>
                        </div>

                        {isLead ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            <Crown className="size-2.5" /> Lead
                          </span>
                        ) : (
                          <span className="inline-flex shrink-0 rounded-md bg-v2-neutral-200/70 px-2 py-0.5 text-[10px] font-medium text-v2-neutral-500">
                            Member
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-v2-neutral-300 py-8 text-center text-xs text-v2-neutral-400">
                  No squad members assigned yet.
                </div>
              )}
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
