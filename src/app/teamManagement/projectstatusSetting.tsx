"use client";
import React from "react";
import StatusCard from "./statuscard";

const StatusSettings = () => {
  return (
    <>
      <div className="mt-12">
        <h2 className="text-xl font-semibold">Project Status Settings</h2>
        <p className="text-sm text-gray-500 mb-6">
          Configure status workflow and team permissions
        </p>

        <div className="grid grid-cols-2 gap-6">
          <StatusCard
            title="To Do"
            description="Tasks that need to be started"
            teams={["Development Team", "Product Team"]}
          />

          <StatusCard
            title="In Progress"
            description="Tasks currently being worked on"
            teams={["Development Team", "Design Team"]}
          />

          <StatusCard
            title="Under Review"
            description="Tasks pending review"
            teams={["QA Team", "Product Team"]}
          />

          <StatusCard
            title="Completed"
            description="Finished tasks"
            teams={["All Teams"]}
          />
        </div>
      </div>
    </>
  );
};

export default StatusSettings;