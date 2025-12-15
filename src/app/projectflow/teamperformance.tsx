"use client";
import React from "react";

export default function TeamPerformance() {
  return (
    <>
      <div className="bg-white border rounded-lg p-4 flex flex-col items-center">
        <h2 className="font-semibold mb-4 self-start">Team Performance</h2>

        
        <div className="w-40 h-40 rounded-full border-16 border-orange-400 border-l-teal-400 border-b-gray-800" />

        <div className="flex gap-4 text-xs mt-4 text-gray-600">
          <span className="text-orange-400">■ Development</span>
          <span className="text-teal-400">■ Design</span>
          <span className="text-gray-800">■ Marketing</span>
        </div>
      </div>
    </>
  );
}

