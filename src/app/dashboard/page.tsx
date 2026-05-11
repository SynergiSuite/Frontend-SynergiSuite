import React from "react";
import StateCards, { Card }  from "./stateCard";
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
      <div className="min-h-0 bg-gray-50">  
        <main className="space-y-6 p-4 sm:p-6">
         
          <StateCards cards={cardsData} />

          
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ProjectOverview />
            <TeamPerformance />
          </div>

          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <RecentActivities />
            <UpcomingDeadlines />
            <ResourceAllocation />
          </div>
        </main>
      </div>
    </>
  );
}
