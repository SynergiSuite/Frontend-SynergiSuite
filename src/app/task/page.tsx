"use client";
import React from "react";

import Header from "./header";
import Sidebar from "./rightsidebar";
import StateCards from "./statecards";
import Filters from "./filters";
import TaskGrid from "./taskgrid";

export default function Dashboard() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        
        <Header />

        
        <div className="flex flex-1">
          
          <main className="flex-1 p-6">
            
            <StateCards />

            
            <Filters />

            
            <TaskGrid />
          </main>

          
          <Sidebar />
        </div>
      </div>
    </>
  );
}