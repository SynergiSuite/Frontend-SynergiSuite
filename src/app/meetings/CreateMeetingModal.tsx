"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion as m } from "framer-motion";
import { X, Calendar, Video, Users, Clock } from "lucide-react";
import { CreateMeetingPayload } from "./types/meetingTypes";
import { toast } from "sonner";

interface GroupOption {
  id: string;
  name: string;
  members?: { id: number; name: string }[];
}

interface CreateMeetingModalProps {
  groups: GroupOption[];
  defaultGroupId?: string;
  onClose: () => void;
  onSubmit: (payload: CreateMeetingPayload, isInstant: boolean) => Promise<void>;
}

export default function CreateMeetingModal({
  groups,
  defaultGroupId,
  onClose,
  onSubmit,
}: CreateMeetingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [groupId, setGroupId] = useState(defaultGroupId || groups[0]?.id || "");
  const [title, setTitle] = useState("");
  const [isInstant, setIsInstant] = useState(true);
  const [startsAtDate, setStartsAtDate] = useState("");
  const [startsAtTime, setStartsAtTime] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedGroup = groups.find((g) => g.id === groupId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId) {
      toast.error("Please select a group");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a meeting title");
      return;
    }

    let startsAt: string | undefined = undefined;
    if (!isInstant && startsAtDate && startsAtTime) {
      startsAt = new Date(`${startsAtDate}T${startsAtTime}`).toISOString();
    }

    try {
      setIsSubmitting(true);
      await onSubmit(
        {
          groupId,
          title: title.trim(),
          startsAt,
          participantIds: selectedParticipants.length > 0 ? selectedParticipants : undefined,
        },
        isInstant
      );
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create meeting");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <m.button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-[#030114]/80 backdrop-blur-md cursor-pointer"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal Shell */}
      <m.div
        className="relative z-10 my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/95 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.96 }}
      >
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#5271ff] via-cyan-400 to-[#3a4ec4]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5 sm:px-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="h-5 w-5 text-[#5271ff]" />
              Schedule / Start Group Meeting
            </h2>
            <p className="text-xs text-white/40 mt-1">
              Create a LiveKit video/audio conference session for your team.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-4 text-white custom-scrollbar">
          {/* Select Group */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
              Target Group
            </label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#030114]/60 px-4 text-sm text-white outline-none transition focus:border-[#5271ff]"
            >
              {groups.length === 0 ? (
                <option value="">No groups available</option>
              ) : (
                groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Meeting Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
              Meeting Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Weekly Sprint Sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#030114]/60 px-4 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#5271ff]"
            />
          </div>

          {/* Instant vs Scheduled */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
              Schedule Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsInstant(true)}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition cursor-pointer ${
                  isInstant
                    ? "border-[#5271ff] bg-[#5271ff]/20 text-white shadow-[0_0_15px_rgba(82,113,255,0.2)]"
                    : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                <Video className="h-4 w-4" />
                Start Now (Instant)
              </button>

              <button
                type="button"
                onClick={() => setIsInstant(false)}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition cursor-pointer ${
                  !isInstant
                    ? "border-[#5271ff] bg-[#5271ff]/20 text-white shadow-[0_0_15px_rgba(82,113,255,0.2)]"
                    : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                <Calendar className="h-4 w-4" />
                Schedule Later
              </button>
            </div>
          </div>

          {/* Date / Time input if scheduled */}
          {!isInstant && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/50 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required={!isInstant}
                  value={startsAtDate}
                  onChange={(e) => setStartsAtDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/10 bg-[#030114]/60 px-3 text-xs text-white outline-none focus:border-[#5271ff]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/50 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  required={!isInstant}
                  value={startsAtTime}
                  onChange={(e) => setStartsAtTime(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/10 bg-[#030114]/60 px-3 text-xs text-white outline-none focus:border-[#5271ff]"
                />
              </div>
            </div>
          )}

          {/* Footer controls */}
          <div className="flex justify-end gap-3 border-t border-white/[0.08] pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(82,113,255,0.3)] hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : isInstant ? "Create Meeting" : "Schedule Meeting"}
            </button>
          </div>
        </form>
      </m.div>
    </div>,
    document.body
  );
}
