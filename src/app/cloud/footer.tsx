"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalItems?: number;
  itemsPerPage?: number;
};

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
  totalItems,
  itemsPerPage = 8,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = totalItems
    ? Math.min(currentPage * itemsPerPage, totalItems)
    : undefined;

  return (
    <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-v2-neutral-400">
        {totalItems ? (
          <>
            Showing{" "}
            <span className="font-semibold text-v2-neutral-600">
              {startItem}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-v2-neutral-600">
              {endItem}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-v2-neutral-600">
              {totalItems}
            </span>{" "}
            files
          </>
        ) : (
          <>
            Page{" "}
            <span className="font-semibold text-v2-neutral-600">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-v2-neutral-600">
              {totalPages}
            </span>
          </>
        )}
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="h-8 gap-1 px-2.5 text-xs"
        >
          <ChevronLeft className="size-3.5" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNum = index + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`flex size-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "bg-v2-neutral-600 text-v2-neutral-100 shadow-sm"
                    : "border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-600 hover:bg-v2-neutral-200"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="h-8 gap-1 px-2.5 text-xs"
        >
          <span>Next</span>
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
