"use client";
import React from "react";

const TimeFilter = () => {
  const options = ["Day", "Week", "Month", "Quarter"];

  return (
    <>
      <div className="bg-white border rounded p-2 flex gap-2 mb-4">
        {options.map((opt, index) => (
          <button
            key={index}
            className={`px-3 py-1 text-sm rounded ${
              opt === "Day" ? "bg-gray-100 font-medium" : "text-gray-500"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </>
  );
};

export default TimeFilter;