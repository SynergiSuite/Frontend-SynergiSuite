"use client";
import React from "react";
import { Plus } from "lucide-react";

export default function QuickActions() {
  const handleCreateTask = () => {
    window.dispatchEvent(new CustomEvent("open-create-task"));
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
        <div className="flex flex-col gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={handleCreateTask}
            type="button"
          >
            <Plus size={16} strokeWidth={2.25} aria-hidden="true" />
            <span>Create Task</span>
          </button>
          <button className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 text-gray-800">
            Generate Report
          </button>
        </div>
      </div>
    </>
  );
}
