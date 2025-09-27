"use client";
import React, { useState } from "react";

type AssignProjectsProps = {
  projects: string[];
  setProjects: React.Dispatch<React.SetStateAction<string[]>>;
  initialOptions?: string[];
};

export default function AssignProjects({
  projects,
  setProjects,
  initialOptions,
}: AssignProjectsProps) {
  const defaultOptions = initialOptions ?? [
    "Website Redesign",
    "Mobile App",
    "Marketing Campaign",
  ];

  const [selected, setSelected] = useState<string>(defaultOptions[0]);

  const handleAdd = () => {
    if (!projects.includes(selected)) setProjects((s) => [...s, selected]);
  };

  const handleRemove = (name: string) =>
    setProjects((s) => s.filter((p) => p !== name));

  return (
    <>
      <div className="space-y-3 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-medium text-gray-700">Assign Projects</h3>
          <button
            type="button"
            onClick={handleAdd}
            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
          >
            + Assign Project
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
          {projects.length === 0 ? (
            <span className="text-sm text-gray-400">No projects assigned yet.</span>
          ) : (
            projects.map((p) => (
              <span
                key={p}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                <span>{p}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(p)}
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
