"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  ChevronLeft,
  FolderKanban,
  KanbanSquare,
  LoaderCircle,
  Plus,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { getTeamsApi } from "@/app/projects/apis/getAllTeamsApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CookieManager } from "@/lib/cookieManager";
import { canManageMilestones } from "@/lib/rolePermissions";

import { CreateNewMilestone } from "../apis/createNewMilestone";
import editTeams from "../apis/editTeams";
import { GetProjectDetails } from "../apis/getProjectDetails";
import { Project } from "../schemas/project";
import { Team } from "../../schemas/team";
import StateCards, { type StateCardProps } from "../../statecards";
import CreateMilestoneModal, {
  type NewMilestonePayload,
} from "./createMilestone";
import LeftSidebar from "./leftsidebar";
import MiddleSection from "./middlesection";
import RightSidebar from "./rightsidebar";

function getStatusBadge(status?: string | number) {
  const norm = String(status || "").toLowerCase();
  if (norm === "2" || norm === "completed") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (norm === "1" || norm === "in_progress" || norm === "in progress") {
    return "bg-sky-50 text-sky-700 border-sky-200";
  }
  if (norm === "3" || norm === "on_hold" || norm === "on hold") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (norm === "4" || norm === "at_risk" || norm === "at risk") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  return "bg-v2-neutral-200 text-v2-neutral-500 border-v2-neutral-300";
}

function getStatusLabel(status?: string | number) {
  const norm = String(status || "").toLowerCase();
  if (norm === "2" || norm === "completed") return "Completed";
  if (norm === "1" || norm === "in_progress" || norm === "in progress")
    return "In Progress";
  if (norm === "3" || norm === "on_hold" || norm === "on hold") return "On Hold";
  if (norm === "4" || norm === "at_risk" || norm === "at risk") return "At Risk";
  return "In Queue";
}

