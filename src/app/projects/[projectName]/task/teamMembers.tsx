"use client";
import React from "react";

export default function TeamMembers({ projectName, clientName }: { projectName: string, clientName: string }) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{projectName}</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <span className="truncate max-w-[220px]">{clientName}</span>
          </li>
        </ul>
      </div>
    </>
  );
}
