"use client";
import React from "react";

export default function QuickActions() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
        <div className="flex flex-col gap-2">
          <button className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 text-gray-800">
            Create Task
          </button>
          <button className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 text-gray-800">
            Schedule Meetings
          </button>
          <button className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 text-gray-800">
            Generate Report
          </button>
        </div>
      </div>
    </>
  );
}

