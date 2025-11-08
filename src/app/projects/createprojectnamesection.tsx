import React from "react";

export default function ProjectNameSection() {
  return (
    <>
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Project Name
      </label>
      <input
        type="text"
        placeholder="Enter project name"
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
      />
      <p className="text-xs text-gray-500 mt-1">
        Choose a descriptive name for your project
      </p>
    </div>
    </>
  );
}
