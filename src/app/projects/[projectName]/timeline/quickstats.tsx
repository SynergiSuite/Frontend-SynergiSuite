"use client";
import React from "react";

const QuickStats = ({ stats }: any) => {
  return (
    <>
      <div className="bg-white border rounded-lg p-4 mb-4">
        <h3 className="font-semibold mb-3">Quick Stats</h3>

        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Total Milestones</span>
          <span className="font-medium">{stats.total}</span>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Completion</span>
          <span className="font-medium">{stats.completion}%</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Team Members</span>
          <span className="font-medium">{stats.members}</span>
        </div>
      </div>
    </>
  );
};

export default QuickStats;