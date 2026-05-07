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
    width="14"
    height="14"
    viewBox="0 0 20 20"
    aria-hidden="true"
    className="text-amber-500"
  >
    <path
      fill="currentColor"
      d="M10 1.5l2.4 4.86 5.36.78-3.88 3.78.92 5.34L10 13.98l-4.8 2.52.92-5.34L2.24 7.14l5.36-.78L10 1.5z"
    />
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
            View & Edit Task
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
            Description
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
                  {formatTaskLabel(status)}
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
                  {formatTaskLabel(priority)}
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
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Team
          </h3>
          {teams.length === 0 ? (
            <div className="text-sm text-gray-500">
              No team assigned.
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
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="text-sm font-semibold text-gray-800 mb-2">
                      {team.name}
                    </div>
                    {normalizedMembers.length === 0 ? (
                      <div className="text-sm text-gray-500">
                        No members listed.
                      </div>
                    ) : (
                      <ul className="space-y-1">
                        {normalizedMembers.map((member) => {
                          const isLeader = leaderId === member.user_id;
                          return (
                            <li
                              key={member.user_id}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              {isLeader && <LeaderIcon />}
                              <span className="font-medium">
                                {member.name}
                              </span>
                              {member.email && (
                                <span className="text-xs text-gray-400">
                                  {member.email}
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
            className={`px-4 py-2 rounded-md text-white transition ${
              isFormValid
                ? "bg-black hover:bg-gray-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
