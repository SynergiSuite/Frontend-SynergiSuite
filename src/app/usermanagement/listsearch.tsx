"use client";
import React, { useState } from "react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <>
      <div className="flex items-center border rounded-md px-2 py-1 w-64">
        <input
          type="text"
          placeholder="Search employees..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 outline-none px-2"
        />
        <button
          onClick={handleSearch}
          className="px-2 text-gray-500 hover:text-black"
        >
          🔍
        </button>
      </div>
    </>
  );
}

