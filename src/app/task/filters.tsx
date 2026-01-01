"use client";
import React from "react";

export default function FiltersBar() {
  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-4">
        
        <input
          type="text"
          placeholder="Search tasks..."
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        
        <select className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Review</option>
          <option>Completed</option>
          <option>On Hold</option>
          <option>Blocked</option>
        </select>

        
        <select className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Due Dates</option>
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>

        
        <button className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          + Add New Task
        </button>
      </div>
    </>
  );
}

