"use client";
import React from "react";

const UpcomingMilestones = ({ milestones }: any) => {
  return (
    <>
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Upcoming Milestones</h3>

        {milestones.map((item: any, index: number) => (
          <div key={index} className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-gray-500">{item.date}</p>
            </div>

            <span className="text-xs px-2 py-1 rounded bg-gray-100">
              {item.priority}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default UpcomingMilestones;