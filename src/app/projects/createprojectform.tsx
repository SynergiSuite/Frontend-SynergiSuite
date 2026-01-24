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

interface NewProjectModalProps {
  onCancel: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    clientId: string;
    teamId: string;
    status: number;
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
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [statusValue, setStatusValue] = useState<string>(""); // FIX
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const priorityOptions = Object.entries(PriorityLevel)
    .filter((entry): entry is [string, number] => typeof entry[1] === "number")
    .map(([label, value]) => ({
      label: label.replace(/([a-z])([A-Z])/g, "$1 $2"),
      value,
    }));

  const isFormValid =
    projectName.trim().length > 0 &&
    selectedClientId !== "" &&
    selectedTeamId !== "" &&
    statusValue !== "";

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
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] relative flex flex-col"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div className="px-6 pt-6 pb-2 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Project Details
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
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
            <Select
              value={selectedTeamId}
              onValueChange={setSelectedTeamId}
            >
              <SelectTrigger className="w-full border_primary bg-white cursor-pointer">
                <SelectValue placeholder="Select Teams" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem
                    key={team.id}
                    value={team.id}
                    className="cursor-pointer"
                  >
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        <div className="px-6 py-3 border-t">
          <ModalFooter
            onCancel={onCancel}
            isSubmitDisabled={!isFormValid}
            onSubmit={() => {
              onSubmit({
                name: projectName.trim(),
                description: projectDescription.trim() || undefined,
                clientId: selectedClientId,
                teamId: selectedTeamId,
                status: Number(statusValue),
              });
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
