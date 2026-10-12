"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  ArrowUpRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FolderKanban,
  LayoutGrid,
  List,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CookieManager } from "@/lib/cookieManager";
import { canManageProjects } from "@/lib/rolePermissions";

import { getClientsApi } from "./apis/getAllClients";
import { getTeamsApi } from "./apis/getAllTeamsApi";
import {
  getProjectsApi,
  type ProjectsPaginationMeta,
} from "./apis/getProjectsApi";
import CreateProjectModal from "./createProjectModal";
import DeleteProjectModal from "./deleteProjectModal";
import EditProjectModal from "./editProjectModal";
import { PriorityLevel } from "./schemas/priority.enum";
import type { Client } from "./schemas/client";
import type { Projects } from "./schemas/project";
import type { Team } from "./schemas/team";
import StateCards, { type StateCardProps } from "./statecards";

const TABS = [
  "All",
  "In Queue",
  "In Progress",
  "Completed",
  "On Hold",
  "At Risk",
] as const;

function getStatusLabel(status: number): string {
  switch (status) {
    case PriorityLevel.InQueue:
      return "In Queue";
    case PriorityLevel.InProgress:
      return "In Progress";
    case PriorityLevel.Completed:
      return "Completed";
    case PriorityLevel.OnHold:
      return "On Hold";
    case PriorityLevel.AtRisk:
      return "At Risk";
    default:
      return "In Queue";
  }
}

function getStatusBadgeStyles(status: number) {
  switch (status) {
    case PriorityLevel.InQueue:
      return "bg-v2-neutral-200 text-v2-neutral-500 border border-v2-neutral-300";
    case PriorityLevel.InProgress:
      return "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800";
    case PriorityLevel.Completed:
      return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
    case PriorityLevel.OnHold:
      return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
    case PriorityLevel.AtRisk:
      return "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
    default:
      return "bg-v2-neutral-200 text-v2-neutral-500 border border-v2-neutral-300";
  }
}

function calculateProgress(tasks?: unknown[]): number {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) return 0;
  const completed = tasks.filter(
    (task) =>
      typeof task === "object" &&
      task !== null &&
      "status" in task &&
      String((task as { status?: string }).status ?? "").toLowerCase() ===
        "completed"
  ).length;
  return Math.round((completed / tasks.length) * 100);
}

