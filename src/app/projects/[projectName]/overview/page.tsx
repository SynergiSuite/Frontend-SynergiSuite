"use client";
import React, { useEffect, useState } from "react";
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

const Page = () => {
  const projectName = useParams().projectName as string;
  const [projectDetail, setProjectDetail] = useState<Project>();
  const [teams, setTeams] = useState<Team[]>();
  const [role, setRole] = useState("");
  const [isCreateMilestoneOpen, setIsCreateMilestoneOpen] = useState(false);
  const [milestoneRefreshKey, setMilestoneRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const canEditMilestones = canManageMilestones(role);
  
  // Fetch project details
  useEffect(() => {
    const cookieRole = CookieManager("get", "role");
    setRole((cookieRole as string) ?? "");

    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true)
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

  const completionStatus = () => {
    const totalTasks = projectDetail?.tasks?.length || 0;
    const completedTasks = projectDetail?.tasks?.filter((task) => task.status === "completed").length || 0;
    const status = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    return status;
  }
  
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
      }
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
        <div className="min-h-screen">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{projectName}'s Overview</h1>
            <p className="text-sm text-gray-500">
              Track progress, tasks, and upcoming milestones in one place
            </p>
          </div>
          {canEditMilestones ? (
            <Button
              className="button_primary_xl w-full sm:w-auto"
              onClick={() => setIsCreateMilestoneOpen(true)}
            >
              Create new Milestone
            </Button>
          ) : null}
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <LeftSidebar
            completionStatus={completionStatus()}
            projectDetail={projectDetail}
            teams={teams}
            canManageTeams={canEditMilestones}
            onSaveTeams={handleSaveTeams}
          />
          <MiddleSection
            projectId={projectDetail?.id}
            availableTasks={projectDetail?.tasks ?? []}
            canManageMilestones={canEditMilestones}
            refreshKey={milestoneRefreshKey}
          />
          <RightSidebar tasks={projectDetail?.tasks || []} />
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
