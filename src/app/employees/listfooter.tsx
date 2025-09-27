"use client";
import React from "react";

interface EmployeeListFooterProps {
  showing: number;
  total: number;
}

export default function EmployeeListFooter({ showing, total }: EmployeeListFooterProps) {
  return (
    <div className="flex flex-col justify-between items-end mt-20 text-sm text-gray-600">
      <p>Showing {showing} of {total} entries</p>
    </div>
  );
}

