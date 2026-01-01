"use client";
import React, { useState } from "react";
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
    teamId: string,
    projectName: string,
    projectStatus: number,
    projectDescription?: string
  ) => {
    const obj = {
      name: projectName,
      description: projectDescription,
      status: projectStatus,
      teams: [teamId],
      client: clientId,
    };
    return obj;
  };

  const handleCreateProject = async (data: {
    clientId: string;
    teamId: string;
    name: string;
    status: number;
    description?: string;
  }) => {
    const payload = structureData(
      data.clientId,
      data.teamId,
      data.name,
      data.status,
      data.description
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

      {isOpen && (
        <NewProjectModal
          onCancel={() => setIsOpen(false)}
          onSubmit={handleCreateProject}
          teams={teams}
          clients={clients}
        />
      )}
    </>
  );
}
