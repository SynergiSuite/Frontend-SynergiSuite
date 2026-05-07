"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Milestone, MilestoneUpdate } from "../schemas/milestone";

type MilestoneEditModalProps = {
  onCancel: () => void;
  onSubmit: (data: MilestoneUpdate) => void;
  milestoneId: string;
  initialName?: string;
  initialEndDate?: string;
  title?: string;
};

export default function MilestoneEditModal({
  onCancel,
  onSubmit,
  milestoneId,
  initialName = "",
  initialEndDate = "",
  title = "Edit Milestone",
}: MilestoneEditModalProps) {
  const [name, setName] = useState(initialName);
  const [endDate, setEndDate] = useState(initialEndDate);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  useEffect(() => {
    setEndDate(initialEndDate);
  }, [initialEndDate]);

  const isFormValid = name.trim().length > 0 && endDate !== "";

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
        className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] relative flex flex-col"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div className="px-6 pt-6 pb-2 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
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
                id: milestoneId,
                name: name.trim(),
                endDate: endDate.toString()
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
