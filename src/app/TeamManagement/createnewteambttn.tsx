"use client";
import React from "react";

type CreateTeamButtonProps = {
  onClick: () => void; 
};

export default function CreateTeamButton({ onClick }: CreateTeamButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
    >
      + Create New Team
    </button>
  );
}
