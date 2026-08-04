"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FooterProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function ReportsFooter({
  currentPage,
  totalPages,
  setCurrentPage,
}: FooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-xs text-white/50 bg-[#090724]/40 backdrop-blur-md rounded-b-2xl">
      <div>
        Page <span className="font-bold text-white">{currentPage}</span> of{" "}
        <span className="font-bold text-white">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
