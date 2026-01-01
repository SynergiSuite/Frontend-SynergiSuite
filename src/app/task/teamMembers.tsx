"use client";
import React from "react";

export default function TeamMembers() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Team Members</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span>John Doe</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span>Jane Smith</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span>Alex Johnson</span>
          </li>
        </ul>
      </div>
    </>
  );
}
