"use client";

import React from "react";

const TableHeader = () => {
  return (
    <>
      <div className="grid grid-cols-5 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        <div>Client Name</div>
        <div>Email</div>
        <div>Company</div>
        <div>Status</div>
        <div>Actions</div>
      </div>
    </>
  );
};

export default TableHeader;