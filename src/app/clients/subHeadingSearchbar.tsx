"use client";

import React from "react";
import { Search } from "lucide-react";

type Props = {
  search: string;
  setSearch: React.Dispatch<
    React.SetStateAction<string>
  >;
};

const SubHeader = ({
  search,
  setSearch,
}: Props) => {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            All Clients
          </h2>
          <p className="text-xs text-white/40 mt-1 font-medium uppercase tracking-wider">
            Overview & Management
          </p>
        </div>

        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-[#5271ff]" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-full border border-white/[0.08] bg-[#0a0826]/40 pl-11 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none backdrop-blur-md transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
          />
        </div>
      </div>
    </>
  );
};

export default SubHeader;

