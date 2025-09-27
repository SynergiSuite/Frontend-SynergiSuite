"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type NavItem = {
  name: string;
  param: string;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Define nav items per route
  const routeNavs: Record<string, NavItem[]> = {
    "/dashboard": [],
    "/employees": [
      { name: "Employees", param: "employees" },
      { name: "Teams", param: "teams" },
      { name: "Projects", param: "" },
      { name: "Reports", param: "" },
    ],
    "/settings": [
      { name: "Profile", param: "profile" },
      { name: "Security", param: "security" },
      { name: "Billing", param: "billing" },
    ],
  };

  // pick navs based on current route (fallback: empty)
  const links = routeNavs[pathname] || [];

  // which tab is active (via ?tab=)
  const activeTab = searchParams.get("tab") || links[0]?.param;

  const handleClick = (param: string) => {
    router.push(`${pathname}?tab=${param}`);
  };

  return (
    <header className="w-full border-b border-gray-300">
      <div className="flex justify-between items-center py-3 px-6">
        {/* Brand */}
        <div className="flex items-center space-x-10">
          <h2
            className="font-bold text-lg cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            SynergiSuite
          </h2>

          {/* Show route-specific navs */}
          {links.length > 0 && (
            <nav className="flex space-x-6 text-sm">
              {links.map((item) => (
                <button
                  key={item.param}
                  onClick={() => handleClick(item.param)}
                  className={`${
                    activeTab === item.param
                      ? "text-black font-semibold underline"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Profile avatar */}
        <div
          className="w-8 h-8 bg-gray-300 rounded-full cursor-pointer"
          onClick={() => handleClick("profile")}
        ></div>
      </div>
    </header>
  );
}
