"use client";
import React from "react";

const TeamTable = () => {
  const teams = [
    { name: "Development Team", role: "Developer", access: "Full Access", members: "8 members", status: "Active" },
    { name: "Design Team", role: "Designer", access: "Limited", members: "5 members", status: "Active" },
    { name: "QA Team", role: "Tester", access: "Standard", members: "4 members", status: "Active" },
    { name: "Product Team", role: "Manager", access: "Full Access", members: "3 members", status: "Active" },
  ];

  return (
    <>
      <div className="bg-white border rounded-lg mb-10">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left p-3">Team Name</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Access Level</th>
              <th className="text-left p-3">Members</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {teams.map((team, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{team.name}</td>
                <td className="p-3">{team.role}</td>
                <td className="p-3">{team.access}</td>
                <td className="p-3">{team.members}</td>
                <td className="p-3">{team.status}</td>
                <td className="p-3">⋯</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TeamTable;