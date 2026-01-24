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
};

interface NewTaskModalProps {
  onCancel: () => void;
  onSubmit: (data: NewTaskPayload) => void;
  assignees: AssigneeOption[];
  projectName: string;
  statusOptions?: string[];
  priorityOptions?: string[];
}

const fallbackStatusOptions = [
  "todo",
  "in_progress",
  "review",
  "completed",
  "on_hold",
  "blocked",
];

const fallbackPriorityOptions = ["low", "medium", "high"];

const formatLabel = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default function NewTaskModal({
  onCancel,
  onSubmit,
  assignees,
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

  const resolvedStatusOptions = useMemo(
    () =>
      statusOptions && statusOptions.length > 0
        ? statusOptions
        : fallbackStatusOptions,
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
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] relative flex flex-col"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
          <div className="px-6 pt-6 pb-2 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Task Details
            </h2>
          </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter task title"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            rows={4}
            placeholder="Add task details"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-gray-400"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Select value={statusValue} onValueChange={setStatusValue}>
            <SelectTrigger className="w-full border_primary bg-white cursor-pointer">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {resolvedStatusOptions.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className="cursor-pointer"
                >
                  {formatLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <Select value={priorityValue} onValueChange={setPriorityValue}>
            <SelectTrigger className="w-full border_primary bg-white cursor-pointer">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {resolvedPriorityOptions.map((priority) => (
                <SelectItem
                  key={priority}
                  value={priority}
                  className="cursor-pointer"
                >
                  {formatLabel(priority)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned To
          </label>
          <Select value={assigneeId} onValueChange={setAssigneeId}>
            <SelectTrigger className="w-full border_primary bg-white cursor-pointer">
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              {assignees.map((assignee) => (
                <SelectItem
                  key={assignee.id}
                  value={assignee.id}
                  className="cursor-pointer"
                >
                  {assignee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <p className="mt-1 text-xs text-gray-500">Format: 2025-11-20</p>
        </div>

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
        </div>

        <div className="flex justify-end space-x-3 border-t px-6 py-3">
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
                title: title.trim(),
                description: description.trim() || undefined,
                status: statusValue,
                priority: priorityValue,
                assigneeId,
                projectName,
                dueDate,
              });
            }}
            disabled={!isFormValid}
            className={`px-4 py-2 rounded-md text-white transition ${
              isFormValid
                ? "bg-black hover:bg-gray-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Create Task
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
