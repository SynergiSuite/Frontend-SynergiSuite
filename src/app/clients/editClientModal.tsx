"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, PencilLine, X } from "lucide-react";
import {
  CLIENT_PRIORITY_OPTIONS,
} from "../enums/clientPriority.enum";
import { EditClientDto } from "./dtos/editClient.dto";

type EditClientModalProps = {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string;
    priority: number;
  };
  onClose: () => void;
  onSave: (id: string, payload: EditClientDto) => Promise<void>;
};

export default function EditClientModal({
  client,
  onClose,
  onSave,
}: EditClientModalProps) {
  const [name, setName] = useState(client.name);
  const [email, setEmail] = useState(client.email);
  const [phone, setPhone] = useState(client.phone);
  const [address, setAddress] = useState(client.address);
  const [company, setCompany] = useState(client.company);
  const [priority, setPriority] = useState<number>(client.priority);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
    setCompany(client.company);
    setPriority(client.priority);
  }, [client]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !email || !phone || !company) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(client.id, {
        name,
        email,
        phone,
        address,
        company,
        priority,
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
                <PencilLine className="h-6 w-6 text-[#5271ff]" />
                Edit Client Profile
              </h2>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-white/30 mt-1">
                Modify details for {client.name || "client account"}
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
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(event) => setPriority(Number(event.target.value))}
                  className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0c0a2f] px-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                >
                  {CLIENT_PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#0c0a2f] text-white">
                      {option.label}
                    </option>
                  ))}
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

