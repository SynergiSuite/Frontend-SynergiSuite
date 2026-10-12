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
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date; // e.g. "2 months" or text duration
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function LeftSidebar({
  completionStatus,
  projectDetail,
  teams,
  canManageTeams = false,
  onSaveTeams,
}: LeftSidebarProps) {
  return (
    <div className="space-y-5">
      <ProjectStatus
        progress={completionStatus}
        managedBy={projectDetail?.client?.name}
        clientCompany={projectDetail?.client?.company}
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
  );
}
