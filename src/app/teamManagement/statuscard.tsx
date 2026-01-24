"use client";
import React from "react";

const StatusCard = ({ title, description, teams }: any) => {
  return (
    <>
      <div className="border rounded-lg p-5 bg-white">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>

        <p className="text-sm font-medium mb-2">Accessible by:</p>

        {teams.map((team: string, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input type="checkbox" />
            <span className="text-sm">{team}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default StatusCard;