"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, PlusCircle, X } from "lucide-react";
import { ResourceType } from "./statesCards";

type AddResourceModalProps = {
  onClose: () => void;
  onSave: (payload: Omit<ResourceType, "id">) => Promise<void>;
};

export default function AddResourceModal({
  onClose,
  onSave,
}: AddResourceModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Cloud Infrastructure");
  const [status, setStatus] = useState<"Available" | "Allocated" | "Under Maintenance">("Available");
  const [quantity, setQuantity] = useState<number>(1);
  const [cost, setCost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !type || !cost) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        name,
        type,
        status,
        quantity,
        cost,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

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
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      <motion.div
        className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0c0a2f] bg-gradient-to-br from-[#5271ff]/5 via-[#0c0a2f]/95 to-[#0a0826] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-md flex flex-col max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div className="mb-6 border-b border-white/[0.08] pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <PlusCircle className="h-6 w-6 text-[#5271ff]" />
                Add Workspace Resource
              </h2>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-white/30 mt-1">
                Register a new hardware, software, space, or cloud resource
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-white/50 transition hover:bg-white/[0.08] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <form className="flex flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="space-y-4 flex-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                  Resource Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., AWS Production Instance"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                  Resource Type
                </label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0c0a2f] px-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                  >
                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Software License">Software License</option>
                    <option value="Office Space">Office Space</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value))}
                  required
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                  Estimated Cost (e.g. $1,200/mo)
                </label>
                <input
                  type="text"
                  placeholder="e.g., $1,200/mo"
                  value={cost}
                  onChange={(event) => setCost(event.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                Deployment Status
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as any)}
                  className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0c0a2f] px-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                >
                  <option value="Available">Available</option>
                  <option value="Allocated">Allocated</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-2 text-sm font-semibold text-white/70 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08] hover:text-white hover:border-white/20 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-6 py-2 text-sm font-semibold text-white transition-all duration-300 hover:opacity-95 hover:shadow-[0_0_15px_rgba(82,113,255,0.35)] active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Resource"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
