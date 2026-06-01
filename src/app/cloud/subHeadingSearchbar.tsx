"use client";

import React from "react";
import { Search, Upload } from "lucide-react";

type Props = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  onUploadClick: () => void;
};

const SubHeader = ({ search, setSearch, onUploadClick }: Props) => {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Cloud Storage
          </h2>
          <p className="text-xs text-white/40 mt-1 font-medium uppercase tracking-wider">
            Review and Manage workspace assets
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full sm:w-auto">
          {/* Search Input pill */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 transition-colors" />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-white/[0.08] bg-[#0a0826]/40 pl-11 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none backdrop-blur-md transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
            />
          </div>

          {/* Upload Button horizontally in-line */}
          <button
            onClick={onUploadClick}
            className="landing-btn-primary group !py-2.5 !px-5 text-sm w-full sm:w-auto justify-center flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(82,113,255,0.2)] whitespace-nowrap"
          >
            <Upload className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
            Upload File
          </button>
        </div>
      </div>
    </>
  );
};

export default SubHeader;
