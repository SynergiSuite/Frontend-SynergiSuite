"use client";
import React from "react";

const ProductLaunch = () => {
  return (
    <>
      <div className="bg-white border rounded-lg p-5 mb-6">
        <div className="flex justify-between mb-2">
          <p className="text-sm text-gray-500">December 15, 2023</p>
          <span className="text-xs px-3 py-1 rounded bg-gray-100">
            In Progress
          </span>
        </div>

        <h2 className="text-lg font-semibold">Product Launch</h2>
        <p className="text-gray-500 text-sm mt-1">
          Final preparations for the winter release
        </p>

        <p className="text-xs text-gray-400 mt-3">3 team members</p>
      </div>
    </>
  );
};

export default ProductLaunch;