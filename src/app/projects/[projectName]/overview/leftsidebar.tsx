"use client";
import React from "react";
import ProjectStatus from "./projectstatus";
import TeamMembers from "./teamMembers";
import QuickStats from "./quickstats";
import { Project } from "../schemas/project";
import { Team } from "../../schemas/team";

interface LeftSidebarProps {
  completionStatus: number;
  projectDetail?: Project;
  teams?: Team[];
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

const LeftSidebar = ({ completionStatus, projectDetail, teams, onSaveTeams }: LeftSidebarProps) => {
  const normalizeStatus = (status: string) =>
    status.trim().toLowerCase().replace(/[\s-]+/g, "_");

  const tasks = projectDetail?.tasks ?? [];
  const stats = tasks.reduce(
    (acc, task) => {
      const normalized = normalizeStatus(task.status || "");
      if (normalized === "completed") acc.completed += 1;
      if (normalized === "in_progress") acc.inProgress += 1;
      if (normalized === "blocked") acc.blocked += 1;
      if (normalized === "todo") acc.todo += 1;
      acc.total += 1;
      return acc;
    },
    { total: 0, completed: 0, inProgress: 0, blocked: 0, todo: 0 }
  );

  return (
    <>
      <div className="w-full space-y-4 lg:w-1/4">
        <ProjectStatus
          progress={completionStatus}
          startDate={formatDate(projectDetail?.created_at)}
          dueDate={formatDate(projectDetail?.duration)}
        />
        <TeamMembers
          selectedTeams={projectDetail?.teams ?? []}
          allTeams={teams ?? []}
          onSaveTeams={onSaveTeams}
        />
        <QuickStats stats={stats} />
      </div>
    </>
  );
};

export default LeftSidebar;
