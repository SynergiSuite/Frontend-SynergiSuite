"use client";
import React, { useState } from "react";
import Header from "./header";
import ProjectCards from "./statecards";

export default function Page() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <main className="min-h-screen bg-gray-50 p-8">
        <Header filter={filter} setFilter={setFilter} setSearchQuery={setSearchQuery} />
        <ProjectCards filter={filter} searchQuery={searchQuery} />
      </main>
    </>
  );
}

