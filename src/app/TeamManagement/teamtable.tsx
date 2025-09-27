"use client";
import React from "react";

export default function TeamTable() {
  const teams = [
    {
      name: "Design Team",
      members: 8,
      projects: 3,
      progress: 70,
      lastActive: "2h ago",
    },
    {
      name: "Development Team",
      members: 15,
      projects: 5,
      progress: 55,
      lastActive: "5h ago",
    },
    {
      name: "Marketing Team",
      members: 10,
      projects: 2,
      progress: 80,
      lastActive: "1d ago",
    },
  ];

  return (
    <>
      <table className="w-full text-sm text-left text-gray-700 border-collapse">
        
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2">Team Name</th>
            <th className="px-4 py-2">Members</th>
            <th className="px-4 py-2">Projects</th>
            <th className="px-4 py-2">Progress</th>
            <th className="px-4 py-2">Last Active</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>

       
        <tbody>
          {teams.map((team, index) => (
            <tr key={index} className="border-t border-gray-300">
              <td className="px-4 py-2 font-medium">{team.name}</td>
              <td className="px-4 py-2">{team.members}</td>
              <td className="px-4 py-2">{team.projects}</td>
              <td className="px-4 py-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${team.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{team.progress}%</span>
              </td>
              <td className="px-4 py-2">{team.lastActive}</td>
              <td className="px-4 py-2 flex items-center space-x-3">
                
                <button>
                  <img src="/icons/edit.svg" alt="Edit" className="w-5 h-5" />
                </button>
                <button>
                  <img src="/icons/delete.svg" alt="Delete" className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
