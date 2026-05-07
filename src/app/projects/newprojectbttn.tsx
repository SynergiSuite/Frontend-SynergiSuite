"use client";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import NewProjectModal from "./createProjectForm";
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
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
      >
        + New Project
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
