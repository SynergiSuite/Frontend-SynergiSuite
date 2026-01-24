"use client";
import React from "react";

const TeamMembers = ({ members }: any) => {
  return (
    <>
      <div className="bg-white p-4 rounded shadow mt-4">
        <h3 className="font-semibold mb-2">Team Members</h3>
        {members.map((member: string, index: number) => (
          <p key={index} className="text-sm">{member}</p>
        ))}
        <button className="mt-2 text-blue-500">+ Add Member</button>
      </div>
    </>
  );
};

export default TeamMembers;