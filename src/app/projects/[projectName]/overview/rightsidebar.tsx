"use client";
import React from "react";
import ActivityFeed from "./activityfeed";
import QuickStats from "./quickstats";
import { Task } from "../task/schemas/task";

type RightSidebarProps = {
  tasks: Task[];
};

const RightSidebar = ({ tasks }: RightSidebarProps) => {
  const activities = [
    "Sarah Wilson completed Project Requirements",
    "Michael Chen commented on Backend API Setup",
    "Emily Davis updated Frontend status",
  ];
  const normalizeStatus = (status: string) =>
    status.trim().toLowerCase().replace(/[\s-]+/g, "_");
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
      <div className="w-full min-w-0 space-y-4">
        <QuickStats stats={stats} />
        <ActivityFeed activities={activities} />
      </div>
    </>
  );
};

export default RightSidebar;
