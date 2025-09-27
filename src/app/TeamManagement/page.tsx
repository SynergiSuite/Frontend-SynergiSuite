"use client";

import React, { useState } from "react";

import Navbar from "./navbar";
import StateCards from "./statecards";
import TeamActivitiesChart from "./teamactivities";
import TeamPerformanceChart from "./teamperformance";
import TeamHeader from "./teamtableheader";
import TeamTable from "./teamtable";
import CreateTeamForm from "./createnewteamform";
import CreateTeamModal from "./createteamModal";

type Team = 
    {
     name: string;
      description: string;
      members: string[];
     projects: string[];
    };

export default function Page() {
      const [isModalOpen, setIsModalOpen] = useState(false);
    
      const states = [
    { title: "Total Teams", value: 12, change: "+2 this week" },
    { title: "Active Projects", value: 8, change: "+8 this week"},
    { title: "Pending Tasks", value: 24, change: "-5 from last week" },
    { title: "Reports", value: 15, change: "+5% this week" },
  ];

  const activities = [
    { id: 1, text: "Alice created a new team: Design Squad", time: "2h ago" },
    { id: 2, text: "Bob added 5 new tasks to Project Apollo", time: "5h ago" },
    { id: 3, text: "Charlie closed 2 pending tasks", time: "1d ago" },
    { id: 4, text: "Dana updated project settings", time: "2d ago" },
  ];
   return (
    <>
      <Navbar />

      <main className="p-6 space-y-6">
        
        <StateCards states={states} />

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TeamActivitiesChart />
          </div>
          <div className="lg:col-span-1">
            <TeamPerformanceChart />
          </div>
        </div>
        
        <div className="bg-white p-6 border border-gray-400 rounded-lg shadow-md space-y-4">
         
          <TeamHeader onCreateClick={() => setIsModalOpen(true)} /> 

          
          <div className="overflow-x-auto">
            <TeamTable />
          </div>
        </div>
      </main>
      {isModalOpen && (
        <CreateTeamModal onClose={() => setIsModalOpen(false)}>
          <CreateTeamForm
            onCancel={() => setIsModalOpen(false)}
            onCreate={(team: Team) => {
              console.log("✅ New team created:", team);
              setIsModalOpen(false);
            }}
          />
        </CreateTeamModal>
      )}
    </>
  );
}