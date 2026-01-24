"use client";
import React from "react";
import Toolbar from "./toolbar";
import PlanningPhase from "./planningphase";
import DevelopmentPhase from "./development";

const MiddleSection = () => {
  const planningTasks = [
    { title: "Project Requirements", owner: "Sarah Wilson", priority: "High", date: "Jan 20", status: "In Progress" },
    { title: "Resource Allocation", owner: "Michael Chen", priority: "Medium", date: "Jan 22", status: "Completed" },
  ];

  const devTasks = [
    { title: "Backend API Setup", owner: "Emily Davis", priority: "High", date: "Jan 25", status: "Blocked" },
    { title: "Frontend Implementation", owner: "Sarah Wilson", priority: "Medium", date: "Jan 28", status: "In Progress" },
  ];

  return (
    <>
      <div className="w-2/4 px-6">
        <Toolbar />
        <PlanningPhase tasks={planningTasks} />
        <DevelopmentPhase tasks={devTasks} />
      </div>
    </>
  );
};

export default MiddleSection;