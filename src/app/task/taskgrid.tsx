"use client";
import React from "react";
import TaskCard from "./taskcard";


const tasks = [
  {
    title: "Design Login Page",
    desc: "Create a responsive login page",
    due: "2025-11-20",
    priority: "High",
    progress: 40,
    status: "To Do",
  },
  {
    title: "Setup Database",
    desc: "Setup Postgres DB with initial schema",
    due: "2025-11-22",
    priority: "Medium",
    progress: 60,
    status: "In Progress",
  },
  {
    title: "API Integration",
    desc: "Integrate login API with frontend",
    due: "2025-11-21",
    priority: "High",
    progress: 30,
    status: "Review",
  },
  {
    title: "UI Testing",
    desc: "Test all UI components",
    due: "2025-11-23",
    priority: "Low",
    progress: 80,
    status: "Completed",
  },
  {
    title: "Bug Fixes",
    desc: "Fix reported bugs from testing",
    due: "2025-11-24",
    priority: "Medium",
    progress: 20,
    status: "On Hold",
  },
  {
    title: "Deploy to Production",
    desc: "Deploy latest version",
    due: "2025-11-25",
    priority: "High",
    progress: 0,
    status: "Blocked",
  },
];

export default function TaskGrid() {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {tasks.map((task, index) => (
          <TaskCard
            key={index}
            title={task.title}
            desc={task.desc}
            due={task.due}
            priority={task.priority}
            progress={task.progress}
            status={task.status}
          />
        ))}
      </div>
    </>
  );
}

