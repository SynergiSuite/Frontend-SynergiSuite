"use client";
import React from "react";
import { Plus, Download, Filter } from "lucide-react";

export default function UserActions() {
  // 👉 JavaScript functions
  const handleAddUser = () => {
    console.log("Add User clicked");
  };

  const handleExport = () => {
    console.log("Export clicked");
  };

  const handleFilter = () => {
    console.log("Filter clicked");
  };

  return (
    <>
      <div className="flex justify-end items-center space-x-3">
        {/* Add User */}
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={16} /> Add User
        </button>

        {/* Export */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
        >
          <Download size={16} /> Export
        </button>

        {/* Filter */}
        <button
          onClick={handleFilter}
          className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
        >
          <Filter size={16} /> Filter
        </button>
      </div>
    </>
  );
}
