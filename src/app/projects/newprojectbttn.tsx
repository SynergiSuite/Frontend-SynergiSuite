"use client";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import NewProjectModal from "./createNewProjectForm";
import { Team } from "./schemas/team";
import { Client } from "./schemas/client";
import { CreateNewProject } from "./apis/createNewProject";
import { toast } from "sonner";

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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-white hover:bg-gray-800 sm:w-auto"
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
