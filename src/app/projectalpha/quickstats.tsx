"use client";
import React from "react";

const QuickStats = ({ stats }: any) => {
  return (
    <>
      <div className="bg-white p-4 rounded shadow mt-4">
        <h3 className="font-semibold mb-2">Quick Stats</h3>
        <p>Total Tasks: {stats.total}</p>
        <p>Completed: {stats.completed}</p>
        <p>In Progress: {stats.inProgress}</p>
        <p>Blocked: {stats.blocked}</p>
      </div>
    </>
  );
};

export default QuickStats;