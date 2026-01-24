"use client";
import React from "react";
import ProjectStatus from "./projectstatus";
import TeamMembers from "./teamMembers";
import QuickStats from "./quickstats";

const LeftSidebar = () => {
  const stats = { total: 24, completed: 12, inProgress: 8, blocked: 4 };
  const members = ["Sarah Wilson", "Michael Chen", "Emily Davis"];

  return (
    <>
      <div className="w-1/4 space-y-4">
        <ProjectStatus progress={45} startDate="Jan 15, 2024" dueDate="Mar 30, 2024" />
        <TeamMembers members={members} />
        <QuickStats stats={stats} />
      </div>
    </>
  );
};

export default LeftSidebar;