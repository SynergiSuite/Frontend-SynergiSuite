"use client";
import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { getCookie } from "cookies-next";
import { Button } from "@/global/buttons";
import dynamic from "next/dynamic";

// Dynamically import the dialog to avoid SSR issues with modals
const AddEmployee = dynamic(() => import("./addEmployee"), {
  ssr: false,
});

export default function UserActions() {
  const [role, setRole] = useState("");
  const allowedRoles = ["Founder", "Manager"];

  useEffect(() => {
    const role = getCookie("role");
    setRole(role as string);
  }, []);

  // 👉 JavaScript functions
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddUser = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleExport = () => {};

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:space-x-3 sm:gap-0">
      {/* Add User and Dialog */}
      {allowedRoles.includes(role) ? (
        <>
          <Button
            variant="add"
            className="button_primary_lg w-full py-6 sm:w-auto"
            onClick={handleAddUser}
          >
            Add User
          </Button>
          <AddEmployee isOpen={isDialogOpen} onClose={handleCloseDialog} />
        </>
      ) : null}

      {/* Export */}
      <button
        onClick={handleExport}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100 sm:w-auto"
      >
        <Download size={16} /> Export
      </button>
    </div>
  );
}
