"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  Clock,
  Edit3,
  LoaderCircle,
  Plus,
  Save,
  UsersRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { editProjectApi, EditProjectPayload } from "./apis/editProject";
import editTeams from "./[projectName]/apis/editTeams";
import { PriorityLevel } from "./schemas/priority.enum";
import type { Projects } from "./schemas/project";
import type { Team } from "./schemas/team";

type EditProjectModalProps = {
  project: Projects | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teams: Team[];
};

const inputClassName =
  "h-12 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-300 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15";

const STATUS_CONFIG: Record<
  number,
  { label: string; dot: string }
> = {
  [PriorityLevel.InQueue]: {
    label: "In Queue",
    dot: "bg-v2-neutral-400",
  },
  [PriorityLevel.InProgress]: {
    label: "In Progress",
    dot: "bg-sky-500",
  },
  [PriorityLevel.Completed]: {
    label: "Completed",
    dot: "bg-emerald-500",
  },
  [PriorityLevel.OnHold]: {
    label: "On Hold",
    dot: "bg-amber-500",
  },
  [PriorityLevel.AtRisk]: {
    label: "At Risk",
    dot: "bg-rose-500",
  },
};

export default function EditProjectModal({
  project,
  isOpen,
  onClose,
  onSuccess,
  teams = [],
}: EditProjectModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [selectedSquadDropdown, setSelectedSquadDropdown] = useState<string>("");
  const [statusValue, setStatusValue] = useState<string>("0");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeTeams = Array.isArray(teams) ? teams : [];

  useEffect(() => {
    if (project) {
      setProjectName(project.name || "");
      setProjectDescription(project.description || "");
      setStatusValue(project.status !== undefined ? String(project.status) : "0");
      setDuration(project.duration || "");

      const initialTeamIds = Array.isArray(project.teams)
        ? project.teams.map((t) => String(t.id))
        : [];
      setSelectedTeamIds(initialTeamIds);
      setSelectedSquadDropdown("");
      setError(null);
    }
  }, [project]);

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
    if (!project) return;

    const trimmedName = projectName.trim();
    if (!trimmedName) {
      setError("Project title is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: EditProjectPayload = {
        name: trimmedName,
        description: projectDescription.trim() || undefined,
        status: Number(statusValue),
        duration: duration.trim() || "Not specified",
      };

      await editProjectApi(project.id, payload);

      if (selectedTeamIds.length > 0) {
        await editTeams({
          project_id: project.id,
          team_id: selectedTeamIds,
        });
      }

      toast.success("Project updated successfully.");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to update project. Please verify inputs.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project) return null;

  const availableSquads = safeTeams.filter(
    (team) => !selectedTeamIds.includes(String(team.id))
  );

  const selectedTeamsList = safeTeams.filter((team) =>
    selectedTeamIds.includes(String(team.id))
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-[0_24px_80px_rgba(53,53,54,0.22)] sm:max-w-xl max-h-[92vh] overflow-y-auto">
        <DialogHeader data-form-section className="border-v2-neutral-200 pb-4">
          <div className="flex items-start gap-3.5 pr-10">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-v2-neutral-500 text-v2-neutral-100 shadow-sm">
              <Edit3 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <DialogTitle className="text-xl tracking-[-0.03em] text-v2-neutral-600">
                Edit project
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-5 text-v2-neutral-400">
                Modify project deliverables, update execution status, and reallocate squad teams.
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

            <FieldGroup className="gap-5">
              {/* Project Title */}
              <Field
                data-form-section
                data-invalid={Boolean(error && !projectName.trim())}
              >
                <FieldLabel htmlFor="edit-project-title">
                  Project title <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <input
                    id="edit-project-title"
                    name="name"
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                      setError(null);
                    }}
                    placeholder="Project title"
                    className={inputClassName}
                  />
                </div>
                <FieldDescription>
                  Update the official identifier for this project.
                </FieldDescription>
              </Field>

              {/* Description */}
              <Field data-form-section>
                <FieldLabel htmlFor="edit-project-desc">Description</FieldLabel>
                <textarea
                  id="edit-project-desc"
                  name="description"
                  rows={2}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Outline deliverables or scope modifications..."
                  className="w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 p-3 text-sm text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-300 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20"
                />
              </Field>

              {/* Two-Column: Status & Timeline */}
              <div
                data-form-section
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {/* Status Selection */}
                <Field>
                  <FieldLabel htmlFor="edit-project-status">
                    Execution status
                  </FieldLabel>
                  <Select
                    value={statusValue}
                    onValueChange={(val) => setStatusValue(val)}
                  >
                    <SelectTrigger
                      id="edit-project-status"
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

                {/* Duration / Timeline */}
                <Field>
                  <FieldLabel htmlFor="edit-project-duration">
                    Timeline / Duration
                  </FieldLabel>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-v2-neutral-400" />
                    <input
                      id="edit-project-duration"
                      name="duration"
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 3 Months, Q4 2026"
                      className={`${inputClassName} pl-10`}
                    />
                  </div>
                </Field>
              </div>

              {/* Assign Squad Teams */}
              <Field data-form-section>
                <div className="flex items-center justify-between">
                  <FieldLabel>Assigned squads</FieldLabel>
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
                      No squads assigned yet.
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
              onClick={onClose}
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
                  Saving changes...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
