"use client";
import React from "react";

export default function UpcomingDeadlines() {
  return (
    <>
      <div className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold mb-4">Upcoming Deadlines</h2>

        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium">E-commerce Platform</p>
            <p className="text-xs text-gray-400">Due Dec 15, 2023</p>
          </div>

          <div>
            <p className="font-medium">Mobile App Development</p>
            <p className="text-xs text-gray-400">Due Dec 20, 2023</p>
          </div>

          <div>
            <p className="font-medium">Website Redesign</p>
            <p className="text-xs text-gray-400">Due Dec 25, 2023</p>
          </div>
        </div>
      </div>
    </>
  );
}
