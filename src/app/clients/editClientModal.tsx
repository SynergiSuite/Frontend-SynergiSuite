"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  CLIENT_PRIORITY_OPTIONS,
} from "../enums/clientPriority.enum";
import { EditClientDto } from "./dtos/editClient.dto";
import {
  modalBodyClass,
  modalCloseButtonClass,
  modalFooterClass,
  modalHeaderClass,
  modalOverlayClass,
  modalShellClass,
  modalSubtitleClass,
  modalTitleClass,
} from "@/lib/modalStyles";
import { X } from "lucide-react";

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
        onClick={onClose}
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className={modalTitleClass}>Edit Client</h2>
              <p className={modalSubtitleClass}>
                Update client information in the same workspace style.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={modalCloseButtonClass}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <form className="flex flex-1 flex-col" onSubmit={handleSubmit}>
          <div className={modalBodyClass}>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Priority
                </label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(event) => setPriority(Number(event.target.value))}
                    className="h-12 w-full appearance-none rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                  >
                    {CLIENT_PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`${modalFooterClass} flex justify-end gap-3`}>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
