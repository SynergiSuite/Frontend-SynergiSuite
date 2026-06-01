"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatTaskLabel, TASK_STATUS_OPTIONS } from "./task-utils";

type TeamMember = {
  user_id: number;
  name: string;
  email?: string;
};

type TeamInfo = {
  id: string;
  name: string;
  leader?: TeamMember;
  leader_id?: number;
  members?: TeamMember[];
};

export type TaskViewEditPayload = {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  status: string;
  priority: string;
};

export type TaskViewEditData = {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  status: string;
  priority: string;
  teams?: TeamInfo[];
};

type ViewAndEditProps = {
  data: TaskViewEditData;
  onCancel: () => void;
  onSave: (payload: TaskViewEditPayload) => void;
  statusOptions?: string[];
  priorityOptions?: string[];
};

const LeaderIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 20 20"
    aria-hidden="true"
    className="text-amber-400 fill-current animate-pulse"
  >
    <path d="M10 1.5l2.4 4.86 5.36.78-3.88 3.78.92 5.34L10 13.98l-4.8 2.52.92-5.34L2.24 7.14l5.36-.78L10 1.5z" />
  </svg>
);

const fallbackPriorityOptions = ["low", "medium", "high"];

export default function ViewAndEditModal({
  data,
  onCancel,
  onSave,
  statusOptions,
  priorityOptions,
}: ViewAndEditProps) {
  const [taskId, setTaskId] = useState(data.id ?? "");
  const [title, setTitle] = useState(data.title ?? "");
  const [description, setDescription] = useState(data.description ?? "");
  const [dueDate, setDueDate] = useState(data.due_date ?? "");
  const [statusValue, setStatusValue] = useState(data.status ?? "");
  const [priorityValue, setPriorityValue] = useState(data.priority ?? "");

  useEffect(() => {
    setTaskId(data.id ?? "");
    setTitle(data.title ?? "");
    setDescription(data.description ?? "");
    setDueDate(data.due_date ?? "");
    setStatusValue(data.status ?? "");
    setPriorityValue(data.priority ?? "");
  }, [data]);

  const teams = useMemo(() => data.teams ?? [], [data.teams]);
  const resolvedStatusOptions = useMemo(
    () =>
      statusOptions && statusOptions.length > 0
        ? statusOptions
        : TASK_STATUS_OPTIONS,
    [statusOptions]
  );

  const resolvedPriorityOptions = useMemo(
    () =>
      priorityOptions && priorityOptions.length > 0
        ? priorityOptions
        : fallbackPriorityOptions,
    [priorityOptions]
  );

  const isFormValid =
    title.trim().length > 0 &&
    dueDate !== "" &&
    statusValue !== "" &&
    priorityValue !== "";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Background Overlay */}
      <motion.button
        type="button"
        aria-label="Close modal"
        className="fixed inset-0 bg-[#030114]/80 backdrop-blur-md z-45"
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      />

      {/* Modal Container Shell */}
      <motion.div
        className="relative z-50 flex flex-col w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-[#0a0826]/90 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden max-h-[calc(100vh-4rem)]"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 280, damping: 25 }}
      >
        {/* Top Accent Neon Stripe */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#5271ff] via-cyan-400 to-[#3a4ec4] z-10" />

        {/* Ambient interior glow */}
        <div className="absolute -left-20 -top-20 h-[300px] w-[300px] bg-[radial-gradient(circle,rgba(82,113,255,0.12),transparent_65%)] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 border-b border-white/[0.08] px-6 py-5 sm:px-8 bg-white/[0.01]">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            View & Edit Task
          </h2>
          <p className="text-xs text-white/40 mt-1 font-medium">
            Update task properties, parameters, and review assignments
          </p>
        </div>

        {/* Body (Scrollable) */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-5 text-white custom-scrollbar">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter task title"
              className="w-full bg-[#030114]/40 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 transition-all duration-300"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Add task details..."
              className="w-full bg-[#030114]/40 border border-white/[0.08] rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 transition-all duration-300 resize-none"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          {/* Status & Priority Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">
                Status
              </label>
              <Select value={statusValue} onValueChange={setStatusValue}>
                <SelectTrigger className="w-full border border-white/[0.08] bg-[#030114]/40 text-white rounded-xl h-11 focus:ring-1 focus:ring-[#5271ff]/30 focus:border-[#5271ff]/50 cursor-pointer flex items-center justify-between px-4 transition-all duration-300">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="border border-white/[0.08] bg-[#0a0826] text-white rounded-xl shadow-2xl backdrop-blur-2xl">
                  {resolvedStatusOptions.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="cursor-pointer focus:bg-[#5271ff]/20 focus:text-white rounded-lg py-2 px-3 transition-colors text-white/80"
                    >
                      {formatTaskLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">
                Priority
              </label>
              <Select value={priorityValue} onValueChange={setPriorityValue}>
                <SelectTrigger className="w-full border border-white/[0.08] bg-[#030114]/40 text-white rounded-xl h-11 focus:ring-1 focus:ring-[#5271ff]/30 focus:border-[#5271ff]/50 cursor-pointer flex items-center justify-between px-4 transition-all duration-300">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="border border-white/[0.08] bg-[#0a0826] text-white rounded-xl shadow-2xl backdrop-blur-2xl">
                  {resolvedPriorityOptions.map((priority) => (
                    <SelectItem
                      key={priority}
                      value={priority}
                      className="cursor-pointer focus:bg-[#5271ff]/20 focus:text-white rounded-lg py-2 px-3 transition-colors text-white/80"
                    >
                      {formatTaskLabel(priority)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="w-full bg-[#030114]/40 border border-white/[0.08] rounded-xl px-4 py-2.5 h-11 text-white focus:outline-none focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 transition-all duration-300 scheme-dark cursor-pointer font-medium"
            />
            <p className="mt-1.5 text-xs text-white/30 font-medium pl-1">
              Format: YYYY-MM-DD
            </p>
          </div>

          {/* Assigned Teams */}
          <div>
            <h3 className="text-sm font-semibold text-white/70 mb-3">
              Assigned Team & Members
            </h3>
            {teams.length === 0 ? (
              <div className="text-sm text-white/40 italic pl-1">
                No team assigned to this task.
              </div>
            ) : (
              <div className="space-y-4">
                {teams.map((team) => {
                  const leaderId =
                    team.leader?.user_id ?? team.leader_id ?? null;
                  const members = team.members ?? [];
                  const normalizedMembers =
                    leaderId && !members.some((m) => m.user_id === leaderId)
                      ? [
                          ...members,
                          team.leader ?? {
                            user_id: leaderId,
                            name: "Team Leader",
                          },
                        ]
                      : members;

                  return (
                    <div
                      key={team.id}
                      className="bg-[#030114]/30 border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-all duration-300"
                    >
                      <div className="text-sm font-semibold text-[#5271ff] mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#5271ff] shadow-[0_0_8px_#5271ff]" />
                        {team.name}
                      </div>
                      {normalizedMembers.length === 0 ? (
                        <div className="text-xs text-white/30 italic pl-3.5">
                          No members listed.
                        </div>
                      ) : (
                        <ul className="space-y-2 pl-3.5 border-l border-white/[0.04]">
                          {normalizedMembers.map((member) => {
                            const isLeader = leaderId === member.user_id;
                            return (
                              <li
                                key={member.user_id}
                                className="flex items-center gap-2.5 text-sm text-white/70"
                              >
                                {isLeader ? (
                                  <span className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                                    <LeaderIcon />
                                    Leader
                                  </span>
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                )}
                                <span className="font-medium text-white/90">
                                  {member.name}
                                </span>
                                {member.email && (
                                  <span className="text-xs text-white/30 font-light">
                                    ({member.email})
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-white/[0.08] bg-[#0a0826]/40 px-6 py-5 sm:px-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/[0.08] bg-[#0a0826]/40 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-white/60 hover:text-white hover:bg-[#0a0826]/75 hover:border-white/[0.15] transition-all duration-300"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isFormValid) {
                return;
              }
              onSave({
                id: taskId,
                title: title.trim(),
                description: description.trim() || undefined,
                due_date: dueDate,
                status: statusValue,
                priority: priorityValue,
              });
            }}
            disabled={!isFormValid}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ${
              isFormValid
                ? "bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:shadow-[0_0_22px_rgba(82,113,255,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                : "bg-white/[0.04] text-white/20 border border-white/[0.04] cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
