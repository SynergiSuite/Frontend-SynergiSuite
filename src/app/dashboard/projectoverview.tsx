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
      <div className="rounded-lg border bg-white p-4 sm:p-6">
        {/* Heading */}
        <h2 className="text-lg font-semibold mb-4 text-left">Project Overview</h2>

        <div className="overflow-x-auto">
        <div className="flex min-w-[320px] justify-center sm:min-w-0">
          {/* Y-axis */}
          <div className="mr-3 flex h-[176px] flex-col justify-between text-xs text-gray-500 sm:mr-4 sm:text-sm">
            {yAxis.map((num) => (
              <span key={num}>{num}</span>
            ))}
          </div>

          {/* Bars */}
          <div className="flex h-[176px] items-end gap-3 sm:gap-4">
            {data.map((item) => {
              const barHeight = (item.value / maxValue) * containerHeight;
              return (
                <div key={item.label} className="flex flex-col items-center justify-end">
                  {/* Bar */}
                  <div
                    className="w-10 rounded-md bg-orange-400 transition-all duration-500 sm:w-12"
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
      </div>
    </>
  );
}


