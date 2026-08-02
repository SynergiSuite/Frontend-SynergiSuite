"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Check, Users, X } from "lucide-react";
import ModalFooter from "./createprojectformfooter";
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
  const [mounted, setMounted] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [statusValue, setStatusValue] = useState<string>(""); 
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const safeTeams = Array.isArray(teams) ? teams : [];
  const safeClients = Array.isArray(clients) ? clients : [];

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

  const modalContent = (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Background Overlay */}
      <motion.button
        type="button"
        aria-label="Close modal"
        className="fixed inset-0 bg-[#030114]/80 backdrop-blur-md cursor-pointer border-0"
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      />

      {/* Modal Container Shell */}
      <motion.div
        className="relative z-10 flex flex-col w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-[#0a0826]/95 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)]"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 280, damping: 25 }}
      >
        {/* Top Accent Neon Stripe */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#5271ff] via-cyan-400 to-[#3a4ec4] z-10" />

        {/* Ambient background glow inside modal */}
        <div className="absolute -left-20 -top-20 h-[300px] w-[300px] bg-[radial-gradient(circle,rgba(82,113,255,0.12),transparent_65%)] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 border-b border-white/[0.08] px-6 py-5 sm:px-8 bg-white/[0.01] flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Create New Project
            </h2>
            <p className="text-xs text-white/40 mt-1 font-medium">Enter project parameters and assign team structure</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/60 transition hover:bg-white/[0.08] hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body (Scrollable Content) */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6 text-white custom-scrollbar">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">
              Project Name
            </label>
            <input
              type="text"
              placeholder="Enter project name"
              className="w-full bg-[#030114]/40 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 transition-all duration-300"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">
              Select Client
            </label>
            <Select
              value={selectedClientId}
              onValueChange={setSelectedClientId}
            >
              <SelectTrigger className="w-full border border-white/[0.08] bg-[#030114]/40 text-white rounded-xl h-11 focus:ring-1 focus:ring-[#5271ff]/30 focus:border-[#5271ff]/50 cursor-pointer flex items-center justify-between px-4 transition-all duration-300">
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent className="border border-white/[0.08] bg-[#0a0826] text-white rounded-xl shadow-2xl backdrop-blur-2xl z-[110]">
                {safeClients.map((client) => (
                  <SelectItem
                    key={client.id}
                    value={client.id}
                    className="cursor-pointer focus:bg-[#5271ff]/20 focus:text-white rounded-lg py-2 px-3 transition-colors text-white/80"
                  >
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Team Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-white/70">
                Select Teams
              </label>
              {selectedTeamIds.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#5271ff]/15 border border-[#5271ff]/30 px-2.5 py-0.5 text-xs font-semibold text-[#8fa2ff]">
                  {selectedTeamIds.length} {selectedTeamIds.length === 1 ? "team" : "teams"} selected
                </span>
              )}
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#030114]/30 p-4 max-h-[190px] overflow-y-auto custom-scrollbar backdrop-blur-md">
              <div className="flex flex-wrap gap-2.5">
                {safeTeams.map((team) => {
                  const isSelected = selectedTeamIds.includes(team.id);
                  return (
                    <div
                      key={team.id}
                      onClick={() => toggleTeamId(team.id)}
                      className={`group relative flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 select-none ${
                        isSelected
                          ? "border-[#5271ff]/60 bg-gradient-to-r from-[#5271ff]/20 to-[#3a4ec4]/15 text-white shadow-[0_0_16px_rgba(82,113,255,0.22)]"
                          : "border-white/[0.08] bg-white/[0.03] text-white/60 hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
                          isSelected
                            ? "border-[#5271ff] bg-[#5271ff] text-white shadow-[0_0_10px_rgba(82,113,255,0.5)]"
                            : "border-white/20 bg-white/[0.04] group-hover:border-white/40"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>

                      <Users
                        className={`h-3.5 w-3.5 transition-colors ${
                          isSelected ? "text-[#5271ff]" : "text-white/35 group-hover:text-white/60"
                        }`}
                      />

                      <span className="truncate">{team.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grid for Status and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">
                Project Status
              </label>
              <Select
                value={statusValue}
                onValueChange={setStatusValue}
              >
                <SelectTrigger className="w-full border border-white/[0.08] bg-[#030114]/40 text-white rounded-xl h-11 focus:ring-1 focus:ring-[#5271ff]/30 focus:border-[#5271ff]/50 cursor-pointer flex items-center justify-between px-4 transition-all duration-300">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="border border-white/[0.08] bg-[#0a0826] text-white rounded-xl shadow-2xl backdrop-blur-2xl z-[110]">
                  {priorityOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={String(option.value)}
                      className="cursor-pointer focus:bg-[#5271ff]/20 focus:text-white rounded-lg py-2 px-3 transition-colors text-white/80"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">
                End Date
              </label>
              <input
                type="date"
                className="w-full bg-[#030114]/40 border border-white/[0.08] rounded-xl px-4 py-2.5 h-11 text-white focus:outline-none focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 transition-all duration-300 scheme-dark cursor-pointer font-medium"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">
              Project Description
            </label>
            <textarea
              rows={3}
              placeholder="Enter project description..."
              className="w-full bg-[#030114]/40 border border-white/[0.08] rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 transition-all duration-300 resize-none"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-white/[0.08] bg-[#0a0826]/40 px-6 py-5 sm:px-8">
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

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
