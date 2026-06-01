"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "../task/schemas/task";
import { MilestoneUpdate } from "../schemas/milestone";
import { Edit3, Trash2, Plus, Calendar } from "lucide-react";

type MilestoneEditModalProps = {
  onCancel: () => void;
  onSubmit: (data: MilestoneUpdate) => void;
  milestoneId: string;
  initialName?: string;
  initialEndDate?: string;
  initialTaskIds?: string[];
  availableTasks: Task[];
  isSubmitting?: boolean;
  title?: string;
};

export default function MilestoneEditModal({
  onCancel,
  onSubmit,
  milestoneId,
  initialName = "",
  initialEndDate = "",
  initialTaskIds = [],
  availableTasks,
  isSubmitting = false,
  title = "Edit Milestone",
}: MilestoneEditModalProps) {
  const [name, setName] = useState(initialName);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [taskIds, setTaskIds] = useState<string[]>(initialTaskIds);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  useEffect(() => {
    setEndDate(initialEndDate);
  }, [initialEndDate]);

  useEffect(() => {
    setTaskIds(initialTaskIds);
  }, [initialTaskIds]);

  const taskTitle = (task: Task) => task.title || "Untitled task";

  const addTask = () => {
    if (!selectedTaskId) {
      return;
    }

    setTaskIds((prev) =>
      prev.includes(selectedTaskId) ? prev : [...prev, selectedTaskId]
    );
    setSelectedTaskId("");
  };

  const removeTask = (index: number) => {
    setTaskIds((prev) => prev.filter((_, taskIndex) => taskIndex !== index));
  };

  const isFormValid = name.trim().length > 0 && endDate !== "";

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
        disabled={isSubmitting}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Modal Shell */}
      <motion.div
        className="relative bg-[#0a0826]/95 border border-white/[0.08] backdrop-blur-md rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-blue-500/10 z-50 p-6 flex flex-col max-h-[90vh]"
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
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
            <p className="text-xs text-white/40 font-medium">Update milestone configuration</p>
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
              placeholder="Enter milestone name"
              disabled={isSubmitting}
              className="w-full border border-white/[0.08] rounded-xl p-3 bg-white/[0.02] text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#5271ff] focus:border-[#5271ff] transition-all duration-200 disabled:opacity-50"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
              Target End Date
            </label>
            <input
              type="date"
              value={endDate}
              disabled={isSubmitting}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full border border-white/[0.08] rounded-xl p-3 bg-white/[0.02] text-white focus:outline-none focus:ring-1 focus:ring-[#5271ff] focus:border-[#5271ff] transition-all duration-200 scheme-dark disabled:opacity-50"
            />
            <p className="mt-1.5 text-[10px] text-white/30 font-semibold uppercase tracking-wider">Format: YYYY-MM-DD</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
              Associated Tasks
            </label>
            <div className="flex gap-2">
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger className="flex-1 border border-white/[0.08] bg-white/[0.02] text-white rounded-xl focus:ring-1 focus:ring-[#5271ff] hover:bg-white/[0.04] transition-colors cursor-pointer p-3 h-auto disabled:opacity-50">
                  <SelectValue placeholder="Select a task to link" />
                </SelectTrigger>
                <SelectContent className="border border-white/[0.08] bg-[#0c0a2d] text-white rounded-xl shadow-xl">
                  {availableTasks.length > 0 ? (
                    availableTasks.map((task) => (
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
                onClick={addTask}
                disabled={availableTasks.length === 0 || !selectedTaskId || isSubmitting}
                className="px-4 py-3 rounded-xl border border-[#5271ff]/30 text-white hover:bg-[#5271ff]/10 hover:border-[#5271ff]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5 font-semibold text-xs shrink-0"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {taskIds.length > 0 ? (
              <div className="mt-3.5 space-y-2 max-h-40 overflow-y-auto pr-1">
                {taskIds.map((taskId, index) => {
                  const task = availableTasks.find((item) => item.id === taskId);
                  return (
                    <div
                      key={`${taskId}-${index}`}
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-xs text-white/80"
                    >
                      <span className="font-medium">{task ? taskTitle(task) : "Unknown task"}</span>
                      <button
                        type="button"
                        onClick={() => removeTask(index)}
                        disabled={isSubmitting}
                        className="text-rose-400 hover:text-rose-300 font-semibold transition-colors duration-200 flex items-center gap-1 cursor-pointer disabled:opacity-50"
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
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-white/70 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 text-xs font-semibold disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isFormValid || isSubmitting) {
                return;
              }

              onSubmit({
                id: milestoneId,
                name: name.trim(),
                end_date: endDate,
                taskIds,
              });
            }}
            disabled={!isFormValid || isSubmitting}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition duration-300 ${
              isFormValid && !isSubmitting
                ? "bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] text-white shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:shadow-[0_0_22px_rgba(82,113,255,0.4)] hover:scale-[1.02] cursor-pointer"
                : "bg-white/[0.04] border border-white/[0.04] text-white/30 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
