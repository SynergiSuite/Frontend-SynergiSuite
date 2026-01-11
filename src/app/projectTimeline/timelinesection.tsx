"use client";
import React from "react";

import ProductLaunch from "./productlaunch";
import BetaTestingComplete from "./betatestingcomplete";
import FeatureDevelopment from "./featuredevelopment";
import ProjectInitiation from "./projectinitiation";

const TimelineSection = () => {
  return (
    <>
      <div className="max-w-3xl">

        {/* Timeline Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Project Timeline</h1>
          <p className="text-gray-500 text-sm">
            Track your project progress and milestones
          </p>
        </div>

        {/* Timeline Cards */}
        <ProductLaunch />
        <BetaTestingComplete />
        <FeatureDevelopment />
        <ProjectInitiation />

      </div>
    </>
  );
};

export default TimelineSection;