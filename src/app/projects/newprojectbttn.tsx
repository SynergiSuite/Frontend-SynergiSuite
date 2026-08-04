"use client";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import NewProjectModal from "./createNewProjectForm";
import { Team } from "./schemas/team";
import { Client } from "./schemas/client";
import { CreateNewProject } from "./apis/createNewProject";
import { toast } from "sonner";

import { CookieManager } from "@/lib/cookieManager";

export default function NewProjectButton({
  teams,
  clients,
  onProjectCreated,
}: {
  teams: Team[];
  clients: Client[];
  onProjectCreated: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>(() =>
    typeof window !== "undefined"
      ? String(
          CookieManager("get", "primary_role") || CookieManager("get", "role") || ""
        ).toLowerCase()
      : ""
  );

  React.useEffect(() => {
    const rawRole = String(
      CookieManager("get", "primary_role") || CookieManager("get", "role") || ""
    ).toLowerCase();
    setUserRole(rawRole);
  }, []);

  const primaryRoleStr = String(CookieManager("get", "primary_role") || "").toLowerCase().trim();
  const displayRoleStr = String(CookieManager("get", "role") || "").toLowerCase().trim();
  const effectiveRole = primaryRoleStr || displayRoleStr || userRole;

  const isAllowedToCreate =
    !effectiveRole.includes("client") &&
    effectiveRole !== "employee" &&
    effectiveRole !== "junior employee" &&
    effectiveRole !== "junior_employee" &&
    (effectiveRole.includes("founder") ||
      effectiveRole.includes("manager") ||
      effectiveRole.includes("admin") ||
      effectiveRole.includes("senior"));

  const structureData = (
    clientId: string,
    teamIds: string[],
    projectName: string,
    projectStatus: number,
    duration: string,
    projectDescription?: string,
  ) => {
    const obj = {
      name: projectName,
      description: projectDescription,
      status: projectStatus,
      teams: teamIds,
      client: clientId,
      duration: duration,
    };
    return obj;
  };

  const handleCreateProject = async (data: {
    clientId: string;
    teamIds: string[];
    name: string;
    status: number;
    duration: string;
    description?: string;
  }) => {
    if (!isAllowedToCreate) {
      toast.error("Only Founders, Managers, and Senior Employees are allowed to create projects.");
      return;
    }

    const payload = structureData(
      data.clientId,
      data.teamIds,
      data.name,
      data.status,
      data.duration,
      data.description,
    );

    try {
      setIsOpen(false);
      await CreateNewProject(payload);
      toast.success("Project created successfully");
      onProjectCreated();
    } catch (error) {
      toast.error("Failed to create project" + error);
    }
  };

  if (!isAllowedToCreate) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-4 py-2.5 text-white shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:shadow-[0_0_22px_rgba(82,113,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 sm:w-auto font-semibold"
      >
        <Plus size={16} strokeWidth={2.25} aria-hidden="true" />
        <span>New Project</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <NewProjectModal
            onCancel={() => setIsOpen(false)}
            onSubmit={handleCreateProject}
            teams={teams}
            clients={clients}
          />
        )}
      </AnimatePresence>
    </>
  );
}
