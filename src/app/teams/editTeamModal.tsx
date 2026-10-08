"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  Crown,
  Info,
  LoaderCircle,
  Pencil,
  Plus,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import type { Employee, Teams } from "./schemas/types";

type EditTeamModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (team: Teams) => Promise<void>;
  team: Teams | null;
  employees: Employee[];
};

const inputClassName =
  "h-12 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-300 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function EditTeamModal({
  isOpen,
  onClose,
  onUpdate,
  team,
  employees,
}: EditTeamModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<Teams>({
    id: "",
    name: "",
    description: "",
    members: [],
    leader_id: 0,
  });
  const [members, setMembers] = useState<Employee[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (team && isOpen) {
      setFormData({
        id: team.id,
        name: team.name || "",
        description: team.description || "",
        members: team.members || [],
        leader_id: team.leader_id || team.leader?.user_id || 0,
      });

      // Extract existing members into normalized Employee array
      const rawList = team.members || team.teamMembers || [];
      const normalized = rawList
        .map((item: any) => {
          if (typeof item === "number") {
            return employees.find((e) => Number(e.user_id) === item);
          }
          const user = item.user || item;
          const uId = Number(user.user_id || user.id || item.user_id || item.id);
          const matched = employees.find((e) => Number(e.user_id) === uId);
          return (
            matched || {
              user_id: uId,
              name: user.name || "Unnamed member",
              email: user.email || "",
            }
          );
        })
        .filter(Boolean) as Employee[];

      setMembers(normalized);
    }
  }, [team, isOpen, employees]);

  useLayoutEffect(() => {
    if (
      !isOpen ||
      !contentRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.from("[data-edit-section]", {
        autoAlpha: 0,
        y: 10,
        duration: 0.35,
        stagger: 0.055,
        ease: "power3.out",
      });
    }, contentRef.current);

    return () => context.revert();
  }, [isOpen]);

  const handleAddMember = () => {
    if (!selectedMemberId) return;
    const empId = Number(selectedMemberId);
    const selectedEmployee = employees.find((e) => Number(e.user_id) === empId);

    if (selectedEmployee) {
      if (!members.some((m) => Number(m.user_id) === empId)) {
        const nextMembers = [...members, selectedEmployee];
        setMembers(nextMembers);
        if (!formData.leader_id || formData.leader_id === 0) {
          setFormData((prev) => ({ ...prev, leader_id: empId }));
        }
      }
      setSelectedMemberId("");
      setError(null);
    }
  };

  const handleRemoveMember = (idToRemove: number) => {
    const nextMembers = members.filter((m) => Number(m.user_id) !== idToRemove);
    setMembers(nextMembers);
    if (Number(formData.leader_id) === idToRemove) {
      setFormData((prev) => ({
        ...prev,
        leader_id: nextMembers.length > 0 ? Number(nextMembers[0].user_id) : 0,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setError("Team name is required.");
      return;
    }

    if (!/^[A-Za-z0-9\s-_]+$/.test(trimmedName)) {
      setError("Team name must contain letters, numbers, hyphens, and spaces only.");
      return;
    }

    if (members.length === 0) {
      setError("Please ensure at least one member is in the team.");
      return;
    }

    if (!formData.leader_id || formData.leader_id === 0) {
      setError("Please select a team leader.");
      return;
    }

    setIsSubmitting(true);
    try {
      const updated: Teams = {
        ...formData,
        name: trimmedName,
        description: (formData.description || "").trim(),
        leader_id: Number(formData.leader_id),
        members: members.map((m) => Number(m.user_id)) as any,
      };

      await onUpdate(updated);
      onClose();
    } catch (err: any) {
      const message = err?.message || "Failed to update team.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableEmployees = employees.filter(
    (emp) => !members.some((m) => Number(m.user_id) === Number(emp.user_id))
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-[0_24px_80px_rgba(53,53,54,0.22)] sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader data-edit-section className="border-v2-neutral-200 pb-5">
          <div className="flex items-start gap-3.5 pr-12">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-v2-neutral-500 text-v2-neutral-100 shadow-sm">
              <Pencil className="size-5" aria-hidden="true" />
            </span>
            <div>
              <DialogTitle className="text-xl tracking-[-0.03em] text-v2-neutral-600">
                Edit team
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-5 text-v2-neutral-400">
                Update squad details, adjust member roster, or reassign leadership.
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
              {/* Team Name */}
              <Field data-edit-section data-invalid={Boolean(error && !formData.name.trim())}>
                <FieldLabel htmlFor="edit-team-name">Team name</FieldLabel>
                <div className="relative">
                  <input
                    id="edit-team-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, name: e.target.value }));
                      setError(null);
                    }}
                    placeholder="Team name"
                    className={inputClassName}
                  />
                </div>
              </Field>

              {/* Description */}
              <Field data-edit-section>
                <FieldLabel htmlFor="edit-team-desc">Description (Optional)</FieldLabel>
                <textarea
                  id="edit-team-desc"
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Outline key objectives or core squad scope..."
                  className="w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 p-3 text-sm text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-300 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20"
                />
              </Field>

              {/* Add Squad Members */}
              <Field data-edit-section>
                <div className="flex items-center justify-between">
                  <FieldLabel>Manage squad members</FieldLabel>
                  <span className="text-xs font-semibold text-v2-neutral-500">
                    {members.length} members
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <Select
                      value={selectedMemberId}
                      onValueChange={(val) => {
                        setSelectedMemberId(val);
                        setError(null);
                      }}
                    >
                      <SelectTrigger className="h-12 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20 text-v2-neutral-600">
                        <SelectValue placeholder="Add new member to squad..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-56 rounded-xl border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                        {availableEmployees.map((emp) => (
                          <SelectItem
                            key={emp.user_id}
                            value={String(emp.user_id)}
                            className="rounded-lg focus:bg-v2-neutral-200/70 focus:text-v2-neutral-600"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{emp.name}</span>
                              <span className="text-xs text-v2-neutral-400">
                                ({emp.email || "No email"})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                        {availableEmployees.length === 0 && (
                          <div className="py-2.5 px-3 text-xs text-v2-neutral-400 text-center">
                            All employees in this squad
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddMember}
                    disabled={!selectedMemberId}
                    className="h-12 px-4 shrink-0 font-medium"
                  >
                    <Plus className="size-4" />
                    Add
                  </Button>
                </div>

                {/* Members Chips */}
                <div className="mt-2 min-h-16 rounded-xl border border-dashed border-v2-neutral-300 bg-v2-neutral-200/40 p-3">
                  {members.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {members.map((m) => {
                        const isLeader = Number(formData.leader_id) === Number(m.user_id);
                        return (
                          <div
                            key={m.user_id}
                            className="inline-flex items-center gap-2 rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 py-1.5 pl-2 pr-1.5 text-xs font-medium text-v2-neutral-600 shadow-xs"
                          >
                            <Avatar className="size-5 rounded-md">
                              <AvatarFallback className="rounded-md bg-v2-neutral-200 text-[10px] font-bold text-v2-neutral-600">
                                {getInitials(m.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="max-w-32 truncate">{m.name}</span>
                            {isLeader && (
                              <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-100 border border-amber-200 px-1.5 py-0.2 text-[10px] font-bold text-amber-800">
                                <Crown className="size-2.5" /> Lead
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(Number(m.user_id))}
                              className="inline-flex size-4 items-center justify-center rounded-md hover:bg-v2-neutral-200 text-v2-neutral-400 hover:text-v2-neutral-600 transition-colors"
                              title="Remove member"
                            >
                              <X className="size-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-xs text-v2-neutral-400 py-3">
                      No members in this team.
                    </p>
                  )}
                </div>
              </Field>

              {/* Select Team Leader */}
              <Field data-edit-section data-invalid={Boolean(error && !formData.leader_id)}>
                <FieldLabel htmlFor="edit-team-leader">
                  <span className="flex items-center gap-1.5">
                    <Crown className="size-4 text-amber-500" />
                    Team leader
                  </span>
                </FieldLabel>
                <Select
                  value={formData.leader_id ? String(formData.leader_id) : ""}
                  onValueChange={(val) => {
                    setFormData((prev) => ({ ...prev, leader_id: Number(val) }));
                    setError(null);
                  }}
                  disabled={members.length === 0}
                >
                  <SelectTrigger
                    id="edit-team-leader"
                    className="h-12 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20 text-v2-neutral-600"
                  >
                    <SelectValue placeholder="Choose a leader from squad members..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-56 rounded-xl border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                    {members.map((m) => (
                      <SelectItem
                        key={m.user_id}
                        value={String(m.user_id)}
                        className="rounded-lg focus:bg-v2-neutral-200/70 focus:text-v2-neutral-600"
                      >
                        <div className="flex items-center gap-2">
                          <Crown className="size-3.5 text-amber-500" />
                          <span className="font-semibold">{m.name}</span>
                          <span className="text-xs text-v2-neutral-400">
                            ({m.email || "Member"})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter data-edit-section className="border-v2-neutral-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                  Saving changes...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
