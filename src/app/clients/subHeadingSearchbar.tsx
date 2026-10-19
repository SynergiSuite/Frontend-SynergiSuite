"use client";

import React from "react";
import { Search } from "lucide-react";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  totalCount?: number;
};

export default function SubHeader({
  search,
  setSearch,
  totalCount,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-v2-neutral-600">
            All Clients
          </h2>
          {totalCount !== undefined && (
            <span className="inline-flex items-center rounded-full bg-v2-neutral-200 px-2.5 py-0.5 text-xs font-semibold text-v2-neutral-600">
              {totalCount}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-v2-neutral-400">
          Manage client accounts, contract billing types, and partner priorities.
        </p>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-v2-neutral-400" />
        <input
          type="text"
          placeholder="Search by name, company, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 pl-9 pr-3 text-xs text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20"
        />
      </div>
    </div>
  );
}
