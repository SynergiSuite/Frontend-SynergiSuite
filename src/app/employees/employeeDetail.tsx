"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleDollarSign,
  Crown,
  LoaderCircle,
  Mail,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { gsap } from "gsap";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  fetchEmployeeDetail,
  type EmployeeDetailData,
} from "./apis/getEmployeeDetailApi";
import type { UIEmployee } from "./schemas/employee";

type EmployeeDetailProps = {
  employee: UIEmployee | null;
  open: boolean;
  onClose: () => void;
};

function DetailCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Card data-detail-item variant="subtle" size="sm">
      <CardContent>
        <div className="flex items-center gap-2 text-xs font-medium text-v2-neutral-400">
          <span className="text-v2-neutral-500">{icon}</span>
          {label}
        </div>
        <p className="mt-2 break-words text-sm font-semibold text-v2-neutral-600">{value}</p>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) {
  return (
    <Card data-detail-item size="sm" variant="outline">
      <CardContent>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-v2-neutral-400">{label}</span>
          <span className="text-v2-neutral-400">{icon}</span>
        </div>
        <p className="mt-2 text-xl font-semibold tracking-[-0.035em] text-v2-neutral-600">{value}</p>
      </CardContent>
    </Card>
  );
}

export default function EmployeeDetailModal({
  employee,
  open,
  onClose,
}: EmployeeDetailProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState<EmployeeDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !employee?.id) {
      setDetailData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    const employeeId = Number(employee.id);

    if (!Number.isFinite(employeeId) || employeeId <= 0) {
      setError("This employee profile could not be identified.");
      return;
    }

    setLoading(true);
    setError(null);

    fetchEmployeeDetail(employeeId)
      .then((result) => {
        if (!cancelled) setDetailData(result);
      })
      .catch((requestError) => {
        if (!cancelled) {
          setDetailData(null);
          setError(requestError instanceof Error ? requestError.message : "Employee details could not be loaded.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [employee?.id, open]);

  useLayoutEffect(() => {
    if (
      !open ||
      loading ||
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
        stagger: 0.035,
        ease: "power3.out",
      });
    }, contentRef);

    return () => context.revert();
  }, [detailData, loading, open]);

  if (!employee) {
    return null;
  }

  const details = detailData?.employee;
  const roleName = details?.role?.name || employee.role || "Not assigned";
  const businessName = details?.business?.name || employee.department || "Not available";
  const salary =
    details?.salary !== null && details?.salary !== undefined
      ? `$${Number(details.salary).toLocaleString()}`
      : "Not specified";
  const registrationDate = details?.registrationDate
    ? new Date(details.registrationDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not available";
  const initials = (employee.name || "Employee")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        ref={contentRef}
        className="max-h-[calc(100dvh-2rem)] overflow-hidden border-v2-neutral-200 bg-v2-neutral-100 p-0 text-v2-neutral-600 shadow-[0_24px_80px_rgba(53,53,54,0.22)] sm:max-w-3xl"
      >
        <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto" data-sidebar-scroll>
          <DialogHeader data-detail-item className="border-v2-neutral-200 pr-20">
            <div className="flex items-center gap-4">
              <Avatar className="size-14 rounded-2xl">
                <AvatarFallback className="rounded-2xl bg-v2-neutral-500 text-base font-semibold text-v2-neutral-100">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-medium text-v2-neutral-400">Employee profile</p>
                <DialogTitle className="mt-1 truncate text-2xl tracking-[-0.035em] text-v2-neutral-600">
                  {employee.name || "Unnamed employee"}
                </DialogTitle>
                <DialogDescription className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-v2-neutral-200 px-2 py-1 text-[11px] font-medium text-v2-neutral-500">
                    {roleName}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-v2-neutral-200 px-2 py-1 text-[11px] font-medium text-v2-neutral-500">
                    <span className="size-1.5 rounded-full bg-v2-neutral-500" aria-hidden="true" />
                    {employee.status || "Active"}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {loading ? (
            <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-sm text-v2-neutral-400">
              <LoaderCircle className="size-5 animate-spin text-v2-neutral-600" aria-hidden="true" />
              Loading employee details...
            </div>
          ) : (
            <div className="space-y-7 px-6 py-6 sm:px-8">
              {error && (
                <div data-detail-item role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <section data-detail-item aria-labelledby="employee-information-title">
                <h3 id="employee-information-title" className="text-sm font-semibold text-v2-neutral-600">
                  Employee information
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailCard icon={<Mail className="size-4" />} label="Email address" value={details?.email || "Not available"} />
                  <DetailCard icon={<BriefcaseBusiness className="size-4" />} label="Designation" value={roleName} />
                  <DetailCard icon={<Building2 className="size-4" />} label="Business" value={businessName} />
                  <DetailCard icon={<CircleDollarSign className="size-4" />} label="Salary" value={salary} />
                  <DetailCard icon={<CalendarDays className="size-4" />} label="Registration date" value={registrationDate} />
                  <DetailCard icon={<ShieldCheck className="size-4" />} label="Verification" value={details?.isVerified === false ? "Pending" : "Verified"} />
                </div>
              </section>

              {detailData?.collaboration && (
                <section data-detail-item aria-labelledby="employee-activity-summary">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-v2-neutral-500" aria-hidden="true" />
                    <h3 id="employee-activity-summary" className="text-sm font-semibold text-v2-neutral-600">Activity summary</h3>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Metric label="Messages" value={detailData.collaboration.messagesSent ?? 0} icon={<MessageSquare className="size-4" />} />
                    <Metric label="Calls" value={detailData.collaboration.totalCalls ?? 0} icon={<PhoneCall className="size-4" />} />
                    <Metric label="Tasks done" value={detailData.taskActivity?.completedTasksFromActivity ?? 0} icon={<ShieldCheck className="size-4" />} />
                    <Metric label="Meeting time" value={`${detailData.collaboration.totalMeetingMinutes ?? 0}m`} icon={<UsersRound className="size-4" />} />
                  </div>
                </section>
              )}

              {detailData?.teams && detailData.teams.length > 0 && (
                <section data-detail-item aria-labelledby="assigned-teams-title">
                  <div className="flex items-center gap-2">
                    <UsersRound className="size-4 text-v2-neutral-500" aria-hidden="true" />
                    <h3 id="assigned-teams-title" className="text-sm font-semibold text-v2-neutral-600">
                      Assigned teams ({detailData.teams.length})
                    </h3>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {detailData.teams.map((team) => (
                      <Card key={team.teamId} data-detail-item size="sm" variant="outline">
                        <CardContent>
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-sm font-semibold text-v2-neutral-600">{team.name}</h4>
                            {team.leader?.name && (
                              <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-v2-neutral-200 px-2 py-1 text-[10px] text-v2-neutral-500">
                                <Crown className="size-3" aria-hidden="true" />
                                {team.leader.name}
                              </span>
                            )}
                          </div>
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-v2-neutral-400">{team.description}</p>
                          <div className="mt-3 flex items-center justify-between border-t border-v2-neutral-200 pt-3 text-[11px] text-v2-neutral-400">
                            <span>{team.totalProjects ?? 0} projects</span>
                            <span>{team.completedTasks ?? 0}/{team.totalTasks ?? 0} tasks</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {detailData?.recentActivities && detailData.recentActivities.length > 0 && (
                <section data-detail-item aria-labelledby="recent-activity-title">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-v2-neutral-500" aria-hidden="true" />
                    <h3 id="recent-activity-title" className="text-sm font-semibold text-v2-neutral-600">Recent activity</h3>
                  </div>
                  <div className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1" data-sidebar-scroll>
                    {detailData.recentActivities.slice(0, 5).map((activity) => (
                      <Card key={activity.id} data-detail-item size="sm" variant="subtle">
                        <CardContent className="flex items-start justify-between gap-4">
                          <p className="text-xs leading-5 text-v2-neutral-500">{activity.description}</p>
                          <time className="shrink-0 text-[10px] text-v2-neutral-400">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </time>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
