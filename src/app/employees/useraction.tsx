"use client";
import React, { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { CookieManager } from "@/lib/cookieManager";

// Dynamically import the dialog to avoid SSR issues with modals
const AddEmployee = dynamic(() => import("./addEmployee"), {
  ssr: false,
});

export default function UserActions({ onEmployeeAdded }: { onEmployeeAdded?: () => void }) {
  const [role, setRole] = useState("");
  const allowedRoles = ["founder", "manager", "admin"];

  useEffect(() => {
    const role = CookieManager("get", "primary_role") || CookieManager("get", "role");
    setRole(String(role || "").toLowerCase());
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddUser = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center">
      {/* Add User button — role-gated */}
      {allowedRoles.includes(role) ? (
        <>
          <Button
            type="button"
            size="lg"
            onClick={handleAddUser}
            className="w-full bg-v2-neutral-100 text-sm text-v2-neutral-600 hover:bg-v2-neutral-200 sm:w-auto"
          >
            <UserPlus size={15} />
            Add Employee
          </Button>
          <AddEmployee
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            onEmployeeAdded={onEmployeeAdded}
          />
        </>
      ) : null}
    </div>
  );
}
