"use client";
import React from "react";
import ActivityFeed from "./activityfeed";
import UpcomingDeadlines from "./upcomingdeadline";

const RightSidebar = () => {
  const activities = [
    "Sarah Wilson completed Project Requirements",
    "Michael Chen commented on Backend API Setup",
    "Emily Davis updated Frontend status",
  ];

  const deadlines = [
    { title: "Backend API Setup", date: "Jan 25, 2024" },
    { title: "Frontend Implementation", date: "Jan 28, 2024" },
    { title: "Testing Phase", date: "Feb 5, 2024" },
  ];

  return (
    <>
      <div className="w-1/4 space-y-4">
        <ActivityFeed activities={activities} />
        <UpcomingDeadlines deadlines={deadlines} />
      </div>
    </>
  );
};

export default RightSidebar;