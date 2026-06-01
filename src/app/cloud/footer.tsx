"use client";

import React from "react";

type Props = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: Props) => {
  return (
    <>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex flex-wrap gap-2">
          {Array.from(
            { length: totalPages },
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`h-9 w-9 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  currentPage === index + 1
                    ? "bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] text-white border border-[#5271ff]/30 shadow-[0_0_12px_rgba(82,113,255,0.3)] scale-105"
                    : "border border-white/[0.08] bg-[#0a0826]/40 text-white/60 backdrop-blur-md hover:bg-white/[0.03] hover:border-white/[0.15] hover:text-white"
                }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Pagination;
