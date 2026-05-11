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
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
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
      <div className="-mx-1 mb-8 flex gap-3 overflow-x-auto px-1 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-medium whitespace-nowrap ${
              filter === tab
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </> 
  );
}
