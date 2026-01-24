"use client";
import React from "react";

const UpcomingDeadlines = ({ deadlines }: any) => {
  return (
    <>
      <div className="bg-white p-4 rounded shadow mt-4">
        <h3 className="font-semibold mb-2">Upcoming Deadlines</h3>
        {deadlines.map((item: any, index: number) => (
          <p key={index} className="text-sm mb-2">
            {item.title} — {item.date}
          </p>
        ))}
      </div>
    </>
  );
};

export default UpcomingDeadlines;