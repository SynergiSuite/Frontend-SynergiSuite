"use client";
import React from "react";

export default function TeamPerformance() {
  return (
    <>
      <div className="flex flex-col items-center rounded-lg border bg-white p-4">
        <h2 className="font-semibold mb-4 self-start">Team Performance</h2>

        
        <div className="h-32 w-32 rounded-full border-[14px] border-orange-400 border-b-gray-800 border-l-teal-400 sm:h-40 sm:w-40 sm:border-[16px]" />

        <div className="mt-4 flex flex-wrap justify-center gap-3 text-center text-xs text-gray-600">
          <span className="text-orange-400">■ Development</span>
          <span className="text-teal-400">■ Design</span>
          <span className="text-gray-800">■ Marketing</span>
        </div>
      </div>
    </>
  );
}
