"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PencilLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClientPriority,
  CLIENT_PRIORITY_OPTIONS,
} from "../enums/clientPriority.enum";
import type { EditClientDto } from "./dtos/editClient.dto";

type EditClientModalProps = {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string;
    priority: number;
    paymentType?: string;
    amount?: number;
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
  const [paymentType, setPaymentType] = useState<string>(
    client.paymentType || "per_hour"
  );
  const [amount, setAmount] = useState<number | string>(client.amount ?? 125);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
    setCompany(client.company);
    setPriority(client.priority);
    setPaymentType(client.paymentType || "per_hour");
    setAmount(client.amount ?? 125);
  }, [client]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !email || !phone || !company) return;

    try {
      setIsSubmitting(true);
      await onSave(client.id, {
        name,
        email,
        phone,
        address,
        company,
        priority,
        paymentType,
        amount: Number(amount) || 0,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-v2-neutral-600/75 backdrop-blur-xs"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="relative z-10 w-full max-w-xl rounded-2xl border border-v2-neutral-400 bg-v2-neutral-600 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-v2-neutral-500 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-v2-neutral-100 text-v2-neutral-600 shadow-sm">
              <PencilLine className="size-4.5" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-v2-neutral-100">
                Edit Client Profile
              </h3>
              <p className="text-xs text-v2-neutral-400">
                Update account information, rate, and priority level.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-v2-neutral-500 text-v2-neutral-400 hover:bg-v2-neutral-500 hover:text-v2-neutral-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                Company *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                Priority Tier
              </label>
              <Select
                value={String(priority)}
                onValueChange={(val) => setPriority(Number(val))}
              >
                <SelectTrigger className="h-10 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                  <SelectValue placeholder="Select priority..." />
                </SelectTrigger>
                <SelectContent className="z-[100] rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                  {CLIENT_PRIORITY_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={String(opt.value)}
                      className="cursor-pointer rounded-lg py-2 text-xs text-v2-neutral-600 focus:bg-v2-neutral-200/80 focus:text-v2-neutral-600"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2 rounded-full ${
                            opt.value === ClientPriority.HIGH
                              ? "bg-rose-500"
                              : opt.value === ClientPriority.MEDIUM
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                        />
                        <span>{opt.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                Billing Structure
              </label>
              <Select
                value={paymentType}
                onValueChange={(val) => setPaymentType(val)}
              >
                <SelectTrigger className="h-10 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                  <SelectValue placeholder="Select billing structure..." />
                </SelectTrigger>
                <SelectContent className="z-[100] rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                  <SelectItem
                    value="per_hour"
                    className="cursor-pointer rounded-lg py-2 text-xs text-v2-neutral-600 focus:bg-v2-neutral-200/80 focus:text-v2-neutral-600"
                  >
                    Per Hour
                  </SelectItem>
                  <SelectItem
                    value="each_milestone"
                    className="cursor-pointer rounded-lg py-2 text-xs text-v2-neutral-600 focus:bg-v2-neutral-200/80 focus:text-v2-neutral-600"
                  >
                    Each Milestone
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                Rate ($)
              </label>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-v2-neutral-500">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
