"use client";

import React, { useState, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  Clock,
  FolderPlus,
  Info,
  LoaderCircle,
  Plus,
  UsersRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateNewProject,
  type CreateProjectPayload,
} from "./apis/createNewProject";
import { PriorityLevel } from "./schemas/priority.enum";
import type { Team } from "./schemas/team";
import type { Client } from "./schemas/client";

type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  teams: Team[];
  clients: Client[];
};

const inputClassName =
  "h-12 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-300 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15";

const STATUS_CONFIG: Record<
  number,
  { label: string; dot: string; badge: string }
> = {
  [PriorityLevel.InQueue]: {
    label: "In Queue",
    dot: "bg-v2-neutral-400",
    badge: "bg-v2-neutral-200 text-v2-neutral-600",
  },
  [PriorityLevel.InProgress]: {
    label: "In Progress",
    dot: "bg-sky-500",
    badge: "bg-sky-100 text-sky-700",
  },
  [PriorityLevel.Completed]: {
    label: "Completed",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
  [PriorityLevel.OnHold]: {
    label: "On Hold",
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700",
  },
  [PriorityLevel.AtRisk]: {
    label: "At Risk",
    dot: "bg-rose-500",
    badge: "bg-rose-100 text-rose-700",
  },
};

export default function CreateProjectModal({
  isOpen,
  onClose,
  onCreated,
  teams = [],
  clients = [],
}: CreateProjectModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [selectedSquadDropdown, setSelectedSquadDropdown] = useState<string>("");
  const [statusValue, setStatusValue] = useState<string>("0");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeTeams = Array.isArray(teams) ? teams : [];
  const safeClients = Array.isArray(clients) ? clients : [];

  useLayoutEffect(() => {
    if (
      !isOpen ||
      !contentRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.from("[data-form-section]", {
        autoAlpha: 0,
        y: 10,
        duration: 0.35,
        stagger: 0.05,
        ease: "power3.out",
      });
    }, contentRef.current);

    return () => context.revert();
  }, [isOpen]);

  const resetForm = () => {
    setProjectName("");
    setProjectDescription("");
    setSelectedClientId("");
    setSelectedTeamIds([]);
    setSelectedSquadDropdown("");
    setStatusValue("0");
    setDuration("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddSquadFromDropdown = () => {
    if (!selectedSquadDropdown) return;
    if (!selectedTeamIds.includes(selectedSquadDropdown)) {
      setSelectedTeamIds((prev) => [...prev, selectedSquadDropdown]);
      setError(null);
    }
    setSelectedSquadDropdown("");
  };

  const handleRemoveSquad = (teamId: string) => {
    setSelectedTeamIds((prev) => prev.filter((id) => id !== teamId));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedName = projectName.trim();
    if (!trimmedName) {
      setError("Project title is required.");
      return;
    }

    if (!selectedClientId) {
      setError("Please select a client account for this project.");
      return;
    }

    if (selectedTeamIds.length === 0) {
      setError("Please assign at least one squad to this project.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateProjectPayload = {
        name: trimmedName,
        description: projectDescription.trim() || undefined,
        client: selectedClientId,
        teams: selectedTeamIds,
        status: Number(statusValue),
        duration: duration.trim() || "Not specified",
      };

      await CreateNewProject(payload);
      toast.success("Project created successfully.");
      resetForm();
      onCreated();
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to create project. Please verify inputs.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSquads = safeTeams.filter(
    (team) => !selectedTeamIds.includes(String(team.id))
  );

  const selectedTeamsList = safeTeams.filter((team) =>
    selectedTeamIds.includes(String(team.id))
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-[0_24px_80px_rgba(53,53,54,0.22)] sm:max-w-xl max-h-[92vh] overflow-y-auto">
        <DialogHeader data-form-section className="border-v2-neutral-200 pb-4">
          <div className="flex items-start gap-3.5 pr-10">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-v2-neutral-500 text-v2-neutral-100 shadow-sm">
              <FolderPlus className="size-5" aria-hidden="true" />
            </span>
            <div>
              <DialogTitle className="text-xl tracking-[-0.03em] text-v2-neutral-600">
                Create new project
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-5 text-v2-neutral-400">
                Configure project scope, associate client accounts, deploy squads, and set timelines.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div ref={contentRef} className="px-6 py-5 sm:px-8 space-y-5">
            {error && (
              <FieldError className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
                {error}
              </FieldError>
            )}

            <Card data-form-section variant="subtle" size="sm">
              <CardContent className="flex items-start gap-2.5 text-xs leading-relaxed text-v2-neutral-400">
                <Info className="size-4 shrink-0 text-v2-neutral-500 mt-0.5" />
                <span>
                  Projects link client deliverables with squad velocity, enabling real-time timeline tracking and task progress.
                </span>
              </CardContent>
            </Card>

            <FieldGroup className="gap-5">
              {/* Project Title */}
              <Field
                data-form-section
                data-invalid={Boolean(error && !projectName.trim())}
              >
                <FieldLabel htmlFor="project-title">
                  Project title <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <input
                    id="project-title"
                    name="name"
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                      setError(null);
                    }}
                    placeholder="e.g. NextGen Core Platform, Mobile App v2"
                    className={inputClassName}
                  />
                </div>
                <FieldDescription>
                  A clear, descriptive name for this project workspace.
                </FieldDescription>
              </Field>

              {/* Description */}
              <Field data-form-section>
                <FieldLabel htmlFor="project-desc">
                  Description (Optional)
                </FieldLabel>
                <textarea
                  id="project-desc"
                  name="description"
                  rows={2}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Outline key deliverables, scope, or sprint targets..."
                  className="w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 p-3 text-sm text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-300 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20"
                />
              </Field>

              {/* Two-Column: Client Account & Execution Status */}
              <div
                data-form-section
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {/* Client Account */}
                <Field data-invalid={Boolean(error && !selectedClientId)}>
                  <FieldLabel htmlFor="project-client">
                    Client account <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    value={selectedClientId}
                    onValueChange={(val) => {
                      setSelectedClientId(val);
                      setError(null);
                    }}
                  >
                    <SelectTrigger
                      id="project-client"
                      className="h-12 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20 text-v2-neutral-600"
                    >
                      <SelectValue placeholder="Select client account..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-56 rounded-xl border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                      {safeClients.map((client) => (
                        <SelectItem
                          key={client.id}
                          value={String(client.id)}
                          className="rounded-lg focus:bg-v2-neutral-200/70 focus:text-v2-neutral-600 cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-xs">
                              {client.name}
                            </span>
                            {client.company && (
                              <span className="text-[11px] text-v2-neutral-400">
                                {client.company}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                      {safeClients.length === 0 && (
                        <div className="py-2.5 px-3 text-xs text-v2-neutral-400 text-center">
                          No clients available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </Field>

                {/* Status Selection */}
                <Field>
                  <FieldLabel htmlFor="project-status">
                    Initial status
                  </FieldLabel>
                  <Select
                    value={statusValue}
                    onValueChange={(val) => setStatusValue(val)}
                  >
                    <SelectTrigger
                      id="project-status"
                      className="h-12 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20 text-v2-neutral-600"
                    >
                      <SelectValue placeholder="Select status..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                      {Object.entries(STATUS_CONFIG).map(([val, conf]) => (
                        <SelectItem
                          key={val}
                          value={val}
                          className="rounded-lg focus:bg-v2-neutral-200/70 focus:text-v2-neutral-600 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`size-2 rounded-full ${conf.dot}`}
                            />
                            <span className="text-xs font-medium">
                              {conf.label}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {/* Target Duration / Timeline */}
              <Field data-form-section>
                <FieldLabel htmlFor="project-duration">
                  Target timeline / Duration
                </FieldLabel>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-v2-neutral-400" />
                  <input
                    id="project-duration"
                    name="duration"
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 Months, Q4 2026 Launch, 6 Sprints"
                    className={`${inputClassName} pl-10`}
                  />
                </div>
                <FieldDescription>
                  Estimated duration or milestone deadline for deliverable tracking.
                </FieldDescription>
              </Field>

              {/* Assign Squad Teams */}
              <Field
                data-form-section
                data-invalid={Boolean(error && selectedTeamIds.length === 0)}
              >
                <div className="flex items-center justify-between">
                  <FieldLabel>
                    Assigned squads <span className="text-destructive">*</span>
                  </FieldLabel>
                  <span className="text-xs font-semibold text-v2-neutral-500">
                    {selectedTeamIds.length} assigned
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 min-w-0">
                    <Select
                      value={selectedSquadDropdown}
                      onValueChange={(val) => {
                        setSelectedSquadDropdown(val);
                        setError(null);
                      }}
                    >
                      <SelectTrigger className="h-12 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20 text-v2-neutral-600">
                        <SelectValue placeholder="Select a squad to deploy..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-56 rounded-xl border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                        {availableSquads.map((team) => (
                          <SelectItem
                            key={team.id}
                            value={String(team.id)}
                            className="rounded-lg focus:bg-v2-neutral-200/70 focus:text-v2-neutral-600 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <UsersRound className="size-3.5 text-v2-neutral-400" />
                              <span className="font-medium text-xs">
                                {team.name}
                              </span>
                              {team.leader && (
                                <span className="text-[11px] text-v2-neutral-400">
                                  (Lead: {team.leader.name})
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                        {availableSquads.length === 0 && (
                          <div className="py-2.5 px-3 text-xs text-v2-neutral-400 text-center">
                            All squads assigned
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSquadFromDropdown}
                    disabled={!selectedSquadDropdown}
                    className="h-12 px-4 shrink-0 font-medium border-v2-neutral-300 text-v2-neutral-600 hover:bg-v2-neutral-200"
                  >
                    <Plus className="size-4 mr-1" />
                    Add
                  </Button>
                </div>

                {/* Assigned Squad Chips */}
                <div className="mt-2 min-h-16 rounded-xl border border-dashed border-v2-neutral-300 bg-v2-neutral-200/40 p-3">
                  {selectedTeamsList.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedTeamsList.map((team) => (
                        <div
                          key={team.id}
                          className="inline-flex items-center gap-2 rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 py-1.5 pl-3 pr-2 text-xs font-medium text-v2-neutral-600 shadow-xs"
                        >
                          <UsersRound className="size-3.5 text-v2-neutral-500" />
                          <span className="font-semibold">{team.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSquad(String(team.id))}
                            className="inline-flex size-4 items-center justify-center rounded-md hover:bg-v2-neutral-200 text-v2-neutral-400 hover:text-v2-neutral-600 transition-colors"
                            title="Remove squad"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-xs text-v2-neutral-400 py-3">
                      No squads assigned yet. Select a squad above and click Add.
                    </p>
                  )}
                </div>
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter className="px-6 py-4 sm:px-8 flex items-center justify-end gap-3 border-t border-v2-neutral-200 bg-v2-neutral-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-v2-neutral-300 text-v2-neutral-600 hover:bg-v2-neutral-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-v2-neutral-600 text-v2-neutral-100 hover:bg-v2-neutral-500 shadow-md font-semibold"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Creating project...
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Create Project
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
