"use client";
import React from "react";

interface EmployeeListFooterProps {
  showing: number;
  total: number;
}

export default function EmployeeListFooter({ showing, total }: EmployeeListFooterProps) {
  return (
    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
      <p className="text-xs text-white/30">
        Showing{" "}
        <span className="font-semibold text-white/60">{showing}</span>
        {" "}of{" "}
        <span className="font-semibold text-white/60">{total}</span>
        {" "}entries
      </p>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#5271ff] to-[#3a4ec4]"
          style={{ width: total > 0 ? `${(showing / total) * 100}%` : "0%" }}
        />
      </div>
    </div>
  );
}
