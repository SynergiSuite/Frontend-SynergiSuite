"use client";
import React from "react";

const FeatureDevelopment = () => {
  return (
    <>
      <div className="bg-white border rounded-lg p-5 mb-6">
        <div className="flex justify-between mb-2">
          <p className="text-sm text-gray-500">November 28, 2023</p>
          <span className="text-xs px-3 py-1 rounded bg-green-100 text-green-700">
            Completed
          </span>
        </div>

        <h2 className="text-lg font-semibold">Feature Development</h2>
        <p className="text-gray-500 text-sm mt-1">
          Core features implementation finished
        </p>

        <div className="mt-4">
          <p className="text-xs mb-1">Progress</p>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div className="bg-black h-2 rounded w-full"></div>
          </div>
          <p className="text-right text-xs mt-1">100%</p>
        </div>
      </div>
    </>
  );
};

export default FeatureDevelopment;