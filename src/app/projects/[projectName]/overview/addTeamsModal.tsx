"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Team } from "../../schemas/team";
import {
  modalBodyClass,
  modalFooterClass,
  modalHeaderClass,
  modalOverlayClass,
  modalShellClass,
  modalTitleClass,
} from "@/lib/modalStyles";

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
    initialSelectedTeamIds,
  );

  const toggleTeamId = (teamId: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId],
    );
  };

  const selectedLabel = useMemo(
    () =>
      `${selectedTeamIds.length} team${
        selectedTeamIds.length === 1 ? "" : "s"
      } selected`,
    [selectedTeamIds.length],
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        type="button"
        aria-label="Close modal"
        className={modalOverlayClass}
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className={`${modalShellClass} max-w-2xl`}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div className={modalHeaderClass}>
          <h2 className={modalTitleClass}>{title}</h2>
        </div>

        <div className={modalBodyClass}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Teams
            </label>
            <div className="rounded-md border border-gray-300 bg-white p-2">
              <div className="flex flex-wrap gap-2">
                {teams.map((team) => {
                  const isSelected = selectedTeamIds.includes(team.id);
                  return (
                    <label
                      key={team.id}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer transition ${
                        isSelected
                          ? "border-gray-900 bg-gray-100 text-gray-900"
                          : "border-gray-300 bg-white text-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-black"
                        checked={isSelected}
                        onChange={() => toggleTeamId(team.id)}
                      />
                      {team.name}
                    </label>
                  );
                })}
              </div>
              {teams.length === 0 ? (
                <p className="mt-2 text-xs text-gray-500">
                  No teams available.
                </p>
              ) : (
                <div className="mt-2 text-xs text-gray-500">
                  {selectedLabel}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`${modalFooterClass} flex justify-end space-x-3`}>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onSubmit(selectedTeamIds)}
            className="px-4 py-2 rounded-md text-white transition bg-black hover:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