export default function ProjectsPanel() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [paginationMeta, setPaginationMeta] =
    useState<ProjectsPaginationMeta | null>(null);

  const [teams, setTeams] = useState<Team[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [userRole, setUserRole] = useState("");

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Projects | null>(null);
  const [deletingProject, setDeletingProject] = useState<Projects | null>(null);

  const canManage = canManageProjects(userRole);

  // Debounced search
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  // Read role from cookies
  useEffect(() => {
    const cookieRole =
      CookieManager("get", "primary_role") || CookieManager("get", "role");
    setUserRole(String(cookieRole || ""));
  }, []);

  // Fetch Teams
  useEffect(() => {
    let cancelled = false;
    const fetchTeams = async () => {
      try {
        const teamsData = await getTeamsApi();
        if (!cancelled) setTeams(teamsData);
      } catch (err) {
        console.error("Failed to load teams:", err);
      }
    };
    void fetchTeams();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch Clients
  useEffect(() => {
    let cancelled = false;
    const fetchClients = async () => {
      try {
        const clientsData = await getClientsApi();
        if (!cancelled) setClients(clientsData);
      } catch (err) {
        console.error("Failed to load clients:", err);
      }
    };
    void fetchClients();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch Projects Data
  const loadProjects = useCallback(async () => {
    setIsDataLoading(true);
    setDataError(null);

    try {
      const response = await getProjectsApi(
        currentPage,
        debouncedSearch,
        userRole
      );
      setProjects(response.data || []);
      setPaginationMeta(response.meta || null);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Projects data could not be loaded.";
      setDataError(msg);
      toast.error(msg);
    } finally {
      setIsDataLoading(false);
      setIsInitialLoading(false);
    }
  }, [currentPage, debouncedSearch, userRole]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects, reloadKey]);

  const rootRef = useRef<HTMLDivElement>(null);
  const viewContainerRef = useRef<HTMLDivElement>(null);

  const refresh = () => setReloadKey((prev) => prev + 1);

  // Navigate to Project Details
  const handleOpenProject = (project: Projects) => {
    const safeName = encodeURIComponent(project.name || "");
    CookieManager("set", "client-name", project.client?.name || "No Client");
    CookieManager("set", "project-id", project.id);

    const role = userRole.toLowerCase();
    if (role === "client") {
      router.push(`/projects/${safeName}/task`);
    } else {
      router.push(`/projects/${safeName}/overview`);
    }
  };

  // Filter projects by active status tab
  const filteredProjects = projects.filter((project) => {
    if (activeTab === "All") return true;
    return getStatusLabel(project.status) === activeTab;
  });

  // GSAP entrance animations
  useLayoutEffect(() => {
    const element = rootRef.current;
    if (
      !element ||
      isInitialLoading ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.from("[data-projects-section]", {
        autoAlpha: 0,
        y: 12,
        duration: 0.42,
        stagger: 0.07,
        ease: "power2.out",
      });
    }, element);

    return () => context.revert();
  }, [isInitialLoading]);

  // Smooth GSAP transition on viewMode toggle or filter change
  useLayoutEffect(() => {
    const container = viewContainerRef.current;
    if (
      !container ||
      isInitialLoading ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      if (viewMode === "grid") {
        const cards = container.querySelectorAll("[data-project-item]");
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            {
              autoAlpha: 0,
              y: 10,
              scale: 0.985,
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.32,
              stagger: 0.035,
              ease: "power2.out",
              clearProps: "transform,opacity,visibility",
            }
          );
        }
      } else {
        // Table view: animate the table wrapper smoothly and fade in rows without distorting table cell geometry
        const tableWrapper = container.querySelector(
          "[data-project-table-wrapper]"
        );
        const rows = container.querySelectorAll("tbody tr");

        if (tableWrapper) {
          gsap.fromTo(
            tableWrapper,
            {
              autoAlpha: 0,
              y: 8,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.28,
              ease: "power2.out",
              clearProps: "transform,opacity,visibility",
            }
          );
        }

        if (rows.length > 0) {
          gsap.fromTo(
            rows,
            {
              autoAlpha: 0,
            },
            {
              autoAlpha: 1,
              duration: 0.24,
              stagger: 0.02,
              ease: "power1.out",
              clearProps: "opacity,visibility",
            }
          );
        }
      }
    }, container);

    return () => context.revert();
  }, [viewMode, activeTab, filteredProjects.length, isInitialLoading]);

  // Calculate high-level stats
  const totalProjectsCount = paginationMeta?.totalItems ?? projects.length;
  const inProgressCount = projects.filter(
    (p) => p.status === PriorityLevel.InProgress
  ).length;
  const completedCount = projects.filter(
    (p) => p.status === PriorityLevel.Completed
  ).length;
  const atRiskOrQueueCount = projects.filter(
    (p) =>
      p.status === PriorityLevel.AtRisk || p.status === PriorityLevel.InQueue
  ).length;

  const stats: StateCardProps[] = [
    {
      title: "Total Projects",
      value: totalProjectsCount,
      change: "Active in workspace",
    },
    {
      title: "In Progress",
      value: inProgressCount,
      change: "Currently executing",
    },
    {
      title: "Completed",
      value: completedCount,
      change: "Successfully delivered",
    },
    {
      title: "Queue & Risks",
      value: atRiskOrQueueCount,
      change: "Requiring attention",
    },
  ];

  const totalPages = paginationMeta?.totalPages ?? 1;

  return (
    <div ref={rootRef} className="min-h-full text-v2-neutral-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-2 sm:py-3">
        {/* Header */}
        <header
          data-projects-section
          className="flex flex-col gap-5 border-b border-v2-neutral-500 pb-7 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-100 sm:text-4xl">
              Projects
            </h1>
            <p className="mt-3 text-sm leading-6 text-v2-neutral-300">
              Track project lifecycles, manage deliverables, assign squads, and monitor execution progress.
            </p>
          </div>

          {canManage && (
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="default"
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2 bg-v2-neutral-100 text-v2-neutral-600 hover:bg-v2-neutral-200 shadow-md font-semibold"
              >
                <Plus className="size-4" />
                Create New Project
              </Button>
            </div>
          )}
        </header>

        {/* Loading / Error / Main View */}
        {isInitialLoading ? (
          <Card data-projects-section className="min-h-80 items-center justify-center">
            <CardContent className="flex flex-col items-center gap-3 text-sm text-v2-neutral-400">
              <LoaderCircle className="size-5 animate-spin text-v2-neutral-600" />
              Loading project workspace...
            </CardContent>
          </Card>
        ) : dataError && projects.length === 0 ? (
          <Card data-projects-section>
            <CardContent className="flex min-h-72 flex-col items-center justify-center text-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-v2-neutral-200 text-v2-neutral-500">
                <FolderKanban className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-v2-neutral-600">
                Projects could not be loaded
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-v2-neutral-400">
                {dataError}
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-5"
                onClick={refresh}
              >
                <RefreshCw className="size-4 mr-2" />
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Top Stat Cards */}
            <div data-projects-section>
              <StateCards states={stats} />
            </div>

            {/* Filter & Controls Card */}
            <Card data-projects-section className="relative min-w-0">
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4">
                  {/* Search and Action Bar */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-base font-semibold text-v2-neutral-600">
                          All Projects
                        </h2>
                        <span className="inline-flex items-center rounded-full bg-v2-neutral-200 px-2.5 py-0.5 text-xs font-semibold text-v2-neutral-600">
                          {totalProjectsCount}
                        </span>
                      </div>
                      <p className="text-xs text-v2-neutral-400 mt-0.5">
                        Filter by execution status or search by project and client name.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* Search Input */}
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-v2-neutral-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search projects or clients..."
                          className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 pl-9 pr-4 text-xs text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-400 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20"
                        />
                      </div>

                      {/* View Switcher */}
                      <div className="flex items-center rounded-xl border border-v2-neutral-300 bg-v2-neutral-200/60 p-0.5 shrink-0">
                        <button
                          type="button"
                          aria-label="Grid View"
                          onClick={() => setViewMode("grid")}
                          className={`rounded-lg p-1.5 transition-colors ${
                            viewMode === "grid"
                              ? "bg-v2-neutral-100 text-v2-neutral-600 shadow-sm"
                              : "text-v2-neutral-400 hover:text-v2-neutral-600"
                          }`}
                        >
                          <LayoutGrid className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Table View"
                          onClick={() => setViewMode("table")}
                          className={`rounded-lg p-1.5 transition-colors ${
                            viewMode === "table"
                              ? "bg-v2-neutral-100 text-v2-neutral-600 shadow-sm"
                              : "text-v2-neutral-400 hover:text-v2-neutral-600"
                          }`}
                        >
                          <List className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Status Tab Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 v2-scrollbar">
                    {TABS.map((tab) => {
                      const isActive = activeTab === tab;
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                            isActive
                              ? "bg-v2-neutral-600 text-v2-neutral-100 shadow-sm"
                              : "bg-v2-neutral-200/70 text-v2-neutral-500 hover:bg-v2-neutral-200 hover:text-v2-neutral-600"
                          }`}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative pt-0">
                {isDataLoading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-v2-neutral-100/80 backdrop-blur-[2px]">
                    <LoaderCircle className="size-5 animate-spin text-v2-neutral-600" />
                  </div>
                )}

                <div ref={viewContainerRef} className="relative">
                  {filteredProjects.length === 0 ? (
                    <div className="flex min-h-64 flex-col items-center justify-center text-center p-6">
                      <span className="grid size-12 place-items-center rounded-2xl bg-v2-neutral-200 text-v2-neutral-500">
                        <FolderKanban className="size-5" />
                      </span>
                      <h3 className="mt-4 text-base font-semibold text-v2-neutral-600">
                        No projects found
                      </h3>
                      <p className="mt-1 text-xs text-v2-neutral-400 max-w-sm">
                        {searchQuery
                          ? `No projects matching "${searchQuery}".`
                          : "There are no projects in this status category."}
                      </p>
                      {canManage && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateModalOpen(true)}
                          className="mt-4 border-v2-neutral-300 text-v2-neutral-600 hover:bg-v2-neutral-200"
                        >
                          <Plus className="size-4 mr-1.5" />
                          Create New Project
                        </Button>
                      )}
                    </div>
                  ) : viewMode === "grid" ? (
                    /* ================= GRID VIEW ================= */
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                      {filteredProjects.map((project) => {
                        const progress = calculateProgress(project.tasks);
                        const completedTasks = Array.isArray(project.tasks)
                          ? project.tasks.filter(
                              (t) =>
                                typeof t === "object" &&
                                t !== null &&
                                "status" in t &&
                                String(
                                  (t as { status?: string }).status ?? ""
                                ).toLowerCase() === "completed"
                            ).length
                          : 0;
                        const totalTasks = Array.isArray(project.tasks)
                          ? project.tasks.length
                          : 0;

                        return (
                          <div
                            key={project.id}
                            data-project-item
                            onClick={() => handleOpenProject(project)}
                            className="group relative flex flex-col justify-between rounded-2xl border border-v2-neutral-300 bg-v2-neutral-100 p-5 shadow-sm transition-all duration-200 hover:border-v2-neutral-400 hover:shadow-md cursor-pointer"
                          >
                            <div>
                              {/* Card Header: Title & Actions */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <span
                                    className={`inline-block rounded-lg px-2.5 py-0.5 text-[11px] font-semibold ${getStatusBadgeStyles(
                                      project.status
                                    )}`}
                                  >
                                    {getStatusLabel(project.status)}
                                  </span>
                                  <h3 className="mt-2.5 line-clamp-1 text-base font-semibold text-v2-neutral-600 group-hover:text-v2-neutral-500 transition-colors">
                                    {project.name}
                                  </h3>
                                </div>

                                {/* Edit & Delete Action Buttons */}
                                {canManage && (
                                  <div
                                    className="flex items-center gap-1 shrink-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      aria-label="Edit project"
                                      onClick={() => setEditingProject(project)}
                                      className="inline-flex size-8 items-center justify-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-500 hover:bg-v2-neutral-200 hover:text-v2-neutral-600 transition-colors"
                                    >
                                      <Pencil className="size-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      aria-label="Delete project"
                                      onClick={() => setDeletingProject(project)}
                                      className="inline-flex size-8 items-center justify-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-500 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Client & Description Info */}
                              <div className="mt-3 flex items-center gap-2 text-xs text-v2-neutral-400">
                                <Building2 className="size-3.5 shrink-0 text-v2-neutral-400" />
                                <span className="truncate">
                                  {project.client?.company ||
                                    project.client?.name ||
                                    "No client specified"}
                                </span>
                              </div>

                              {project.description && (
                                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-v2-neutral-400">
                                  {project.description}
                                </p>
                              )}

                              {/* Progress Bar */}
                              <div className="mt-5">
                                <div className="flex items-center justify-between text-xs font-medium text-v2-neutral-500 mb-1.5">
                                  <span>Progress</span>
                                  <span className="font-semibold text-v2-neutral-600">
                                    {progress}%
                                  </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-v2-neutral-200">
                                  <div
                                    className="h-full rounded-full bg-v2-neutral-600 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <div className="mt-1.5 flex items-center justify-between text-[11px] text-v2-neutral-400">
                                  <span>
                                    {completedTasks} of {totalTasks} tasks completed
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Card Footer: Squads & Timeline */}
                            <div className="mt-5 flex items-center justify-between border-t border-v2-neutral-200 pt-3 text-xs">
                              <div className="flex items-center gap-1.5 text-v2-neutral-500">
                                <UsersRound className="size-3.5 text-v2-neutral-400" />
                                <span className="text-xs font-medium">
                                  {project.teams?.length || 0}{" "}
                                  {project.teams?.length === 1
                                    ? "Squad"
                                    : "Squads"}
                                </span>
                              </div>

                              {project.duration && (
                                <div className="flex items-center gap-1 text-[11px] text-v2-neutral-400">
                                  <Clock3 className="size-3" />
                                  <span>{project.duration}</span>
                                </div>
                              )}

                              <span className="inline-flex size-6 items-center justify-center rounded-full bg-v2-neutral-200 text-v2-neutral-500 group-hover:bg-v2-neutral-600 group-hover:text-v2-neutral-100 transition-colors">
                                <ArrowUpRight className="size-3.5" />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* ================= TABLE VIEW ================= */
                    <div
                      data-project-table-wrapper
                      className="overflow-x-auto rounded-xl border border-v2-neutral-300"
                    >
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-v2-neutral-300 bg-v2-neutral-200/60 font-semibold text-v2-neutral-500">
                          <tr>
                            <th className="py-3.5 pl-4 pr-3">Project Title</th>
                            <th className="px-3 py-3.5">Client</th>
                            <th className="px-3 py-3.5">Status</th>
                            <th className="px-3 py-3.5">Progress</th>
                            <th className="px-3 py-3.5">Squads</th>
                            <th className="px-3 py-3.5">Timeline</th>
                            {canManage && (
                              <th className="py-3.5 pl-3 pr-4 text-right">
                                Actions
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600">
                          {filteredProjects.map((project) => {
                            const progress = calculateProgress(project.tasks);

                            return (
                              <tr
                                key={project.id}
                                data-project-item
                                onClick={() => handleOpenProject(project)}
                                className="group hover:bg-v2-neutral-200/50 transition-colors cursor-pointer"
                              >
                                <td className="py-3.5 pl-4 pr-3 font-semibold text-v2-neutral-600">
                                  <div className="flex items-center gap-2">
                                    <FolderKanban className="size-4 text-v2-neutral-400 group-hover:text-v2-neutral-600" />
                                    <span className="line-clamp-1">
                                      {project.name}
                                    </span>
                                  </div>
                                </td>

                                <td className="px-3 py-3.5 text-v2-neutral-400">
                                  {project.client?.company ||
                                    project.client?.name ||
                                    "—"}
                                </td>

                                <td className="px-3 py-3.5">
                                  <span
                                    className={`inline-block rounded-lg px-2.5 py-0.5 text-[11px] font-semibold ${getStatusBadgeStyles(
                                      project.status
                                    )}`}
                                  >
                                    {getStatusLabel(project.status)}
                                  </span>
                                </td>

                                <td className="px-3 py-3.5">
                                  <div className="flex items-center gap-2.5">
                                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-v2-neutral-200">
                                      <div
                                        className="h-full rounded-full bg-v2-neutral-600"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                    <span className="text-[11px] font-medium text-v2-neutral-500">
                                      {progress}%
                                    </span>
                                  </div>
                                </td>

                                <td className="px-3 py-3.5 text-v2-neutral-400">
                                  {project.teams?.length || 0} squads
                                </td>

                                <td className="px-3 py-3.5 text-v2-neutral-400">
                                  {project.duration || "—"}
                                </td>

                                {canManage && (
                                  <td
                                    className="py-3.5 pl-3 pr-4 text-right"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center justify-end gap-1">
                                      <button
                                        type="button"
                                        aria-label="Edit project"
                                        onClick={() => setEditingProject(project)}
                                        className="inline-flex size-7 items-center justify-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-500 hover:bg-v2-neutral-200 hover:text-v2-neutral-600"
                                      >
                                        <Pencil className="size-3" />
                                      </button>
                                      <button
                                        type="button"
                                        aria-label="Delete project"
                                        onClick={() => setDeletingProject(project)}
                                        className="inline-flex size-7 items-center justify-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-500 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                                      >
                                        <Trash2 className="size-3" />
                                      </button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                {paginationMeta &&
                  (paginationMeta.totalPages > 1 ||
                    paginationMeta.totalItems > 0) && (
                    <div className="mt-6 flex flex-col gap-3 border-t border-v2-neutral-200 pt-4 sm:flex-row sm:items-center sm:justify-between text-xs">
                      <p className="text-v2-neutral-400">
                        Showing{" "}
                        <span className="font-semibold text-v2-neutral-600">
                          {paginationMeta.itemCount > 0
                            ? (currentPage - 1) * paginationMeta.itemsPerPage +
                              1
                            : 0}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold text-v2-neutral-600">
                          {Math.min(
                            currentPage * paginationMeta.itemsPerPage,
                            paginationMeta.totalItems
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-v2-neutral-600">
                          {paginationMeta.totalItems}
                        </span>{" "}
                        projects
                      </p>

                      {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1 || isDataLoading}
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            className="h-8 border-v2-neutral-300 text-v2-neutral-600 hover:bg-v2-neutral-200"
                          >
                            <ChevronLeft className="size-3.5 mr-1" />
                            Previous
                          </Button>

                          <span className="px-2 font-medium text-v2-neutral-500">
                            Page {currentPage} of {totalPages}
                          </span>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={
                              currentPage >= totalPages || isDataLoading
                            }
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            className="h-8 border-v2-neutral-300 text-v2-neutral-600 hover:bg-v2-neutral-200"
                          >
                            Next
                            <ChevronRight className="size-3.5 ml-1" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={refresh}
        teams={teams}
        clients={clients}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        project={editingProject}
        isOpen={editingProject !== null}
        onClose={() => setEditingProject(null)}
        onSuccess={refresh}
        teams={teams}
      />

      {/* Delete Project Confirmation Modal */}
      <DeleteProjectModal
        open={deletingProject !== null}
        project={deletingProject}
        onCancel={() => setDeletingProject(null)}
        onSuccess={refresh}
      />
    </div>
  );
}
