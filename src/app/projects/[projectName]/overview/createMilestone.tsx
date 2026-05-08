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
import {
  modalBodyClass,
  modalFooterClass,
  modalHeaderClass,
  modalOverlayClass,
  modalShellClass,
  modalTitleClass,
} from "@/lib/modalStyles";

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
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        type="button"
        aria-label="Close modal"
        className={modalOverlayClass}
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className={`${modalShellClass} max-w-2xl`}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div className={modalHeaderClass}>
          <h2 className={modalTitleClass}>
            Milestone Details
          </h2>
        </div>

        <div className={modalBodyClass}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter milestone name"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <p className="mt-1 text-xs text-gray-500">Format: 2025-11-20</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              List
            </label>
            <div className="flex gap-2">
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger className="flex-1 border_primary bg-white cursor-pointer">
                  <SelectValue placeholder="Select task" />
                </SelectTrigger>
                <SelectContent>
                  {availableTasks.length > 0 ? (
                    availableTasks.map((task: any) => (
                      <SelectItem
                        key={task.id}
                        value={task.id}
                        className="cursor-pointer"
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
                disabled={availableTasks.length === 0}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Add
              </button>
            </div>
            {taskIds.length > 0 ? (
              <div className="mt-3 space-y-2">
                {taskIds.map((taskId, index) => {
                  const task = availableTasks.find((t: any) => t.id === taskId);
                  return (
                  <div
                    key={`${taskId}-${index}`}
                    className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700"
                  >
                    <span>{task ? taskTitle(task) : "Unknown task"}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      Remove
                    </button>
                  </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-2 text-xs text-gray-500">
                Tasks are optional.
              </p>
            )}
          </div>

          {projectName ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <input
                type="text"
                readOnly
                value={projectName}
                className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 text-gray-700"
                placeholder="Project name"
              />
            </div>
          ) : null}

          {!projectId ? (
            <p className="text-xs text-red-500">
              A project is required to create this milestone.
            </p>
          ) : null}
        </div>

        <div className={`${modalFooterClass} flex justify-end space-x-3`}>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
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
            className={`px-4 py-2 rounded-md text-white transition ${
              isFormValid
                ? "bg-black hover:bg-gray-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Create Milestone
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
