"use client";
import React from "react";

const ProjectStatus = ({ progress, startDate, dueDate }: any) => {
  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Project Status</h3>
        <p className="text-2xl font-bold">{progress}%</p>
        <p className="text-sm mt-2">Start: {startDate}</p>
        <p className="text-sm">Due: {dueDate}</p>
      </div>
    </>
  );
};

export default ProjectStatus;