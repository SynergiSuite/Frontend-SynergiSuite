"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Team } from "./schemas/team";
import { Client } from "./schemas/client";
import { Projects } from "./schemas/project";
import { PriorityLevel } from "./schemas/priority.enum";
import { editProjectApi, EditProjectPayload } from "./apis/editProject";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditProjectModalProps {
  project: Projects | null;
  teams: Team[];
  clients: Client[];
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EditProjectModal({
  project,
  teams,
  clients,
  onCancel,
  onSuccess,
}: EditProjectModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [statusValue, setStatusValue] = useState<string>("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    setMounted(true);
    if (project) {
      setProjectName(project.name || "");
      setProjectDescription(project.description || "");
      setSelectedClientId(project.client?.id ? String(project.client.id) : "");
      setSelectedTeamIds(
        Array.isArray(project.teams)
          ? project.teams.map((t: any) => String(t.id || t.team_id || t.teamId))
          : []
      );
      setStatusValue(project.status !== undefined ? String(project.status) : "0");
      setDuration(project.duration || "");
    }
    return () => setMounted(false);
  }, [project]);

  if (!project) return null;

  const priorityOptions = Object.entries(PriorityLevel)
    .filter((entry): entry is [string, number] => typeof entry[1] === "number")
    .map(([label, value]) => ({
      label: label.replace(/([a-z])([A-Z])/g, "$1 $2"),
      value,
    }));

  const isFormValid = projectName.trim().length > 0;

  const toggleTeamId = (teamId: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const payload: EditProjectPayload = {
        name: projectName.trim(),
        description: projectDescription.trim() || undefined,
        status: Number(statusValue),
        duration: duration.trim(),
      };

      await editProjectApi(project.id, payload);
      toast.success("Project updated successfully.");
      onSuccess();
      onCancel();
    } catch (error) {
      console.error("Failed to edit project:", error);
      const message = error instanceof Error ? error.message : "Failed to edit project";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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
        disabled={isSubmitting}
        className="fixed inset-0 bg-[#030114]/80 backdrop-blur-md cursor-pointer border-0 disabled:cursor-not-allowed"
        onClick={() => !isSubmitting && onCancel()}
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
              Edit Project Details
            </h2>
            <p className="text-xs text-white/40 mt-1 font-medium">Update parameters and team assignments for {project.name}</p>
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/60 transition hover:bg-white/[0.08] hover:text-white cursor-pointer disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body (Scrollable Content) */}
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
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
                  {clients.map((client) => (
                    <SelectItem
                      key={client.id}
                      value={String(client.id)}
                      className="cursor-pointer focus:bg-[#5271ff]/20 focus:text-white rounded-lg py-2 px-3 transition-colors text-white/80"
                    >
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Team Checkboxes */}
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">
                Select Teams
              </label>
              <div className="rounded-xl border border-white/[0.08] bg-[#030114]/20 p-4 max-h-[180px] overflow-y-auto custom-scrollbar">
                <div className="flex flex-wrap gap-2.5">
                  {teams.map((team) => {
                    const isSelected = selectedTeamIds.includes(String(team.id));
                    return (
                      <label
                        key={team.id}
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? "border-[#5271ff]/50 bg-[#5271ff]/10 text-white shadow-[0_0_12px_rgba(82,113,255,0.15)] font-semibold"
                            : "border-white/[0.08] bg-[#0a0826]/40 text-white/60 hover:text-white hover:border-white/[0.15]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded-md accent-[#5271ff] border-white/[0.08] bg-[#030114]/50 cursor-pointer"
                          checked={isSelected}
                          onChange={() => toggleTeamId(String(team.id))}
                        />
                        <span className="break-words select-none">{team.name}</span>
                      </label>
                    );
                  })}
                </div>
                {selectedTeamIds.length > 0 && (
                  <div className="mt-3 text-xs text-white/40 font-semibold pl-1">
                    {selectedTeamIds.length} {selectedTeamIds.length === 1 ? "team" : "teams"} selected
                  </div>
                )}
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
          <div className="relative z-10 border-t border-white/[0.08] bg-[#0a0826]/40 px-6 py-5 sm:px-8 flex justify-end gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onCancel}
              className="rounded-xl border border-white/[0.08] bg-[#0a0826]/40 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-white/60 hover:text-white hover:bg-[#0a0826]/75 hover:border-white/[0.15] transition-all duration-300 cursor-pointer disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:shadow-[0_0_22px_rgba(82,113,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
