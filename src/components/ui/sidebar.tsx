"use client";
import { LayoutDashboard, Users, BarChart3, FileText, Settings, LifeBuoy, LogOut } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";

export default function Sidebar() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = (label: string) => {
    router.push(`/${label}`)
  };

  const logout = async () => {
          setIsLoading(true);
          const token = getCookie("access_token");
          try {
              const res = await fetch("http://localhost:3002/auth/logout", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                  },
              });
              const responseData = await res.json();
              if (!res.ok) {
                  throw new Error(responseData.message || "Failed to logout. Try Again later.");
              }
              deleteCookie("access_token");
              deleteCookie("user_email");
              deleteCookie("user");
              deleteCookie("business_name");
              deleteCookie("business_id");
              router.replace("/session");
          } catch (error) {
              console.log(error);
          }
          setIsLoading(false);
      }

  return (
    <>
      <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
        <nav className="space-y-3">
          <button onClick={() => handleClick("dashboard")} className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700">
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </button>

          <button onClick={() => handleClick("employees")} className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700">
            <Users size={18} /> <span>Employees</span>
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

          <button onClick={() => logout()} className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700">
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
