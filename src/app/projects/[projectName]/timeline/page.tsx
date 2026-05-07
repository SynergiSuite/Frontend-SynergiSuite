"use client";
import React from "react";

import RightSidebar from "./rightsidebar";
import TimelineSection from "./timelinesection";

const Page = () => {
  return (
    <>
      <div className="min-h-screen">
        <div className="w-full px-4 pb-8 sm:px-6 lg:px-8">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold">Project Timeline</h1>
            <p className="text-sm text-gray-500">
              Track your project progress and milestones
            </p>
          </div>
          {/* Main Content Area */}
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-8">
            <div className="">
              <TimelineSection showHeader={false} />
            </div>

            {/* Right Sidebar */}
            <RightSidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
