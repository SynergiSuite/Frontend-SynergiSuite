"use client";
import React from "react";

const TeamManagementHeader = () => {
  return (
    <>
      <div className="flex justify-between items-center mt-8 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Team Management</h1>
          <p className="text-sm text-gray-500">
            Manage team assignments and access levels for your project
          </p>
        </div>

        <button className="bg-black text-white px-4 py-2 rounded">
          Add Team
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search teams..."
          className="border rounded px-4 py-2 w-80"
        />
      </div>
    </>
  );
};

export default TeamManagementHeader;