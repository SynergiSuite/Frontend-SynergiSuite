"use client";
import React from "react";

const ProjectInitiation = () => {
  return (
    <>
      <div className="bg-white border rounded-lg p-5 mb-6">
        <div className="flex justify-between mb-2">
          <p className="text-sm text-gray-500">November 1, 2023</p>
          <span className="text-xs px-3 py-1 rounded bg-green-100 text-green-700">
            Completed
          </span>
        </div>

        <h2 className="text-lg font-semibold">Project Initiation</h2>
        <p className="text-gray-500 text-sm mt-1">
          Initial project planning and team assembly
        </p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="border rounded p-3">
            <p className="text-xs text-gray-500">Team Structure</p>
            <p className="text-sm font-medium">8 members assigned</p>
          </div>

          <div className="border rounded p-3">
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-sm font-medium">3 months planned</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectInitiation;