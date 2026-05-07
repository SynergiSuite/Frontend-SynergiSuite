"use client";
import React from "react";
import ActivityFeed from "./activityfeed";
import UpcomingDeadlines from "./upcomingdeadline";
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

  return (
    <>
      <div className="w-full space-y-4 lg:w-1/4">
        <ActivityFeed activities={activities} />
        <UpcomingDeadlines deadlines={tasks} />
      </div>
    </>
  );
};

export default RightSidebar;
