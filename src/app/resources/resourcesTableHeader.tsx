"use client";

import React from "react";

const TableHeader = () => {
  return (
    <>
      <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.6fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] border-b border-white/[0.08] bg-[#0c0a2f]/60 px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/40 md:grid">
        <div className="min-w-0 truncate">Resource Name</div>
        <div className="min-w-0 truncate">Type</div>
        <div className="min-w-0 truncate">Status</div>
        <div className="min-w-0 truncate">Qty</div>
        <div className="min-w-0 truncate">Estimated Cost</div>
        <div className="min-w-0 truncate">Actions</div>
      </div>
    </>
  );
};

export default TableHeader;
