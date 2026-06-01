"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "../schemas/project";
import { Calendar, Trash2, Plus, Landmark, Briefcase } from "lucide-react";

export type NewMilestonePayload = {
  name: string;
  endDate: string;
  taskIds: string[];
  projectId?: string;
  projectName?: string;
};

type CreateMilestoneModalProps = {
  onCancel: () => void;
  onSubmit: (data: NewMilestonePayload) => void;
  projectName?: string;
  projectDetail?: Project;
};

export default function CreateMilestoneModal({
  onCancel,
  onSubmit,
  projectName,
  projectDetail,
}: CreateMilestoneModalProps) {
  const [name, setName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [taskIds, setTaskIds] = useState<string[]>([]);
  const projectId = projectDetail?.id;

  const availableTasks = projectDetail?.tasks ?? [];
  const taskTitle = (task: any) =>
    (task?.title as string) || (task?.name as string) || "Untitled task";

  const addItem = () => {
    if (!selectedTaskId) {
      return;
    }
    setTaskIds((prev) =>
      prev.includes(selectedTaskId) ? prev : [...prev, selectedTaskId]
    );
    setSelectedTaskId("");
  };

  const removeItem = (index: number) => {
    setTaskIds((prev) => prev.filter((_, i) => i !== index));
  };

  const isFormValid =
    name.trim().length > 0 && endDate !== "" && Boolean(projectId);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.button
        type="button"
        aria-label="Close modal"
        className="fixed inset-0 z-40 bg-[#030114]/80 backdrop-blur-sm cursor-default"
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Modal Shell */}
      <motion.div
        className="relative bg-[#0a0826]/95 border border-white/[0.08] backdrop-blur-md rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl shadow-blue-500/10 z-50 p-6 flex flex-col max-h-[90vh]"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        {/* Neon Stripe Accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#5271ff] via-cyan-400 to-[#5271ff]" />

        {/* Modal Header */}
        <div className="mb-5 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#5271ff]/10 border border-[#5271ff]/20 flex items-center justify-center text-[#5271ff]">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Create Milestone
            </h2>
            <p className="text-xs text-white/40 font-medium">Define high-level roadmap targets</p>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5 scrollbar-thin">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
              Milestone Name
            </label>
            <input
              type="text"
              placeholder="e.g. Beta Release v1"
              className="w-full border border-white/[0.08] rounded-xl p-3 bg-white/[0.02] text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#5271ff] focus:border-[#5271ff] transition-all duration-200"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
              Target End Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-full border border-white/[0.08] rounded-xl p-3 bg-white/[0.02] text-white focus:outline-none focus:ring-1 focus:ring-[#5271ff] focus:border-[#5271ff] transition-all duration-200 scheme-dark"
              />
            </div>
            <p className="mt-1.5 text-[10px] text-white/30 font-semibold uppercase tracking-wider">Format: YYYY-MM-DD</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
              Link Associated Tasks
            </label>
            <div className="flex gap-2">
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger className="flex-1 border border-white/[0.08] bg-white/[0.02] text-white rounded-xl focus:ring-1 focus:ring-[#5271ff] hover:bg-white/[0.04] transition-colors cursor-pointer p-3 h-auto">
                  <SelectValue placeholder="Select a task to link" />
                </SelectTrigger>
                <SelectContent className="border border-white/[0.08] bg-[#0c0a2d] text-white rounded-xl shadow-xl">
                  {availableTasks.length > 0 ? (
                    availableTasks.map((task: any) => (
                      <SelectItem
                        key={task.id}
                        value={task.id}
                        className="cursor-pointer focus:bg-white/10 focus:text-white"
                      >
                        {taskTitle(task)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-tasks" disabled>
                      No tasks available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <button
                type="button"
                onClick={addItem}
                disabled={availableTasks.length === 0 || !selectedTaskId}
                className="px-4 py-3 rounded-xl border border-[#5271ff]/30 text-white hover:bg-[#5271ff]/10 hover:border-[#5271ff]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5 font-semibold text-xs"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {taskIds.length > 0 ? (
              <div className="mt-3.5 space-y-2 max-h-44 overflow-y-auto pr-1">
                {taskIds.map((taskId, index) => {
                  const task = availableTasks.find((t: any) => t.id === taskId);
                  return (
                    <div
                      key={`${taskId}-${index}`}
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-xs text-white/80"
                    >
                      <span className="font-medium">{task ? taskTitle(task) : "Unknown task"}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-rose-400 hover:text-rose-300 font-semibold transition-colors duration-200 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-2 text-[10px] text-white/30 font-semibold uppercase tracking-wider">
                * Note: Linking tasks is optional.
              </p>
            )}
          </div>

          {projectName ? (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                Project Context
              </label>
              <div className="flex items-center gap-2 border border-white/[0.04] rounded-xl p-3 bg-white/[0.01] text-white/40 text-xs">
                <Briefcase className="w-4 h-4 text-[#5271ff]" />
                <span className="font-semibold">{projectName}</span>
              </div>
            </div>
          ) : null}

          {!projectId ? (
            <p className="text-xs font-medium text-rose-400">
              A project is required to create this milestone.
            </p>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-white/70 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 text-xs font-semibold"
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
                name: name.trim(),
                endDate,
                taskIds,
                projectId,
                projectName: projectName || undefined,
              });
            }}
            disabled={!isFormValid}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition duration-300 ${
              isFormValid
                ? "bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] text-white shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:shadow-[0_0_22px_rgba(82,113,255,0.4)] hover:scale-[1.02] cursor-pointer"
                : "bg-white/[0.04] border border-white/[0.04] text-white/30 cursor-not-allowed"
            }`}
          >
            Create Milestone
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
