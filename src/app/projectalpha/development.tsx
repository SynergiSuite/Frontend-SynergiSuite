"use client";
import React from "react";

const DevelopmentPhase = ({ tasks }: any) => {
  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Development</h2>

        {tasks.map((task: any, index: number) => (
          <div key={index} className="border p-3 rounded mb-2 flex justify-between">
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

export default DevelopmentPhase;