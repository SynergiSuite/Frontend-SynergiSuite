"use client";
import React from "react";
import ProjectStatus from "./projectstatus";
import TeamMembers from "./teamMembers";
import { Project } from "../schemas/project";
import { Team } from "../../schemas/team";

interface LeftSidebarProps {
  completionStatus: number;
  projectDetail?: Project;
  teams?: Team[];
  canManageTeams?: boolean;
  onSaveTeams?: (teamIds: string[]) => void;
}

const formatDate = (date?: string) => {
  if (!date) {
    return "-";
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const LeftSidebar = ({
  completionStatus,
  projectDetail,
  teams,
  canManageTeams = false,
  onSaveTeams,
}: LeftSidebarProps) => {
  return (
    <>
      <div className="space-y-5">
        <ProjectStatus
          progress={completionStatus}
          managedBy={projectDetail?.client?.name}
          startDate={formatDate(projectDetail?.created_at)}
          dueDate={formatDate(projectDetail?.duration)}
        />
        <TeamMembers
          selectedTeams={projectDetail?.teams ?? []}
          allTeams={teams ?? []}
          canManageTeams={canManageTeams}
          onSaveTeams={onSaveTeams}
        />
      </div>
    </>
  );
};


export default LeftSidebar;
