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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Projects Overview
        </h1>

        <div className="flex items-center space-x-3">
          <SearchBar setSearchQuery={setSearchQuery} />
          <NewProjectButton
            teams={teams}
            clients={clients}
            onProjectCreated={onProjectCreated}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
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
