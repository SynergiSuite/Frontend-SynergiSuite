"use client";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Team } from "../../schemas/team";
import EditTeamsModal from "./addTeamsModal";

type TeamMembersProps = {
  selectedTeams: Team[];
  allTeams: Team[];
  canManageTeams?: boolean;
  onSaveTeams?: (teamIds: string[]) => void;
};

const TeamMembers = ({
  selectedTeams,
  allTeams,
  canManageTeams = false,
  onSaveTeams,
}: TeamMembersProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const selectedTeamIds = selectedTeams.map((team) => team.id)

  return (
    <>
      <div className="bg-[#0a0826]/40 border border-white/[0.08] backdrop-blur-md rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all duration-300 hover:border-[#5271ff]/30">
        {/* Left Glowing Accent */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#5271ff] to-[#3a4ec4]" />

        <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3.5">
          Assigned Teams
        </h3>

        <div className="space-y-2.5">
          {selectedTeams.length === 0 ? (
            <p className="text-xs text-white/30 italic pl-1">
              No teams assigned to this project.
            </p>
          ) : (
            selectedTeams.map((team: Team, index: number) => (
              <div key={index} className="flex items-center gap-2.5 text-sm text-white/80 pl-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5271ff] shadow-[0_0_6px_#5271ff]" />
                <span className="font-medium text-white/90">{team.name}</span>
              </div>
            ))
          )}
        </div>

        {canManageTeams ? (
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="mt-4.5 text-xs font-bold text-[#5271ff] hover:text-cyan-400 pl-1 cursor-pointer transition-colors duration-300 flex items-center gap-1"
          >
            <span>+</span> Edit Team Assignments
          </button>
        ) : null}
      </div>


      <AnimatePresence>
        {isEditOpen && canManageTeams ? (
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
