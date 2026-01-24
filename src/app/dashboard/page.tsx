import React from "react";
import StateCards, { Card }  from "./statecards";
import ProjectOverview from "./projectoverview";
import TeamPerformance from "./teamperformance";
import RecentActivities from "./recentactivities";
import UpcomingDeadlines from "./upcomingdeadlines";
import ResourceAllocation from "./resourceallocation";

const cardsData: Card[] = [
  { title: "Active Projects", value: 24, change: "↑ 12% from last month" }, 
  { title: "Team Members", value: 156, change: "↑ 8% from this month" },
  { title: "Active Clients", value: 38, change: "↑ 76% retention", progress: 76 },
  { title: "Open Tasks", value: 284, change: "↓ 4% more than usual" },
];

export default function Page() {
  return (
    <>
      <div className="flex bg-gray-50 min-h-screen">  
        <main className="flex-1 p-6 space-y-6">
         
          <StateCards cards={cardsData} />

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProjectOverview />
            <TeamPerformance />
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RecentActivities />
            <UpcomingDeadlines />
            <ResourceAllocation />
          </div>
        </main>
      </div>
    </>
  );
}