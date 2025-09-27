"use client";
import React, { useState } from "react";

type CreateTeamMembersProps = {
  members: string[];
  setMembers: React.Dispatch<React.SetStateAction<string[]>>;
  initialOptions?: string[];
};

export default function CreateTeamMembers({
  members,
  setMembers,
  initialOptions,
}: CreateTeamMembersProps) {
  const defaultOptions = initialOptions ?? [
    "Sarah Wilson",
    "Michael Chen",
    "Emma Thompson",
    "Alice Johnson",
    "Bob Martin",
  ];

  const [selected, setSelected] = useState<string>(defaultOptions[0]);

  const handleAdd = () => {
    if (!members.includes(selected)) setMembers((s) => [...s, selected]);
  };

  const handleRemove = (name: string) => {
    setMembers((s) => s.filter((m) => m !== name));
  };

  return (
    <>
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-medium text-gray-700">Team Members</h3>
          <button
            type="button"
            onClick={handleAdd}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            + Add Member
          </button>
        </div>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full h-10 border rounded-md px-3 text-sm bg-white"
        >
          {defaultOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2 mt-3">
          {members.length === 0 ? (
            <span className="text-sm text-gray-400">No members added yet.</span>
          ) : (
            members.map((m) => (
              <span
                key={m}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                <span className="inline-block w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                  {m[0]}
                </span>
                <span>{m}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(m)}
                  className="text-gray-500 hover:text-gray-700 ml-1"
                >
                  ✕
                </button>
              </span>
            ))
          )}
        </div>
      </div>
    </>
  );
}
