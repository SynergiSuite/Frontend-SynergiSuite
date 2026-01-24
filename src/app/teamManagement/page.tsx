"use client";
import React from "react";

import Header from "./header";
import TeamManagementHeader from "./header,tools";
import TeamTable from "./teamtable";
import StatusSettings from "./projectstatusSetting";
import FooterActions from "./footer";

const Page = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50">

        {/* Top Tabs */}
        <Header />

        <div className="max-w-6xl mx-auto px-6">

          {/* Team Management Section */}
          <TeamManagementHeader />

          {/* Team Table */}
          <TeamTable />

          {/* Status Settings */}
          <StatusSettings />

          {/* Footer Buttons */}
          <FooterActions />

        </div>

      </div>
    </>
  );
};

export default Page;