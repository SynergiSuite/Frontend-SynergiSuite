"use client";
import React, { useEffect, useState, useRef } from "react";
import LeftSidebar from "./leftsidebar";
import MiddleSection from "./middlesection";
import RightSidebar from "./rightsidebar";
import { Button } from "@/global/buttons";
import { useParams } from "next/navigation";
import { GetProjectDetails } from "../apis/getProjectDetails";
import { Project } from "../schemas/project";
import CreateMilestoneModal, {
  type NewMilestonePayload,
} from "./createMilestone";
import { AnimatePresence } from "framer-motion";
import { CreateNewMilestone } from "../apis/createNewMilestone";
import { getTeamsApi } from "@/app/teams/apis/getTeamsApi";
import { Team } from "../../schemas/team";
import editTeams from "../apis/editTeams";
import LoaderCustom from "@/components/ui/loader-custom";
import { toast } from "sonner";
import { CookieManager } from "@/lib/cookieManager";
import { canManageMilestones } from "@/lib/rolePermissions";
import { gsap } from "gsap";

const Page = () => {
  const projectName = useParams().projectName as string;
  const [projectDetail, setProjectDetail] = useState<Project>();
  const [teams, setTeams] = useState<Team[]>();
  const [role, setRole] = useState("");
  const [isCreateMilestoneOpen, setIsCreateMilestoneOpen] = useState(false);
  const [milestoneRefreshKey, setMilestoneRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const canEditMilestones = canManageMilestones(role);

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Fetch project details
  useEffect(() => {
    const cookieRole = CookieManager("get", "role");
    setRole((cookieRole as string) ?? "");

    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true);
        const details = await GetProjectDetails(projectName);
        setProjectDetail(details);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    const fetchTeams = async () => {
      try {
        const details = await getTeamsApi();
        setTeams(details.teams);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectDetails();
    fetchTeams();
  }, [projectName]);

  // GSAP Page Entrance Animation
  useEffect(() => {
    if (!isLoading && containerRef.current) {
      const animElements = containerRef.current.querySelectorAll(".overview-animate-item");
      if (animElements.length > 0) {
        gsap.killTweensOf(animElements);
        gsap.fromTo(
          animElements,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          }
        );
      }
    }
  }, [isLoading]);

  const completionStatus = () => {
    const totalTasks = projectDetail?.tasks?.length || 0;
    const completedTasks = projectDetail?.tasks?.filter((task) => task.status === "completed").length || 0;
    const status = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    return status;
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
      toast.error("Unable to create milestone.");
    }
  };

  const handleSaveTeams = async(teamIds: string[]) => {
    try {
      const obj = {
        project_id: projectDetail?.id,
        team_id: teamIds
      };
      if (!teams || !projectDetail) {
        return;
      }
      const res = await editTeams(obj);
      if (res.ok){
        toast.success("Teams updated successfully.");
        const selectedTeams = teams.filter((team) => teamIds.includes(team.id));
        setProjectDetail({ ...projectDetail, teams: selectedTeams });
      } else {
        toast.error("Unable to update teams for this project.");
      }
    } catch (error) {
      toast.error("Unable to update teams for this project.");
    }
  };

  return (
    <>
      {isLoading ? (
        <LoaderCustom />
      ) : (
        <div ref={containerRef} className="min-h-screen bg-[#030114] text-white py-8 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
          {/* Ambient Glowing Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(82,113,255,0.08),transparent_65%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(34,211,238,0.05),transparent_65%)] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between overview-animate-item">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  {projectName}'s Overview
                </h1>
                <p className="text-sm text-white/40 mt-1 font-medium">
                  Track progress, tasks, and upcoming milestones in one place
                </p>
              </div>
              {canEditMilestones ? (
                <Button
                  className="rounded-xl px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:shadow-[0_0_22px_rgba(82,113,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto cursor-pointer"
                  onClick={() => setIsCreateMilestoneOpen(true)}
                  variant="add"
                >
                  Create new Milestone
                </Button>
              ) : null}
            </div>

            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(240px,0.85fr)_minmax(0,1.7fr)_minmax(260px,0.95fr)] 2xl:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.8fr)_minmax(280px,1fr)]">
              <div className="overview-animate-item min-w-0 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto xl:pr-1 custom-scrollbar">
                <LeftSidebar
                  completionStatus={completionStatus()}
                  projectDetail={projectDetail}
                  teams={teams}
                  canManageTeams={canEditMilestones}
                  onSaveTeams={handleSaveTeams}
                />
              </div>
              <div className="overview-animate-item min-w-0">
                <MiddleSection
                  projectId={projectDetail?.id}
                  availableTasks={projectDetail?.tasks ?? []}
                  canManageMilestones={canEditMilestones}
                  refreshKey={milestoneRefreshKey}
                />
              </div>
              <div className="overview-animate-item min-w-0 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto xl:pr-1 custom-scrollbar">
                <RightSidebar tasks={projectDetail?.tasks || []} />
              </div>
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {isCreateMilestoneOpen && canEditMilestones ? (
          <CreateMilestoneModal
            onCancel={() => setIsCreateMilestoneOpen(false)}
            onSubmit={handleCreateMilestone}
            projectName={projectName}
            projectDetail={projectDetail}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Page;
