"use client";
import React from "react";

const Header = () => {
  const tabs = ["Overview", "Tasks", "Timeline", "Resources", "Documents", "Settings"];

  return (
    <>
      <div className="w-full border-b bg-white">
        
        {/* Top Row */}
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-xl font-semibold">Projects / Project Alpha</h1>

          <div className="flex gap-4">
            <button className="text-xl">🔗</button>
            <button className="text-xl">⚙</button>
            <button className="text-xl">⋮</button>
          </div>
        </div>

        {/* Tabs Row */}
        <div className="flex gap-6 px-6 pb-3">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`text-sm font-medium ${
                tab === "Overview"
                  ? "text-black border-b-2 border-black pb-2"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

      </div>
    </>
  );
};

export default Header;
