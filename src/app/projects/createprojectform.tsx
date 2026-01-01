"use client";
import React, { useState } from "react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold text-gray-800">
            Project Details
          </h2>
        </div>

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
    </div>
  );
}
