"use client";
import React from "react";

const ActivityFeed = ({ activities }: any) => {
  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Activity Feed</h3>
        {activities.map((item: any, index: number) => (
          <p key={index} className="text-sm mb-2">{item}</p>
        ))}
      </div>
    </>
  );
};

export default ActivityFeed;