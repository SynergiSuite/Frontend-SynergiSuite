"use client";
import React from "react";
import CreateTeamButton from "./createnewteambttn";

type TeamHeaderProps = {
  onCreateClick: () => void; 
};

export default function TeamHeader({ onCreateClick }: TeamHeaderProps){
  return (
    <>
       <div className="flex items-center justify-between">
        
      <h2 className="text-lg font-semibold text-gray-800">
        All Teams <span className="text-gray-500 text-sm">(24)</span>
      </h2>
            <CreateTeamButton onClick={onCreateClick} />
        
      </div>
    </>
  );
}

