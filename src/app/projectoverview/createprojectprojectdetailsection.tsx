import React from "react";

export default function ProjectDetailsSection() {
  return (
    <>
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-800 mb-2 border-b pb-1">
        Project Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-gray-400"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Status
        </label>
        <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-gray-400">
          <option>Select status</option>
          <option>Active</option>
          <option>Completed</option>
          <option>On Hold</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Description
        </label>
        <textarea
          rows={4}
          placeholder="Enter project description"
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-gray-400"
        ></textarea>
      </div>
    </div>
    </>
  );
}
