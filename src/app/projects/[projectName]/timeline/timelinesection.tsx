"use client";
import React from "react";

import ProductLaunch from "./productlaunch";
import BetaTestingComplete from "./betatestingcomplete";
import FeatureDevelopment from "./featuredevelopment";
import ProjectInitiation from "./projectinitiation";

const TimelineSection = ({ showHeader = true }: { showHeader?: boolean }) => {
  return (
    <>
      <div className="w-full">

        {/* Timeline Header */}
        {showHeader && (
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Project Timeline</h1>
            <p className="text-gray-500 text-sm">
              Track your project progress and milestones
            </p>
          </div>
        )}

        {/* Timeline Cards */}
        <div className="space-y-4">
          <ProductLaunch />
          <BetaTestingComplete />
          <FeatureDevelopment />
          <ProjectInitiation />
        </div>

      </div>
    </>
  );
};

export default TimelineSection;
