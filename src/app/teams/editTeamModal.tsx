"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Employee, Teams } from "./schemas/types";
import { toast } from "sonner";

type EditTeamModalProps = {
  onClose: () => void;
  onUpdate: (team: Teams) => void;
  team: Teams;
  employees: Employee[];
};

export default function EditTeamModal({
  onClose,
  onUpdate,
  team,
  employees,
}: EditTeamModalProps) {

  // ===== State =====
  const [formData, setFormData] = useState<Teams>({
    id: team.id,
    name: team.name,
    description: team.description,
    members: team.members || [],
    leader_id: team.leader_id || (team.leader?.user_id ?? 0),
  });
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [leaderName, setLeaderName] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  
  const shellRef = useRef<HTMLDivElement>(null);

  // ===== Animations =====
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (shellRef.current) {
      gsap.fromTo(
        shellRef.current,
        { opacity: 0, scale: 0.96, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
    }
  }, []);

  // ===== Effects =====
  // Sync members with team + employees
  useEffect(() => {
    if (employees.length > 0) {
      const normalizedMembers =
        typeof team.members[0] === "object" && "user" in team.members[0]
          ? team.members
          : employees.filter((emp) =>
              (team.members as unknown as number[]).includes(emp.user_id)
            );

      setMembers(normalizedMembers);

      setFormData((prev) => ({
        ...prev,
        members: normalizedMembers,
        leader_id: team.leader_id || team.leader?.user_id || prev.leader_id,
      }));
    }
  }, [team, employees]);

  // Update leader name display whenever leader_id changes
  useEffect(() => {
    if (!formData.leader_id || members.length === 0) return;

    const found = members.find((m) => {
      const id = m.user ? m.user.user_id : m.user_id;
      return id === formData.leader_id;
    });

    if (found) {
      const name = found.user ? found.user.name : found.name;
      setLeaderName(name);
    } else {
      setLeaderName("");
    }
  }, [formData.leader_id, members]);

  // ===== Helpers =====
  const stringToInt = (str: string) => parseInt(str, 10);

  // ===== Handlers =====
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMember = () => {
    const selectedEmployee = employees.find(
      (e) => e.user_id === stringToInt(selectedMemberId)
    );
    if (!selectedEmployee) return;

    const alreadyIn =
      members.some((m) =>
        m.user
          ? m.user.user_id === selectedEmployee.user_id
          : m.user_id === selectedEmployee.user_id
      );

    if (alreadyIn) return;

    const newMember =
      members.length && members[0].user
        ? { id: crypto.randomUUID(), user: selectedEmployee }
        : selectedEmployee;

    const updatedMembers = [...members, newMember];

    setMembers(updatedMembers);
    setFormData((prev) => ({
      ...prev,
      members: updatedMembers,
    }));

    setSelectedMemberId("");
  };

  const handleRemoveMember = (idToRemove: string) => {
    const updatedMembers = members.filter((member) => {
      const memberId = member.user ? member.user.user_id : member.user_id;
      return memberId !== stringToInt(idToRemove);
    });

    setMembers(updatedMembers);
    setFormData((prev) => ({
      ...prev,
      members: updatedMembers,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if(formData.members.length === 0){
      toast.warning("Teams can not exist without members.");
    } else {
      const updatedTeam: Teams = {
        ...formData,
        members: members.map((m) => (m.user ? m.user.user_id : m.user_id)),
      };
      onUpdate(updatedTeam);
      onClose();
    }
  };

  const availableEmployees = employees.filter((emp) => {
    return !members.some((member) => {
      const memberId = member.user ? member.user.user_id : member.user_id;
      return memberId === emp.user_id;
    });
  });

  if (!mounted) {
    return null;
  }

  // ===== Render =====
  const modal = (
    <motion.div
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-[#030114]/60 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        ref={shellRef}
        className="relative my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0a0826]/95 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
      >
        {/* Top radial glow element */}
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(82,113,255,0.12),transparent_50%)] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 px-6 py-6 sm:px-8 border-b border-white/[0.08] flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Team</h2>
            <p className="mt-1 text-sm text-white/50">
              Update team details and manage members
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/60 transition hover:bg-white/[0.08] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col flex-1 overflow-hidden">
          {/* Body */}
          <div className="px-6 py-6 sm:px-8 space-y-6 overflow-y-auto max-h-[calc(100vh-14rem)]">
            {/* Team Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-1.5">
                  Team Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter team name"
                  className="w-full h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-[#5271ff]/50 focus:bg-white/[0.05] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/70 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-[#5271ff]/50 focus:bg-white/[0.05] transition-all resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Members */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/60">
                  Team Members
                </h3>
                <button
                  className="relative overflow-hidden bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] hover:from-[#6380ff] hover:to-[#475cd6] text-white text-xs font-semibold h-9 px-4 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(82,113,255,0.2)] focus:ring-2 focus:ring-[#5271ff]/50 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                  type="button"
                  onClick={handleAddMember}
                  disabled={!selectedMemberId}
                >
                  Add Member
                </button>
              </div>

              <Select
                value={selectedMemberId}
                onValueChange={(value) => setSelectedMemberId(value)}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 text-sm text-white transition-all hover:bg-white/[0.05] hover:border-white/[0.12] focus:border-[#5271ff]/50 outline-none text-left">
                  <SelectValue placeholder="Select a Member" />
                </SelectTrigger>
                <SelectContent className="border border-white/[0.08] bg-[#0a0826] text-white rounded-xl shadow-2xl backdrop-blur-2xl">
                  {availableEmployees.map((o) => (
                    <SelectItem
                      key={o.user_id}
                      value={String(o.user_id)}
                      className="cursor-pointer text-white focus:bg-white/5 focus:text-white"
                    >
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-3 flex flex-wrap gap-2">
                {members.length === 0 ? (
                  <span className="text-sm text-white/30 italic">
                    No members added yet.
                  </span>
                ) : (
                  members.map((member) => {
                    const name = member.user ? member.user.name : member.name;
                    const id = member.user ? member.user.user_id : member.user_id;

                    return (
                      <span
                        key={id}
                        className="flex max-w-full items-center gap-2 rounded-full bg-white/[0.03] border border-white/[0.08] pl-2.5 pr-3.5 py-1.5 text-sm text-white"
                      >
                        <span className="w-6 h-6 bg-gradient-to-br from-[#5271ff] to-[#3a4ec4] text-white font-bold rounded-full flex items-center justify-center text-xs">
                          {name.charAt(0)?.toUpperCase()}
                        </span>
                        <span className="break-words font-medium">{name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(String(id))}
                          className="text-white/40 hover:text-white ml-1 cursor-pointer transition-colors"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })
                )}
              </div>
            </div>

            {/* Leader Selection */}
            <div className="pt-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/60 mb-3">
                Team Leader
              </h3>
              <Select
                value={formData.leader_id ? String(formData.leader_id) : ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    leader_id: stringToInt(value),
                  }))
                }
              >
                <SelectTrigger className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 text-sm text-white transition-all hover:bg-white/[0.05] hover:border-white/[0.12] focus:border-[#5271ff]/50 outline-none text-left">
                  <SelectValue placeholder={leaderName || "Select a Lead"} />
                </SelectTrigger>
                <SelectContent className="border border-white/[0.08] bg-[#0a0826] text-white rounded-xl shadow-2xl backdrop-blur-2xl">
                  {members.map((o) => (
                    <SelectItem
                      key={o.user?.user_id ?? o.user_id}
                      value={String(o.user?.user_id ?? o.user_id)}
                      className="cursor-pointer text-white focus:bg-white/5 focus:text-white"
                    >
                      {o.user?.name ?? o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Footer */}
          <div className="relative z-10 px-6 py-6 sm:px-8 border-t border-white/[0.08] bg-white/[0.01] flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm font-medium text-white/70 hover:bg-white/[0.08] hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              className="px-6 py-2.5 bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] hover:from-[#6380ff] hover:to-[#475cd6] text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(82,113,255,0.2)] focus:ring-2 focus:ring-[#5271ff]/50 hover:scale-[1.02] active:scale-[0.98]"
              type="submit"
            >
              Update Team
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );

  return createPortal(modal, document.body);
}
