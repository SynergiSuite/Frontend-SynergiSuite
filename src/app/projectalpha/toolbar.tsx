"use client";
import React from "react";

const Toolbar = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button>☰</button>
          <button>☷</button>
          <button>Filter</button>
        </div>

        <button className="bg-black text-white px-4 py-2 rounded">
          + Add Task
        </button>
      </div>
    </>
  );
};

export default Toolbar;