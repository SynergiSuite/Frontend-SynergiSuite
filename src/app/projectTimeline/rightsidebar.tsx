"use client";
import React from "react";
import TimeFilter from "./rightbarheader";
import QuickStats from "./quickstats";
import UpcomingMilestones from "./upcomingmilestone";

const RightSidebar = () => {
  const stats = {
    total: 12,
    completion: 75,
    members: 8,
  };

  const milestones = [
    { title: "User Testing", date: "Dec 20, 2023", priority: "High" },
    { title: "Marketing Launch", date: "Dec 25, 2023", priority: "Medium" },
    { title: "Final Review", date: "Dec 30, 2023", priority: "Low" },
  ];

  return (
    <>
      <div className="w-80">
        <TimeFilter />
        <QuickStats stats={stats} />
        <UpcomingMilestones milestones={milestones} />
      </div>
    </>
  );
};

export default RightSidebar;