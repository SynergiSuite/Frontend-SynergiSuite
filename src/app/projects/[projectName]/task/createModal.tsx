"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatTaskLabel, TASK_STATUS_OPTIONS } from "./task-utils";

type AssigneeOption = {
  id: string;
  name: string;
};

export type NewTaskPayload = {
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigneeId: string;
  projectName: string;
  dueDate: string;
  milestoneId?: string;
};

interface NewTaskModalProps {
  onCancel: () => void;
  onSubmit: (data: NewTaskPayload) => void;
  assignees: AssigneeOption[];
  milestones: { id: string; name: string }[];
  projectName: string;
  statusOptions?: string[];
  priorityOptions?: string[];
}

const fallbackPriorityOptions = ["low", "medium", "high"];

export default function NewTaskModal({
  onCancel,
  onSubmit,
  assignees,
  milestones,
  projectName,
  statusOptions,
  priorityOptions,
}: NewTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [priorityValue, setPriorityValue] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [milestoneId, setMilestoneId] = useState("");

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
    statusValue !== "" &&
    priorityValue !== "" &&
    assigneeId !== "" &&
    dueDate !== "";

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
            Create New Task
          </h2>
          <p className="text-xs text-white/40 mt-1 font-medium">Define task scope, parameters, and assignee settings</p>
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
              Description (optional)
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

          {/* Assignee & Milestone Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Assigned To */}
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">
                Assigned To
              </label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger className="w-full border border-white/[0.08] bg-[#030114]/40 text-white rounded-xl h-11 focus:ring-1 focus:ring-[#5271ff]/30 focus:border-[#5271ff]/50 cursor-pointer flex items-center justify-between px-4 transition-all duration-300">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent className="border border-white/[0.08] bg-[#0a0826] text-white rounded-xl shadow-2xl backdrop-blur-2xl">
                  {assignees.map((assignee) => (
                    <SelectItem
                      key={assignee.id}
                      value={assignee.id}
                      className="cursor-pointer focus:bg-[#5271ff]/20 focus:text-white rounded-lg py-2 px-3 transition-colors text-white/80"
                    >
                      {assignee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Milestone */}
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">
                Milestone
              </label>
              <Select value={milestoneId} onValueChange={setMilestoneId}>
                <SelectTrigger className="w-full border border-white/[0.08] bg-[#030114]/40 text-white rounded-xl h-11 focus:ring-1 focus:ring-[#5271ff]/30 focus:border-[#5271ff]/50 cursor-pointer flex items-center justify-between px-4 transition-all duration-300">
                  <SelectValue placeholder="Select milestone" />
                </SelectTrigger>
                <SelectContent className="border border-white/[0.08] bg-[#0a0826] text-white rounded-xl shadow-2xl backdrop-blur-2xl">
                  {milestones.map((milestone) => (
                    <SelectItem
                      key={milestone.id}
                      value={milestone.id}
                      className="cursor-pointer focus:bg-[#5271ff]/20 focus:text-white rounded-lg py-2 px-3 transition-colors text-white/80"
                    >
                      {milestone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              <p className="mt-1.5 text-xs text-white/30 font-medium pl-1">Format: YYYY-MM-DD</p>
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">
                Project
              </label>
              <input
                type="text"
                readOnly
                value={projectName}
                className="w-full bg-[#030114]/20 border border-white/[0.04] rounded-xl px-4 py-2.5 h-11 text-white/40 cursor-not-allowed font-medium"
                placeholder="Project name"
              />
            </div>
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

              onSubmit({
                title: title.trim(),
                description: description.trim() || undefined,
                status: statusValue,
                priority: priorityValue,
                assigneeId,
                projectName,
                dueDate,
                milestoneId: milestoneId || undefined,
              });
            }}
            disabled={!isFormValid}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ${
              isFormValid
                ? "bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:shadow-[0_0_22px_rgba(82,113,255,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                : "bg-white/[0.04] text-white/20 border border-white/[0.04] cursor-not-allowed"
            }`}
          >
            Create Task
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
