"use client";
import React, { useState, useEffect } from "react";
import { Download, UserPlus } from "lucide-react";
import { getCookie } from "cookies-next";
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddUser = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleExport = () => {};

  return (
    <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center">
      {/* Export button */}
      <button
        onClick={handleExport}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/60 backdrop-blur-md transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white sm:w-auto"
      >
        <Download size={15} />
        Export
      </button>

      {/* Add User button — role-gated */}
      {allowedRoles.includes(role) ? (
        <>
          <button
            onClick={handleAddUser}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#5271ff]/40 bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(82,113,255,0.25)] transition-all duration-200 hover:from-[#5f7fff] hover:to-[#4a5fd4] hover:shadow-[0_0_24px_rgba(82,113,255,0.35)] sm:w-auto"
          >
            <UserPlus size={15} />
            Add Employee
          </button>
          <AddEmployee isOpen={isDialogOpen} onClose={handleCloseDialog} />
        </>
      ) : null}
    </div>
  );
}
