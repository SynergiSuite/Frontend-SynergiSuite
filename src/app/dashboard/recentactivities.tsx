"use client";
import React from "react";

export default function RecentActivities() {
  return (
    <>
      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold mb-4">Recent Activities</h2>

        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium">Sarah Chen</p>
            <p className="text-gray-600">
              Updated the UI design for Project X
            </p>
            <p className="text-xs text-gray-400">2 hours ago</p>
          </div>

          <div>
            <p className="font-medium">Michael Park</p>
            <p className="text-gray-600">
              Completed sprint planning for Team Alpha
            </p>
            <p className="text-xs text-gray-400">4 hours ago</p>
          </div>

          <div>
            <p className="font-medium">Emily Rodriguez</p>
            <p className="text-gray-600">
              Added new client project requirements
            </p>
            <p className="text-xs text-gray-400">5 hours ago</p>
          </div>
        </div>
      </div>
    </>
  );
}

