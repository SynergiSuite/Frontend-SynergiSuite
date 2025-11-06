"use client";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <>
      <div className="flex items-center border rounded px-2 bg-gray-50 w-full">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search teams..."
          className="outline-none px-2 py-1 text-sm bg-transparent w-full"
        />
      </div>
    </>
  );
}

