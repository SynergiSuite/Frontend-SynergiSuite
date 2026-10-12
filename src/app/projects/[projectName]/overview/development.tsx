"use client";
import React from "react";

interface TaskPreview {
  title: string;
  owner?: string;
  priority?: string;
  date?: string;
  status?: string;
}

interface DevelopmentPhaseProps {
  tasks?: TaskPreview[];
}

const DevelopmentPhase = ({ tasks = [] }: DevelopmentPhaseProps) => {
  return (
    <div className="bg-v2-neutral-100 border border-v2-neutral-300 rounded-2xl p-5 shadow-sm">
      <h2 className="text-v2-neutral-600 font-bold text-lg mb-4 tracking-tight">Development</h2>

      {tasks && tasks.length > 0 ? (
        tasks.map((task, index) => (
          <div
            key={index}
            className="bg-v2-neutral-200/50 border border-v2-neutral-300 p-3.5 mb-3 last:mb-0 flex justify-between items-center rounded-xl"
          >
            <div>
              <p className="font-semibold text-sm text-v2-neutral-600">{task.title}</p>
              {task.owner && <p className="text-xs text-v2-neutral-400 font-medium mt-0.5">{task.owner}</p>}
            </div>
            <div className="flex gap-2 text-xs">
              {task.priority && (
                <span className="bg-v2-neutral-300 text-v2-neutral-600 px-2.5 py-0.5 rounded-full font-bold">
                  {task.priority}
                </span>
              )}
              {task.date && (
                <span className="bg-v2-neutral-200 text-v2-neutral-500 px-2.5 py-0.5 rounded-full font-medium">
                  {task.date}
                </span>
              )}
              {task.status && (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                  {task.status}
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-xs text-v2-neutral-400 font-medium">No tasks in development.</p>
      )}
    </div>
  );
};

export default DevelopmentPhase;

