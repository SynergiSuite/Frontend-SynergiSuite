"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  DollarSign,
  FolderKanban,
  Layers,
  LoaderCircle,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  RefreshCw,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientPriority } from "../enums/clientPriority.enum";
import { getClientDetailsApi } from "./apis/getClientDetails";
import type { ClientType } from "./page";
import type { ClientDetailsResponseDto } from "./dtos/clientDetailsResponse.dto";

type ClientDetailProps = {
  client: ClientType | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (client: ClientType) => void;
  canManageClients?: boolean;
};

type ActiveTab = "overview" | "projects" | "feedbacks";

const getPriorityDetails = (priority: number) => {
  if (priority === ClientPriority.HIGH) {
    return {
      label: "High Priority",
      badgeClass: "bg-rose-50 text-rose-700 border border-rose-200",
      dotClass: "bg-rose-500",
    };
  }

  if (priority === ClientPriority.LOW) {
    return {
      label: "Low Priority",
      badgeClass: "bg-sky-50 text-sky-700 border border-sky-200",
      dotClass: "bg-sky-500",
    };
  }

  return {
    label: "Medium Priority",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",
    dotClass: "bg-amber-500",
  };
};

export default function ClientDetailModal({
  client,
  open,
  onClose,
  onEdit,
  canManageClients = false,
}: ClientDetailProps) {
  const [details, setDetails] = useState<ClientDetailsResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fetch full client details on modal open or client change
  useEffect(() => {
    if (!open || !client?.id) {
      setDetails(null);
      setError(null);
      setActiveTab("overview");
      return;
    }

    let isCancelled = false;

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getClientDetailsApi(client.id);
        if (!isCancelled) {
          setDetails(data);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Failed to fetch extended client details:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load extended client relations."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchDetails();

    return () => {
      isCancelled = true;
    };
  }, [open, client?.id]);

  if (!client) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    window.setTimeout(() => setCopiedField(null), 1800);
  };

  // Merge base client info with extended details
  const clientData = details?.client ?? client;
  const summary = details?.summary;
  const projects = details?.projects ?? [];
  const feedbacks = details?.feedbacks ?? [];
  const deadlines = details?.allUpcomingDeadlines ?? [];

  const priorityCfg = getPriorityDetails(Number(clientData.priority));
  const initials = clientData.name
    ? clientData.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : "CL";

  const totalTasks = summary?.totalTasks ?? 0;
  const completedTasks = summary?.completedTasks ?? 0;
  const taskProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-v2-neutral-600/80 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col rounded-3xl border border-v2-neutral-400 bg-v2-neutral-600 shadow-2xl overflow-hidden text-v2-neutral-100"
          >
            {/* Modal Header */}
            <div className="flex shrink-0 items-start justify-between border-b border-v2-neutral-500 bg-v2-neutral-600/90 p-5 sm:px-6">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-v2-neutral-100 text-base font-bold text-v2-neutral-600 shadow-sm">
                  {initials}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-lg font-bold text-v2-neutral-100">
                      {clientData.name || "Client Details"}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-semibold ${priorityCfg.badgeClass}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${priorityCfg.dotClass}`}
                      />
                      {priorityCfg.label}
                    </span>
                  </div>
                  <p className="flex items-center gap-1.5 truncate text-xs text-v2-neutral-300 mt-0.5">
                    <Building2 className="size-3.5 shrink-0 text-v2-neutral-400" />
                    <span className="truncate">
                      {clientData.company || "Direct Corporate Account"}
                    </span>
                    {clientData.created_at && (
                      <span className="text-v2-neutral-400">
                        • Partner since{" "}
                        {new Date(clientData.created_at).toLocaleDateString(
                          undefined,
                          { month: "short", year: "numeric" }
                        )}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {canManageClients && onEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onClose();
                      onEdit(client);
                    }}
                    className="h-8 gap-1.5 text-xs"
                  >
                    <Pencil className="size-3" />
                    <span>Edit</span>
                  </Button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex size-8 items-center justify-center rounded-xl border border-v2-neutral-500 text-v2-neutral-400 hover:bg-v2-neutral-500 hover:text-v2-neutral-100 transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Quick KPI Summary Strip */}
            <div className="grid grid-cols-2 gap-2 border-b border-v2-neutral-500 bg-v2-neutral-500/20 px-5 py-3 sm:grid-cols-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-v2-neutral-500/60 text-v2-neutral-200">
                  <FolderKanban className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-v2-neutral-400">
                    Projects
                  </p>
                  <p className="text-sm font-bold text-v2-neutral-100">
                    {summary?.totalProjects ?? (isLoading ? "..." : 0)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-v2-neutral-500/60 text-v2-neutral-200">
                  <CheckCircle2 className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-v2-neutral-400">
                    Tasks
                  </p>
                  <p className="text-sm font-bold text-v2-neutral-100">
                    {completedTasks}/{totalTasks}
                    {totalTasks > 0 && (
                      <span className="ml-1 text-xs font-normal text-emerald-400">
                        ({taskProgress}%)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-v2-neutral-500/60 text-v2-neutral-200">
                  <Layers className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-v2-neutral-400">
                    Milestones
                  </p>
                  <p className="text-sm font-bold text-v2-neutral-100">
                    {summary?.totalMilestones ?? (isLoading ? "..." : 0)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-v2-neutral-500/60 text-v2-neutral-200">
                  <Star className="size-4 text-amber-400" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-v2-neutral-400">
                    Rating
                  </p>
                  <p className="text-sm font-bold text-v2-neutral-100">
                    {summary?.averageFeedbackRating
                      ? `★ ${summary.averageFeedbackRating}`
                      : "5.0 ★"}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs Header */}
            <div className="flex shrink-0 items-center gap-2 border-b border-v2-neutral-500 px-5 pt-2 sm:px-6">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`relative px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "overview"
                    ? "text-v2-neutral-100"
                    : "text-v2-neutral-400 hover:text-v2-neutral-200"
                }`}
              >
                Overview & Deadlines
                {activeTab === "overview" && (
                  <motion.div
                    layoutId="client-tab-indicator"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-v2-neutral-100"
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("projects")}
                className={`relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "projects"
                    ? "text-v2-neutral-100"
                    : "text-v2-neutral-400 hover:text-v2-neutral-200"
                }`}
              >
                <span>Projects</span>
                <span className="grid size-4 place-items-center rounded-full bg-v2-neutral-500/60 text-[10px] font-bold text-v2-neutral-300">
                  {projects.length}
                </span>
                {activeTab === "projects" && (
                  <motion.div
                    layoutId="client-tab-indicator"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-v2-neutral-100"
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("feedbacks")}
                className={`relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "feedbacks"
                    ? "text-v2-neutral-100"
                    : "text-v2-neutral-400 hover:text-v2-neutral-200"
                }`}
              >
                <span>Feedback Tickets</span>
                <span className="grid size-4 place-items-center rounded-full bg-v2-neutral-500/60 text-[10px] font-bold text-v2-neutral-300">
                  {feedbacks.length}
                </span>
                {activeTab === "feedbacks" && (
                  <motion.div
                    layoutId="client-tab-indicator"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-v2-neutral-100"
                  />
                )}
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar space-y-5">
              {/* Error notice if relation fetch failed */}
              {error && (
                <div className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!client?.id) return;
                      setError(null);
                      setIsLoading(true);
                      getClientDetailsApi(client.id)
                        .then(setDetails)
                        .catch((e) =>
                          setError(
                            e?.message || "Failed to load client details"
                          )
                        )
                        .finally(() => setIsLoading(false));
                    }}
                    className="inline-flex items-center gap-1 underline hover:text-white cursor-pointer ml-3 shrink-0"
                  >
                    <RefreshCw className="size-3" />
                    Retry
                  </button>
                </div>
              )}

              {/* Loading Indicator */}
              {isLoading && !details && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-v2-neutral-400">
                  <LoaderCircle className="size-7 animate-spin text-v2-neutral-300 mb-3" />
                  <p className="text-xs font-medium">
                    Loading complete client portfolio...
                  </p>
                </div>
              )}

              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-5">
                  {/* Contact & Rate Grid */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Email Card with Copy button */}
                    <div className="flex items-center justify-between rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/30 p-3.5">
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-v2-neutral-400 flex items-center gap-1.5">
                          <Mail className="size-3" /> Email Address
                        </span>
                        <a
                          href={`mailto:${clientData.email}`}
                          className="mt-1 block truncate text-xs font-semibold text-v2-neutral-100 hover:underline"
                        >
                          {clientData.email || "No email registered"}
                        </a>
                      </div>
                      {clientData.email && (
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(clientData.email, "email")
                          }
                          title="Copy email"
                          className="p-1.5 rounded-lg border border-v2-neutral-500 text-v2-neutral-400 hover:text-v2-neutral-100 hover:bg-v2-neutral-500/50 transition-colors cursor-pointer"
                        >
                          {copiedField === "email" ? (
                            <Check className="size-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Phone Card with Copy button */}
                    <div className="flex items-center justify-between rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/30 p-3.5">
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-v2-neutral-400 flex items-center gap-1.5">
                          <Phone className="size-3" /> Telephone
                        </span>
                        <a
                          href={`tel:${clientData.phone}`}
                          className="mt-1 block truncate text-xs font-semibold text-v2-neutral-100 hover:underline"
                        >
                          {clientData.phone || "No phone provided"}
                        </a>
                      </div>
                      {clientData.phone && (
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(clientData.phone || "", "phone")
                          }
                          title="Copy phone"
                          className="p-1.5 rounded-lg border border-v2-neutral-500 text-v2-neutral-400 hover:text-v2-neutral-100 hover:bg-v2-neutral-500/50 transition-colors cursor-pointer"
                        >
                          {copiedField === "phone" ? (
                            <Check className="size-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Billing Rate Card */}
                    <div className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/30 p-3.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-v2-neutral-400 flex items-center gap-1.5">
                        <DollarSign className="size-3" /> Billing Agreement
                      </span>
                      <p className="mt-1 text-xs font-semibold text-v2-neutral-100">
                        ${clientData.amount || 0} /{" "}
                        <span className="font-normal text-v2-neutral-300">
                          {clientData.paymentType === "each_milestone"
                            ? "Each Milestone Deliverable"
                            : "Billable Hour"}
                        </span>
                      </p>
                    </div>

                    {/* Physical Address */}
                    <div className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/30 p-3.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-v2-neutral-400 flex items-center gap-1.5">
                        <MapPin className="size-3" /> Registered Location
                      </span>
                      <p className="mt-1 truncate text-xs font-semibold text-v2-neutral-100">
                        {clientData.address || "Corporate address not set"}
                      </p>
                    </div>
                  </div>

                  {/* Upcoming Project Deadlines */}
                  <div className="rounded-2xl border border-v2-neutral-500 bg-v2-neutral-500/20 p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-v2-neutral-500/70">
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-v2-neutral-300" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-v2-neutral-200">
                          Upcoming Contract Deadlines
                        </h4>
                      </div>
                      <span className="text-xs text-v2-neutral-400 font-medium">
                        {deadlines.length} scheduled
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {deadlines.length > 0 ? (
                        deadlines.slice(0, 4).map((item) => (
                          <div
                            key={`${item.type}-${item.id}`}
                            className="flex items-center justify-between gap-3 rounded-xl border border-v2-neutral-500/70 bg-v2-neutral-500/35 p-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={`grid size-6 shrink-0 place-items-center rounded-lg text-[10px] font-bold ${
                                  item.type === "milestone"
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                }`}
                              >
                                {item.type === "milestone" ? "M" : "T"}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-v2-neutral-100">
                                  {item.title}
                                </p>
                                {item.projectName && (
                                  <p className="truncate text-[11px] text-v2-neutral-400">
                                    in {item.projectName}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {item.daysRemaining !== null &&
                                item.daysRemaining !== undefined && (
                                  <span
                                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold border ${
                                      item.daysRemaining < 0
                                        ? "bg-rose-500/20 text-rose-300 border-rose-500/35"
                                        : item.daysRemaining <= 2
                                        ? "bg-amber-500/20 text-amber-300 border-amber-500/35"
                                        : "bg-v2-neutral-500/40 text-v2-neutral-300 border-v2-neutral-500"
                                    }`}
                                  >
                                    {item.daysRemaining < 0
                                      ? `${Math.abs(item.daysRemaining)}d overdue`
                                      : item.daysRemaining === 0
                                      ? "Due today"
                                      : `${item.daysRemaining}d left`}
                                  </span>
                                )}
                              {item.dueDate && (
                                <span className="text-[11px] text-v2-neutral-400">
                                  {new Date(item.dueDate).toLocaleDateString(
                                    undefined,
                                    { month: "short", day: "numeric" }
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="py-4 text-center text-xs text-v2-neutral-400">
                          No pending deadlines scheduled for this client.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECTS */}
              {activeTab === "projects" && (
                <div className="space-y-3">
                  {projects.length > 0 ? (
                    projects.map((proj) => {
                      const projTasks = proj.tasks ?? [];
                      const completedCount = projTasks.filter(
                        (t) => String(t.status).toLowerCase() === "completed"
                      ).length;
                      const progress =
                        projTasks.length > 0
                          ? Math.round((completedCount / projTasks.length) * 100)
                          : 0;

                      return (
                        <div
                          key={proj.id}
                          className="rounded-2xl border border-v2-neutral-500 bg-v2-neutral-500/30 p-4 transition-all hover:bg-v2-neutral-500/40"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-v2-neutral-100 truncate">
                                {proj.name}
                              </h4>
                              {proj.description && (
                                <p className="text-xs text-v2-neutral-300 mt-1 line-clamp-2">
                                  {proj.description}
                                </p>
                              )}
                            </div>

                            <span className="inline-flex items-center rounded-md border border-v2-neutral-400 bg-v2-neutral-500/50 px-2 py-0.5 text-[11px] font-semibold text-v2-neutral-200 shrink-0">
                              {proj.milestones?.length ?? 0} Milestones
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3.5 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] text-v2-neutral-400">
                              <span>Task Completion Progress</span>
                              <span className="font-semibold text-v2-neutral-200">
                                {completedCount} / {projTasks.length} ({progress}%)
                              </span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-v2-neutral-500 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-dashed border-v2-neutral-500/70 p-8 text-center text-v2-neutral-400">
                      <FolderKanban className="size-8 mx-auto mb-2 opacity-40" />
                      <p className="text-xs font-semibold text-v2-neutral-300">
                        No projects linked yet
                      </p>
                      <p className="text-[11px] text-v2-neutral-400 mt-0.5">
                        Assign this client to projects in the Projects panel.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: FEEDBACK TICKETS */}
              {activeTab === "feedbacks" && (
                <div className="space-y-3">
                  {feedbacks.length > 0 ? (
                    feedbacks.map((fb) => (
                      <div
                        key={fb.id}
                        className="rounded-2xl border border-v2-neutral-500 bg-v2-neutral-500/30 p-4 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs font-bold text-v2-neutral-100 truncate">
                                {fb.titleOfFeedback || "Client Feedback"}
                              </h5>
                              {fb.starRating && (
                                <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 text-amber-300 px-1.5 py-0.5 text-[10px] font-bold">
                                  ★ {fb.starRating}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-v2-neutral-300 mt-1 leading-relaxed">
                              {fb.feedback}
                            </p>
                          </div>

                          <span className="rounded-md border border-v2-neutral-400 bg-v2-neutral-500/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-v2-neutral-300 shrink-0">
                            {fb.status || "Open"}
                          </span>
                        </div>

                        {/* Replies Thread */}
                        {fb.replies && fb.replies.length > 0 && (
                          <div className="mt-2.5 border-t border-v2-neutral-500/60 pt-2 space-y-1.5 pl-3 border-l-2 border-l-v2-neutral-400">
                            {fb.replies.map((reply) => (
                              <div key={reply.id} className="text-[11px]">
                                <span className="font-semibold text-v2-neutral-200">
                                  {reply.createdBy?.name || "Support team"}:
                                </span>{" "}
                                <span className="text-v2-neutral-300">
                                  {reply.message}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-v2-neutral-500/70 p-8 text-center text-v2-neutral-400">
                      <MessageSquare className="size-8 mx-auto mb-2 opacity-40" />
                      <p className="text-xs font-semibold text-v2-neutral-300">
                        No feedback tickets recorded
                      </p>
                      <p className="text-[11px] text-v2-neutral-400 mt-0.5">
                        Client communications and ticket replies will appear here.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex shrink-0 items-center justify-end border-t border-v2-neutral-500 bg-v2-neutral-600/90 px-6 py-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
