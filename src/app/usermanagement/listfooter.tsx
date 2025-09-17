"use client";
import React from "react";

interface EmployeeListFooterProps {
  showing: number;
  total: number;
}

export default function EmployeeListFooter({ showing, total }: EmployeeListFooterProps) {
  return (
    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
      <p>Showing {showing} of {total} entries</p>
      <div className="flex space-x-2">
        <button className="px-3 py-1 border rounded-md hover:bg-gray-100">Prev</button>
        <button className="px-3 py-1 border rounded-md hover:bg-gray-100">Next</button>
      </div>
    </div>
  );
}

