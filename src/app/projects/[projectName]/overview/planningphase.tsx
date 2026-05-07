"use client";
import React from "react";

const PlanningPhase = ({ tasks }: any) => {
  return (
    <>
      <div className="overview-card p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Planning Phase</h2>

        {tasks.map((task: any, index: number) => (
          <div key={index} className="overview-card p-3 mb-2 flex justify-between">
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm">{task.owner}</p>
            </div>
            <div className="flex gap-2">
              <span>{task.priority}</span>
              <span>{task.date}</span>
              <span>{task.status}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PlanningPhase;
