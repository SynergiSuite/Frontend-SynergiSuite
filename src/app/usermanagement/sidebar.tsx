"use client";
import { LayoutDashboard, Users, BarChart3, FileText, Settings, LifeBuoy } from "lucide-react";

export default function Sidebar() {
  const handleClick = (label: string) => {
    console.log(`${label} clicked`);
  };

  return (
    <>
      <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
        <nav className="space-y-3">
          <button onClick={() => handleClick("Dashboard")} className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700">
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </button>

          <button onClick={() => handleClick("User Management")} className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700">
            <Users size={18} /> <span>User Management</span>
          </button>

          <button onClick={() => handleClick("Analytics")} className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700">
            <BarChart3 size={18} /> <span>Analytics</span>
          </button>

          <button onClick={() => handleClick("Reports")} className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700">
            <FileText size={18} /> <span>Reports</span>
          </button>

          <button onClick={() => handleClick("Settings")} className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700">
            <Settings size={18} /> <span>Settings</span>
          </button>

          <button onClick={() => handleClick("Support")} className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700">
            <LifeBuoy size={18} /> <span>Support</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
