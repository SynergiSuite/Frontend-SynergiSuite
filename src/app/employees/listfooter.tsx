"use client";
import React from "react";

interface EmployeeListFooterProps {
  showing: number;
  total: number;
}

export default function EmployeeListFooter({
  showing,
  total,
}: EmployeeListFooterProps) {
  return (
    <div className="mt-4 flex items-center justify-end border-t border-gray-200 pt-4 text-sm text-gray-600">
      <p>
        Showing {showing} of {total} entries
      </p>
    </div>
  );
}
