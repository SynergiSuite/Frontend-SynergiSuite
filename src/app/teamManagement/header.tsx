"use client";
import React from "react";

const Header = () => {
  const tabs = ["Overview", "Tasks", "Timeline", "Resources", "Documents", "Settings"];

  return (
    <>
      <div className="bg-white border-b px-6 py-3">
        <div className="flex gap-6">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded text-sm ${
                tab === "Overview" ? "bg-gray-100 font-medium" : "text-gray-500"
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