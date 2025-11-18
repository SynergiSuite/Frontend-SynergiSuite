"use client";
import React from "react";

import TeamMembers from "./teamMembers";
import CalendarWidget from "./calendar";
import QuickActions from "./quickaction";

export default function Sidebar() {
  return (
    <>
      <aside className="w-72 bg-white p-6 shadow-md flex flex-col gap-6">
        <TeamMembers />
        <CalendarWidget />
        <QuickActions />
      </aside>
    </>
  );
}

