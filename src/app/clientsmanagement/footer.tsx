"use client";

import React from "react";

type Props = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<
    React.SetStateAction<number>
  >;
};

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: Props) => {
  return (
    <>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex gap-2">
          {Array.from(
            { length: totalPages },
            (_, index) => (
              <button
                key={index}
                onClick={() =>
                  setCurrentPage(index + 1)
                }
                className={`h-10 w-10 rounded-xl border ${
                  currentPage === index + 1
                    ? "bg-black text-white"
                    : "bg-white"
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