"use client";
import React from "react";
import { Search, Bell } from "lucide-react";

export default function Header() {
  return (
    <>
      <header className="w-full px-6 py-4 bg-white border-b flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">ProjectFlow</h1>

        <div className="flex items-center gap-4">
          <Search className="w-5 h-5 text-gray-500 cursor-pointer" />
          <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-gray-300" />
        </div>
      </header>
    </>
  );
}
