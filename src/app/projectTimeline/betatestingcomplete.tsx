"use client";
import React from "react";

const BetaTestingComplete = () => {
  return (
    <>
      <div className="bg-white border rounded-lg p-5 mb-6">
        <div className="flex justify-between mb-2">
          <p className="text-sm text-gray-500">December 10, 2023</p>
          <span className="text-xs px-3 py-1 rounded bg-green-100 text-green-700">
            Completed
          </span>
        </div>

        <h2 className="text-lg font-semibold">Beta Testing Complete</h2>
        <p className="text-gray-500 text-sm mt-1">
          Successfully completed beta testing phase
        </p>

        <p className="text-xs text-gray-400 mt-3">2 documents attached</p>
      </div>
    </>
  );
};

export default BetaTestingComplete;