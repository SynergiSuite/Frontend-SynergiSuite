"use client";
import React, { useState } from "react";

const menuItems = [
  "Dashboard",
  "Projects",
  "Teams",
  "Clients",
  "HR Management",
  "Reports",
  "Settings",
];

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");

  return (
    <>
      <aside className="w-64 bg-white border-r min-h-screen px-4 py-6">
        <nav className="space-y-2 text-sm">
          {menuItems.map((item) => (
            <div
              key={item}
              onClick={() => setActive(item)}
              className={`px-4 py-2 rounded-lg cursor-pointer ${
                active === item
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
