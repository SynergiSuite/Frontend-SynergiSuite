"use client";
import React from "react";

import Header from "./header";
import RightSidebar from "./rightsidebar";
import TimelineSection from "./timelinesection";

const Page = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50">

        {/* Top Navigation */}
        <Header />

        {/* Main Content Area */}
        <div className="flex justify-between px-8 py-6">

          {/* Timeline Section (now includes header inside) */}
          <div className="flex-1 pr-8">
            <TimelineSection />
          </div>

          {/* Right Sidebar */}
          <RightSidebar />

        </div>

      </div>
    </>
  );
};

export default Page;