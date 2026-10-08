"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta } from "./schemas/apiResponse";
import { Button } from "@/components/ui/button";

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
    <div className="mt-auto flex flex-col items-center justify-between gap-3 border-t border-v2-neutral-200 pt-5 sm:flex-row">
      <p className="text-xs text-v2-neutral-400">
        Showing <span className="font-semibold text-v2-neutral-600">{showing}</span> of{" "}
        <span className="font-semibold text-v2-neutral-600">{total}</span> employees
      </p>

      {paginationMeta && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Button>
          <span className="px-1 text-xs font-medium text-v2-neutral-400" aria-live="polite">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
