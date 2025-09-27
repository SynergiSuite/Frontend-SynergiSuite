"use client";
import React, { useState } from "react";
import CreateTeamHeader from "./createteamheader";
import CreateTeamMembers from "./createteamMembers";
import AssignProjects from "./assignproject";
import CreateTeamFooter from "./createteamfooter";
import CreateTeamModal from "./createteamModal";

type Team = {
  name: string;
  description: string;
  members: string[];
  projects: string[];
};

type CreateTeamFormProps = {
  onCancel: () => void;
  onCreate: (team: Team) => void;
};

export default function CreateTeamForm({ onCancel, onCreate }: CreateTeamFormProps) {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const team: Team = { name: teamName, description, members, projects };
    onCreate(team);
  };

  return (
    <>
      <CreateTeamModal
      onClose={onCancel}
      footer={
        <CreateTeamFooter
          onCancel={onCancel}
          onCreate={() => onCreate({ name: teamName, description, members, projects })}
        />
      }
     >
      <form onSubmit={handleSubmit} className="space-y-6">
        <CreateTeamHeader
          teamName={teamName}
          setTeamName={setTeamName}
          description={description}
          setDescription={setDescription}
        />
        <CreateTeamMembers members={members} setMembers={setMembers} />
        <AssignProjects projects={projects} setProjects={setProjects} />
      </form>
     </CreateTeamModal>
   </>
  );
}

