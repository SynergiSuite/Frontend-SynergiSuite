"use client";
import React from "react";
import SearchBar from "./searchbar";
import NewProjectButton from "./newprojectbttn";
import { Team } from "./schemas/team";
import { Client } from "./schemas/client";

interface HeaderProps {
  filter: string;
  setFilter: (value: string) => void;
  setSearchQuery: (value: string) => void;
  teams: Team[];
  clients: Client[];
  onProjectCreated: () => void;
}

export default function Header({
  filter,
  setFilter,
  setSearchQuery,
  teams,
  clients,
  onProjectCreated,
}: HeaderProps) {
  const tabs = ["All", "In Queue", "In Progress", "Completed", "On Hold", "At Risk"];

  return (
    <>
      {/* Top section: title + search + button */}
      <div className="project-animate-item opacity-0 mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Projects Overview
        </h1>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <SearchBar setSearchQuery={setSearchQuery} />
          <NewProjectButton
            teams={teams}
            clients={clients}
            onProjectCreated={onProjectCreated}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="project-animate-item opacity-0 -mx-1 mb-8 flex gap-3 overflow-x-auto px-1 pb-2">
        {tabs.map((tab) => {
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap border transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] text-white border-transparent shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                  : "border-white/[0.08] bg-[#0a0826]/40 backdrop-blur-md text-white/60 hover:text-white hover:bg-[#0a0826]/75 hover:border-white/[0.15]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </> 
  );
}
