"use client";
import React from "react";

const resources = [
  { name: "Development", value: 85 },
  { name: "Design", value: 70 },
  { name: "Marketing", value: 60 },
];

export default function ResourceAllocation() {
  return (
    <>
      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold mb-4">Resource Allocation</h2>

        <div className="space-y-3 text-sm">
          {resources.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between mb-1">
                <span>{item.name}</span>
                <span>{item.value}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded">
                <div
                  className="h-2 bg-gray-800 rounded"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

