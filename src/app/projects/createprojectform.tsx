"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import ModalFooter from "./createProjectFormFooter";
import { Team } from "./schemas/team";
import { Client } from "./schemas/client";
import { PriorityLevel } from "./schemas/priority.enum";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  modalBodyClass,
  modalHeaderClass,
  modalOverlayClass,
  modalShellClass,
  modalTitleClass,
} from "@/lib/modalStyles";

interface NewProjectModalProps {
  onCancel: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    clientId: string;
    teamIds: string[];
    status: number;
    duration: string;
  }) => void;
  teams: Team[];
  clients: Client[];
}

export default function NewProjectModal({
  onCancel,
  onSubmit,
  teams,
  clients,
}: NewProjectModalProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [statusValue, setStatusValue] = useState<string>(""); // FIX
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [duration, setDuration] = useState("");

  const priorityOptions = Object.entries(PriorityLevel)
    .filter((entry): entry is [string, number] => typeof entry[1] === "number")
    .map(([label, value]) => ({
      label: label.replace(/([a-z])([A-Z])/g, "$1 $2"),
      value,
    }));

  const isFormValid =
    projectName.trim().length > 0 &&
    selectedClientId !== "" &&
    selectedTeamIds.length > 0 &&
    statusValue !== "" &&
    duration !== "";

  const toggleTeamId = (teamId: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId],
    );
  };

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
          <h2 className={modalTitleClass}>
            Project Details
          </h2>
        </div>

        <div className={modalBodyClass}>
          {/* Project Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              placeholder="Enter project name"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          {/* Client */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Client
            </label>
            <Select
              value={selectedClientId}
              onValueChange={setSelectedClientId}
            >
              <SelectTrigger className="w-full border_primary bg-white cursor-pointer">
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem
                    key={client.id}
                    value={client.id}
                    className="cursor-pointer"
                  >
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Team */}
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
              {selectedTeamIds.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  {selectedTeamIds.length} team
                  {selectedTeamIds.length === 1 ? "" : "s"} selected
                </div>
              )}
            </div>
          </div>

          {/* Status + Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Status
            </label>
            <Select
              value={statusValue}
              onValueChange={setStatusValue}
            >
              <SelectTrigger className="w-full border_primary bg-white cursor-pointer">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={String(option.value)}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Description
              </label>
              <textarea
                rows={4}
                placeholder="Enter project description"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-gray-400"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200/80 px-6 py-4 sm:px-8">
          <ModalFooter
            onCancel={onCancel}
            isSubmitDisabled={!isFormValid}
            onSubmit={() => {
              onSubmit({
                name: projectName.trim(),
                description: projectDescription.trim() || undefined,
                clientId: selectedClientId,
                teamIds: selectedTeamIds,
                status: Number(statusValue),
                duration: duration,
              });
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
