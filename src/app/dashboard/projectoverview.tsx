"use client";
import React from "react";

// Bar chart data
const data = [
  { label: "In Progress", value: 12 },
  { label: "Completed", value: 8 },
  { label: "On Hold", value: 3 },
  { label: "Delayed", value: 1 },
];

const yAxis = [12, 9, 6, 3, 0];
const maxValue = 12;
const containerHeight = 176; // h-44 = 12rem

export default function ProjectOverview() {
  return (
    <>
      <div className="bg-white border rounded-lg p-6">
        {/* Heading */}
        <h2 className="text-lg font-semibold mb-4 text-left">Project Overview</h2>

        <div className="flex justify-center">
          {/* Y-axis */}
          <div className="flex flex-col justify-between text-sm text-gray-500 h-[176px] mr-4">
            {yAxis.map((num) => (
              <span key={num}>{num}</span>
            ))}
          </div>

          {/* Bars */}
          <div className="flex items-end h-[176px] space-x-4">
            {data.map((item) => {
              const barHeight = (item.value / maxValue) * containerHeight;
              return (
                <div key={item.label} className="flex flex-col items-center justify-end">
                  {/* Bar */}
                  <div
                    className="bg-orange-400 w-12 rounded-md transition-all duration-500"
                    style={{ height: `${barHeight}px` }}
                  ></div>

                  {/* Label */}
                  <span className="text-xs mt-1 text-gray-600 text-center whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}



