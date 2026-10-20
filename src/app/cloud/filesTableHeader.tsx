"use client";

import React from "react";

export default function FilesTableHeader() {
  return (
    <thead>
      <tr className="border-b border-v2-neutral-300 bg-v2-neutral-200/50 text-[11px] font-semibold uppercase tracking-wider text-v2-neutral-400">
        <th className="py-3.5 pl-4 pr-3 sm:pl-6 text-left">File Name</th>
        <th className="px-3 py-3.5 text-left">Category</th>
        <th className="px-3 py-3.5 text-left hidden md:table-cell">Scope / Target</th>
        <th className="px-3 py-3.5 text-left hidden sm:table-cell">File Size</th>
        <th className="px-3 py-3.5 text-left hidden lg:table-cell">Upload Date</th>
        <th className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
      </tr>
    </thead>
  );
}
