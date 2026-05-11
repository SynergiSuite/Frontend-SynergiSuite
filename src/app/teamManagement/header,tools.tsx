"use client";
import React from "react";
import { Plus } from "lucide-react";

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

        <button className="inline-flex items-center gap-2 rounded bg-black px-4 py-2 text-white">
          <Plus size={16} strokeWidth={2.25} aria-hidden="true" />
          <span>Add Team</span>
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
