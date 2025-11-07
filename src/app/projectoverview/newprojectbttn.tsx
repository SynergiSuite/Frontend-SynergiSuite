"use client";
import React, { useState } from "react";
import NewProjectModal from "./createprojectform";

export default function NewProjectButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
      >
        + New Project
      </button>

      {/* Modal form opens when isOpen = true */}
      {isOpen && <NewProjectModal onCancel={() => setIsOpen(false)} />}
    </>
  );
}


