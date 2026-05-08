"use client";
import React, { useState, useEffect } from "react";
import { Download, Filter } from "lucide-react";
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
    <div className="flex justify-end items-center space-x-3">
      {/* Add User and Dialog */}
      {allowedRoles.includes(role) ? (
        <>
          <Button
            variant="add"
            className="button_primary_lg py-6"
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
        className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
      >
        <Download size={16} /> Export
      </button>
    </div>
  );
}
