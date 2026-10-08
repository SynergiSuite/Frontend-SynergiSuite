"use client";

import React from "react";
import { Search } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";

type SearchBarProps = {
  searchQuery: string;
  onSearch: (query: string) => void;
};

const inputClassName =
  "h-11 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 pl-11 pr-4 text-sm text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-300 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20";

export default function SearchBar({ searchQuery, onSearch }: SearchBarProps) {
  return (
    <Field>
      <FieldLabel htmlFor="employee-search" className="sr-only">
        Search employees
      </FieldLabel>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-v2-neutral-400"
          aria-hidden="true"
        />
        <input
          id="employee-search"
          name="search"
          type="text"
          data-slot="input"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(event) => onSearch(event.target.value)}
          className={inputClassName}
        />
      </div>
    </Field>
  );
}
