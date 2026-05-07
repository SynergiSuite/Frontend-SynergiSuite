"use client";

import React from "react";

type Props = {
  search: string;
  setSearch: React.Dispatch<
    React.SetStateAction<string>
  >;
};

const SubHeader = ({
  search,
  setSearch,
}: Props) => {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          All Clients
        </h2>

        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="rounded-xl border px-4 py-3 outline-none"
        />
      </div>
    </>
  );
};

export default SubHeader;