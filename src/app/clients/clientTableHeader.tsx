"use client";

import React from "react";

const TableHeader = () => {
  return (
    <>
      <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-gray-500 md:grid">
        <div className="min-w-0 truncate">Client Name</div>
        <div className="min-w-0 truncate">Email</div>
        <div className="min-w-0 truncate">Company</div>
        <div className="min-w-0 truncate">Priority</div>
        <div className="min-w-0 truncate">Actions</div>
      </div>
    </>
  );
};

export default TableHeader;
