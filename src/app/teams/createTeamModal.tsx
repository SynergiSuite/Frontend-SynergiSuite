import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem 
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Employee, Team } from "./schemas/types";
import { toast } from "sonner";
import { createTeamApi, CreateTeamPayload } from "./apis/createTeamApi";

type CreateTeamModalProps = {
  onClose: () => void;
  onCreate: (team?: any) => void;
  employees: Employee[];
};

export default function CreateTeamModal({
  onClose,
  onCreate,
  employees,
}: CreateTeamModalProps) {
  
  // ====== States ======
  const [formData, setFormData] = useState<Team>({
    name: "",
    description: "",
    members: [],
    leader_id: 0,
  });  
  const [members, setMembers] = useState<Employee[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const shellRef = useRef<HTMLDivElement>(null);

  // ====== Animations ======
  useEffect(() => {
    if (shellRef.current) {
      gsap.fromTo(
        shellRef.current,
        { opacity: 0, scale: 0.96, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
    }
  }, []);

  // ======= Helper Functions =======
  const stringToInt = (str: string) => {
    return parseInt(str, 10);
  };

  // ====== Handlers ======
  const handleAddMember = () => {
    const selectedEmployee = employees.find((e) => Number(e.user_id) === stringToInt(selectedMemberId));
    if (selectedEmployee) {
      if (!members.some((m) => Number(m.user_id) === Number(selectedEmployee.user_id))) {
        setMembers((prev) => [...prev, selectedEmployee]);
      }
      setSelectedMemberId("");
    }
  };

  const handleRemoveMember = (idToRemove: string) => {
    const removeIdNum = stringToInt(idToRemove);
    setMembers((prev) => prev.filter((member) => Number(member.user_id) !== removeIdNum));
    if (Number(formData.leader_id) === removeIdNum) {
      setFormData((prev) => ({ ...prev, leader_id: 0 }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Name validation: letters and spaces only
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      toast.error("Team name is required.");
      return;
    }
    if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
      toast.error("Team name must contain letters and spaces only.");
      return;
    }

    // 2. Description validation: omit if empty, or 5-255 characters
    const trimmedDesc = (formData.description || "").trim();
    if (trimmedDesc.length > 0 && (trimmedDesc.length < 5 || trimmedDesc.length > 255)) {
      toast.error("Description must be between 5 and 255 characters.");
      return;
    }

    // 3. Leader ID validation: primitive number
    const leaderIdNum = Number(formData.leader_id);
    if (!leaderIdNum || isNaN(leaderIdNum) || leaderIdNum <= 0) {
      toast.error("Please select a team leader.");
      return;
    }

    // 4. Members validation: array of numeric user IDs
    const memberIdsNum = members
      .map((m) => Number(m.user_id))
      .filter((id) => !isNaN(id) && id > 0);

    if (memberIdsNum.length === 0) {
      toast.error("Please add at least one team member.");
      return;
    }

    // Ensure leader is included in members array if not already present
    const numericMembers = Array.from(new Set([...memberIdsNum, leaderIdNum]));

    // Construct Payload according to spec
    const payload: CreateTeamPayload = {
      name: trimmedName,
      leader_id: leaderIdNum,
      members: numericMembers,
    };

    if (trimmedDesc.length >= 5 && trimmedDesc.length <= 255) {
      payload.description = trimmedDesc;
    }

    try {
      setIsSubmitting(true);
      await createTeamApi(payload);
      toast.success("Team created successfully");
      onCreate(payload);
      onClose();
    } catch (err) {
      console.error("Create team failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to create team");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableEmployees = employees.filter(
    (emp) => !members.some((member) => Number(member.user_id) === Number(emp.user_id))
  );

  // ====== Render ======
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
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
        className="relative flex flex-col max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0a0826]/95 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
      >
        {/* Top radial glow element */}
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(82,113,255,0.12),transparent_50%)] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 px-6 py-6 sm:px-8 border-b border-white/[0.08] flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Create New Team
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Set up a new team and invite your colleagues
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
          <div className="px-6 py-6 sm:px-8 space-y-6 overflow-y-auto max-h-[calc(100vh-14rem)] custom-scrollbar">
            {/* Team Info */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-white/70 mb-1.5">
                  Team Name
                </label>
                <input
                  name="name"
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter team name (letters and spaces only)"
                  className="w-full h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-[#5271ff]/50 focus:bg-white/[0.05] transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-white/70 mb-1.5">
                  Description <span className="text-xs text-white/40 font-normal">(Optional, 5-255 chars)</span>
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-[#5271ff]/50 focus:bg-white/[0.05] transition-all resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Add Members */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/60">
                  Team Members
                </h3>
                <button
                  className="relative overflow-hidden bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] hover:from-[#6380ff] hover:to-[#475cd6] text-white text-xs font-semibold h-9 px-4 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(82,113,255,0.2)] focus:ring-2 focus:ring-[#5271ff]/50 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
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
                <SelectTrigger className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 text-sm text-white transition-all hover:bg-white/[0.05] hover:border-white/[0.12] focus:border-[#5271ff]/50 outline-none text-left cursor-pointer">
                  <SelectValue placeholder="Select a Member" />
                </SelectTrigger>

                <SelectContent className="border border-white/[0.08] bg-[#0a0826] text-white rounded-xl shadow-2xl backdrop-blur-2xl">
                  {availableEmployees.map((o) => (
                    <SelectItem key={o.user_id} value={String(o.user_id)} className="cursor-pointer text-white focus:bg-white/5 focus:text-white">
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
                    return (
                      <span
                        key={member.user_id}
                        className="flex max-w-full items-center gap-2 rounded-full bg-white/[0.03] border border-white/[0.08] pl-2.5 pr-3.5 py-1.5 text-sm text-white"
                      >
                        <span className="w-6 h-6 bg-gradient-to-br from-[#5271ff] to-[#3a4ec4] text-white font-bold rounded-full flex items-center justify-center text-xs">
                          {member.name[0]?.toUpperCase()}
                        </span>
                        <span className="break-words font-medium">{member.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(String(member.user_id))}
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
                value={String(formData.leader_id || "")}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    leader_id: stringToInt(value),
                  }))
                }
              >
                <SelectTrigger className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 text-sm text-white transition-all hover:bg-white/[0.05] hover:border-white/[0.12] focus:border-[#5271ff]/50 outline-none text-left cursor-pointer">
                  <SelectValue placeholder="Select a Lead" />
                </SelectTrigger>

                <SelectContent className="border border-white/[0.08] bg-[#0a0826] text-white rounded-xl shadow-2xl backdrop-blur-2xl">
                  {members.map((o) => (
                    <SelectItem key={o.user_id} value={String(o.user_id)} className="cursor-pointer text-white focus:bg-white/5 focus:text-white">
                      {o.name}
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
              className="px-5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm font-medium text-white/70 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] hover:from-[#6380ff] hover:to-[#475cd6] text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(82,113,255,0.2)] focus:ring-2 focus:ring-[#5271ff]/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-40"
              type="submit"
            >
              {isSubmitting ? "Creating..." : "Create Team"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