export default function ProjectOverviewPage() {
  const router = useRouter();
  const rawProjectName = useParams().projectName as string;
  const projectName = decodeURIComponent(rawProjectName || "");

  const [projectDetail, setProjectDetail] = useState<Project | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [role, setRole] = useState("");
  const [isCreateMilestoneOpen, setIsCreateMilestoneOpen] = useState(false);
  const [milestoneRefreshKey, setMilestoneRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const canEditMilestones = canManageMilestones(role);

  // Read role
  useEffect(() => {
    const cookieRole =
      CookieManager("get", "primary_role") || CookieManager("get", "role");
    setRole(String(cookieRole || ""));
  }, []);

  // Fetch Project Details & Teams
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        const [details, teamsList] = await Promise.all([
          GetProjectDetails(projectName),
          getTeamsApi().catch(() => []),
        ]);

        if (!cancelled) {
          setProjectDetail(details);
          setTeams(teamsList || []);
        }
      } catch (error) {
        console.error("Error fetching project overview:", error);
        if (!cancelled) {
          const msg =
            error instanceof Error
              ? error.message
              : "Unable to load project details.";
          setErrorMsg(msg);
          toast.error(msg);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    if (projectName) {
      fetchData();
    }

    return () => {
      cancelled = true;
    };
  }, [projectName, reloadKey]);

  // GSAP Entrance Animations
  useLayoutEffect(() => {
    const element = containerRef.current;
    if (
      !element ||
      isLoading ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.from("[data-overview-section]", {
        autoAlpha: 0,
        y: 12,
        duration: 0.42,
        stagger: 0.07,
        ease: "power2.out",
      });
    }, element);

    return () => context.revert();
  }, [isLoading]);

  const calculateCompletionStatus = () => {
    const totalTasks = projectDetail?.tasks?.length || 0;
    const completedTasks =
      projectDetail?.tasks?.filter(
        (task) => String(task.status).toLowerCase() === "completed"
      ).length || 0;
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const handleCreateMilestone = async (payload: NewMilestonePayload) => {
    if (!canEditMilestones) {
      toast.error("You do not have permission to create milestones.");
      return;
    }

    try {
      await CreateNewMilestone(payload);
      toast.success("Milestone created successfully.");
      setMilestoneRefreshKey((prev) => prev + 1);
      setIsCreateMilestoneOpen(false);
    } catch (error) {
      console.error("Error creating milestone:", error);
      toast.error("Unable to create milestone.");
    }
  };

  const handleSaveTeams = async (teamIds: string[]) => {
    try {
      if (!projectDetail) return;
      const obj = {
        project_id: projectDetail.id,
        team_id: teamIds,
      };
      const res = await editTeams(obj);
      if (res.ok) {
        toast.success("Teams updated successfully.");
        const allAvailableTeams = teams || [];
        const selectedTeams = allAvailableTeams.filter((team) =>
          teamIds.includes(team.id)
        );
        setProjectDetail({ ...projectDetail, teams: selectedTeams });
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast.error(
          Array.isArray(errJson.message)
            ? errJson.message.join(", ")
            : errJson.message || "Unable to update teams for this project."
        );
      }
    } catch (error) {
      console.error("Error updating teams:", error);
      toast.error("Unable to update teams for this project.");
    }
  };

  const totalTasksCount = projectDetail?.tasks?.length || 0;
  const completedTasksCount =
    projectDetail?.tasks?.filter(
      (t) => String(t.status).toLowerCase() === "completed"
    ).length || 0;
  const completionPercentage = calculateCompletionStatus();
  const assignedSquadsCount = projectDetail?.teams?.length || 0;

  const stats: StateCardProps[] = [
    {
      title: "Project Progress",
      value: `${completionPercentage}%`,
      change: "Overall deliverable completion",
    },
    {
      title: "Tasks Delivered",
      value: `${completedTasksCount} / ${totalTasksCount}`,
      change: "Completed project tasks",
    },
    {
      title: "Deployed Squads",
      value: assignedSquadsCount,
      change: "Active teams on project",
    },
    {
      title: "Client",
      value:
        projectDetail?.client?.company ||
        projectDetail?.client?.name ||
        "Direct",
      change: "Designated sponsor",
    },
  ];

  return (
    <div ref={containerRef} className="min-h-full text-v2-neutral-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-2 sm:py-3">
        {/* Header & Breadcrumb */}
        <header
          data-overview-section
          className="flex flex-col gap-5 border-b border-v2-neutral-500 pb-7"
        >
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-v2-neutral-400">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-v2-neutral-300 hover:text-v2-neutral-100 transition-colors font-medium"
            >
              <ChevronLeft className="size-4" />
              Projects
            </Link>
            <span>/</span>
            <span className="truncate text-v2-neutral-100 font-semibold">
              {projectName}
            </span>
            <span>/</span>
            <span className="text-v2-neutral-400">Overview</span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-100 sm:text-4xl">
                  {projectName}
                </h1>
                {projectDetail?.status !== undefined && (
                  <span
                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold border ${getStatusBadge(
                      projectDetail.status
                    )}`}
                  >
                    {getStatusLabel(projectDetail.status)}
                  </span>
                )}
              </div>

              <p className="mt-2.5 text-sm leading-6 text-v2-neutral-300">
                {projectDetail?.description ||
                  "Track roadmap milestones, team squad assignments, execution tasks, and client feedback."}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(`/projects/${encodeURIComponent(projectName)}/task`)
                }
                className="gap-2 border-v2-neutral-400/70 bg-v2-neutral-600/40 text-v2-neutral-100 hover:bg-v2-neutral-500 hover:text-v2-neutral-100 text-xs font-semibold"
              >
                <KanbanSquare className="size-4" />
                Tasks Board
              </Button>

              {canEditMilestones && (
                <Button
                  type="button"
                  variant="default"
                  onClick={() => setIsCreateMilestoneOpen(true)}
                  className="gap-2 bg-v2-neutral-100 text-v2-neutral-600 hover:bg-v2-neutral-200 shadow-md font-semibold text-xs"
                >
                  <Plus className="size-4" />
                  New Milestone
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        {isLoading ? (
          <Card data-overview-section className="min-h-80 items-center justify-center">
            <CardContent className="flex flex-col items-center gap-3 text-sm text-v2-neutral-400 py-16">
              <LoaderCircle className="size-5 animate-spin text-v2-neutral-600" />
              Loading project details...
            </CardContent>
          </Card>
        ) : errorMsg && !projectDetail ? (
          <Card data-overview-section>
            <CardContent className="flex min-h-72 flex-col items-center justify-center text-center p-8">
              <span className="grid size-12 place-items-center rounded-2xl bg-v2-neutral-200 text-v2-neutral-500">
                <FolderKanban className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-v2-neutral-600">
                Project could not be loaded
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-v2-neutral-400">
                {errorMsg}
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-5"
                onClick={() => setReloadKey((k) => k + 1)}
              >
                <RefreshCw className="size-4 mr-2" />
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Top State Cards */}
            <div data-overview-section>
              <StateCards states={stats} />
            </div>

            {/* 3-Column Layout */}
            <div
              data-overview-section
              className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(260px,1fr)_minmax(0,1.85fr)_minmax(260px,1fr)]"
            >
              {/* Left Column: Project Spec & Squads */}
              <div className="space-y-5">
                <LeftSidebar
                  completionStatus={completionPercentage}
                  projectDetail={projectDetail || undefined}
                  teams={teams}
                  canManageTeams={canEditMilestones}
                  onSaveTeams={handleSaveTeams}
                />
              </div>

              {/* Center Column: Milestones & Roadmap */}
              <div className="min-w-0">
                <MiddleSection
                  projectId={projectDetail?.id}
                  availableTasks={projectDetail?.tasks ?? []}
                  canManageMilestones={canEditMilestones}
                  refreshKey={milestoneRefreshKey}
                />
              </div>

              {/* Right Column: Task Distribution & Feedback */}
              <div className="space-y-5">
                <RightSidebar
                  tasks={projectDetail?.tasks || []}
                  projectId={projectDetail?.id}
                  projectName={projectName}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create Milestone Modal */}
      {isCreateMilestoneOpen && canEditMilestones && (
        <CreateMilestoneModal
          onCancel={() => setIsCreateMilestoneOpen(false)}
          onSubmit={handleCreateMilestone}
          projectName={projectName}
          projectDetail={projectDetail || undefined}
        />
      )}
    </div>
  );
}
