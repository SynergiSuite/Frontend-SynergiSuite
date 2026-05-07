"use client";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Team } from "../../schemas/team";
import EditTeamsModal from "./addTeamsModal";

type TeamMembersProps = {
  selectedTeams: Team[];
  allTeams: Team[];
  onSaveTeams?: (teamIds: string[]) => void;
};

const TeamMembers = ({ selectedTeams, allTeams, onSaveTeams }: TeamMembersProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const selectedTeamIds = selectedTeams.map((team) => team.id)

  return (
    <>
      <div className="overview-card p-4">
        <h3 className="font-semibold mb-2">Teams</h3>
        {selectedTeams.map((team: Team, index: number) => (
          <p key={index} className="text-sm">{team.name}</p>
        ))}
        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="mt-2 text-blue-500"
        >
          + Edit Teams
        </button>
      </div>

      <AnimatePresence>
        {isEditOpen ? (
          <EditTeamsModal
            teams={allTeams}
            initialSelectedTeamIds={selectedTeamIds}
            onCancel={() => setIsEditOpen(false)}
            onSubmit={(teamIds) => {
              onSaveTeams?.(teamIds);
              setIsEditOpen(false);
            }}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default TeamMembers;
