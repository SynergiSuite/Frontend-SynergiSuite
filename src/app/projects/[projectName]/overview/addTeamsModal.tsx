"use client";

import React, { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Team } from "../../schemas/team";
import { Check, Users } from "lucide-react";

type EditTeamsModalProps = {
  onCancel: () => void;
  onSubmit: (teamIds: string[]) => void;
  teams: Team[];
  initialSelectedTeamIds?: string[];
  title?: string;
};

export default function EditTeamsModal({
  onCancel,
  onSubmit,
  teams,
  initialSelectedTeamIds = [],
  title = "Edit Teams",
}: EditTeamsModalProps) {
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>(
    initialSelectedTeamIds
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTeamId = (teamId: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const selectedLabel = useMemo(
    () =>
      `${selectedTeamIds.length} team${
        selectedTeamIds.length === 1 ? "" : "s"
      } selected`,
    [selectedTeamIds.length]
  );

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Overlay */}
      <motion.button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-[#030114]/80 backdrop-blur-md cursor-pointer"
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Modal Container Shell */}
      <motion.div
        className="relative z-10 my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/95 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 280, damping: 25 }}
      >
        {/* Top Accent Neon Stripe */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#5271ff] via-cyan-400 to-[#3a4ec4] z-10" />

        {/* Ambient interior glow */}
        <div className="absolute -left-20 -top-20 h-[250px] w-[250px] bg-[radial-gradient(circle,rgba(82,113,255,0.1),transparent_65%)] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 border-b border-white/[0.08] px-6 py-5 sm:px-8 bg-white/[0.01]">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {title}
          </h2>
          <p className="text-xs text-white/40 mt-1 font-medium">
            Select and associate teams with this project
          </p>
        </div>

        {/* Body */}
        <div className="relative z-10 flex-1 px-6 py-6 sm:px-8 text-white overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
              Select Teams
            </label>
            <div className="rounded-xl border border-white/[0.08] bg-[#030114]/40 p-4">
              <div className="flex flex-wrap gap-2.5">
                {teams.map((team) => {
                  const isSelected = selectedTeamIds.includes(team.id);
                  return (
                    <label
                      key={team.id}
                      className={`group relative flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "border-[#5271ff]/60 bg-[#5271ff]/20 text-white shadow-[0_0_16px_rgba(82,113,255,0.25)]"
                          : "border-white/[0.08] bg-[#0a0826]/40 text-white/60 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.04]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => toggleTeamId(team.id)}
                      />
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                          isSelected
                            ? "border-[#5271ff] bg-[#5271ff] text-white"
                            : "border-white/30 bg-transparent group-hover:border-white/60"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                      </div>
                      <Users className={`h-4 w-4 ${isSelected ? "text-[#5271ff]" : "text-white/40"}`} />
                      <span className="font-medium">{team.name}</span>
                    </label>
                  );
                })}
              </div>
              {teams.length === 0 ? (
                <p className="mt-2 text-xs text-white/30 italic pl-1">
                  No teams available.
                </p>
              ) : (
                <div className="mt-3.5 text-xs text-white/40 font-medium pl-1">
                  {selectedLabel}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-white/[0.08] bg-[#0a0826]/40 px-6 py-5 sm:px-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/[0.08] bg-[#0a0826]/40 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-white/60 hover:text-white hover:bg-[#0a0826]/75 hover:border-white/[0.15] transition-all duration-300 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onSubmit(selectedTeamIds)}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:shadow-[0_0_22px_rgba(82,113,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
