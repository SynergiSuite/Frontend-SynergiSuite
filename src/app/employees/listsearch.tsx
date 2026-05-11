"use client";
import React, { useState } from "react";
import Image from "next/image";
import searchIcon from "@/assets/searchIcon.png";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // 👈 triggers filtering as you type
  };

  const handleSearch = () => {
    onSearch(query); // still works for button click
  };

  return (
    <div className="flex w-full items-center rounded-md border px-2 py-1">
      <input
        type="text"
        placeholder="Search employees..."
        value={query}
        onChange={handleChange}
        className="flex-1 outline-none px-2"
      />
      <button
        onClick={handleSearch}
        className="px-2 text-gray-500 hover:text-black"
      >
        <Image src={searchIcon} alt="search-icon" />
      </button>
    </div>
  );
}
