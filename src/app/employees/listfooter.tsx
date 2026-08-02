"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta } from "./schemas/apiResponse";

interface EmployeeListFooterProps {
  showing: number;
  total: number;
  paginationMeta?: PaginationMeta | null;
  onPageChange?: (newPage: number) => void;
}

export default function EmployeeListFooter({
  showing,
  total,
  paginationMeta,
  onPageChange,
}: EmployeeListFooterProps) {
  const currentPage = paginationMeta?.currentPage || 1;
  const totalPages = paginationMeta?.totalPages || 1;

  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between border-t border-white/[0.06] pt-4 gap-3">
      <p className="text-xs text-white/40">
        Showing <span className="font-semibold text-white">{showing}</span> of{" "}
        <span className="font-semibold text-white">{total}</span> entries
      </p>

      {paginationMeta && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)}
            className="inline-flex h-8 items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-xs font-semibold text-white transition hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </button>
          <span className="px-2 text-xs font-medium text-white/60">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
            className="inline-flex h-8 items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-xs font-semibold text-white transition hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
