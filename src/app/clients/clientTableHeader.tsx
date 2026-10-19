"use client";

import React from "react";

export default function TableHeader() {
  return (
    <thead className="border-b border-v2-neutral-200 bg-v2-neutral-200/50 text-[11px] font-semibold uppercase tracking-wider text-v2-neutral-400">
      <tr>
        <th scope="col" className="px-5 py-3.5">
          Client
        </th>
        <th scope="col" className="px-5 py-3.5">
          Company
        </th>
        <th scope="col" className="px-5 py-3.5">
          Contact
        </th>
        <th scope="col" className="px-5 py-3.5">
          Priority
        </th>
        <th scope="col" className="px-5 py-3.5">
          Billing
        </th>
        <th scope="col" className="px-5 py-3.5 text-right">
          Actions
        </th>
      </tr>
    </thead>
  );
}
