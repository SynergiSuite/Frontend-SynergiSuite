"use client";

import React, { useState } from "react";
import { ChevronDown, PlusCircle } from "lucide-react";
import {
  ClientPriority,
  CLIENT_PRIORITY_OPTIONS,
} from "../enums/clientPriority.enum";
import { CreateClientDto } from "./dtos/createClient.dto";

interface AddClientSidebarProps {
  addClient: (client: CreateClientDto) => Promise<void>;
}

const AddClientSidebar = ({
  addClient,
}: AddClientSidebarProps) => {

  // States
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [priority, setPriority] =
    useState<ClientPriority>(ClientPriority.HIGH);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Client Function
  const handleAddClient = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (
      !name ||
      !email ||
      !phone ||
      !company
    ) {
      return;
    }

    const newClient: CreateClientDto = {
      name,
      email,
      phone,
      address,
      company,
      priority,
    };

    try {
      setIsSubmitting(true);
      await addClient(newClient);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setCompany("");
      setPriority(ClientPriority.HIGH);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 p-5 sm:p-6 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        {/* Glow decoration */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#5271ff]/10 blur-2xl" />

        {/* Heading */}
        <div className="mb-6 border-b border-white/[0.08] pb-3">
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-[#5271ff]" />
            Add New Client
          </h2>
          <p className="text-[10px] uppercase tracking-wider font-semibold text-white/30 mt-1">
            Register a new client account
          </p>
        </div>

        <form className="flex flex-1 flex-col justify-between" onSubmit={handleAddClient}>
          <div className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter client name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                Email Address
              </label>

              <input
                type="email"
                placeholder="client@company.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                Phone Number
              </label>

              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                required
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
              />
            </div>

            {/* Address */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                Address
              </label>

              <input
                type="text"
                placeholder="123 Market Street, NY"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
              />
            </div>

            {/* Company */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                Company
              </label>

              <input
                type="text"
                placeholder="Company name"
                value={company}
                onChange={(e) =>
                  setCompany(e.target.value)
                }
                required
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                Priority
              </label>

              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(Number(e.target.value) as ClientPriority)
                  }
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

          <div className="mt-8 space-y-3 pt-4 border-t border-white/[0.08]">
            {/* Add Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] text-sm font-semibold text-white transition-all duration-300 hover:opacity-95 hover:shadow-[0_0_15px_rgba(82,113,255,0.35)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Adding..." : "Add Client"}
            </button>

            {/* Clear Button */}
            <button
              type="button"
              onClick={() => {
                setName("");
                setEmail("");
                setPhone("");
                setAddress("");
                setCompany("");
                setPriority(ClientPriority.HIGH);
              }}
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm font-semibold text-white/70 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08] hover:text-white hover:border-white/20 active:scale-95"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddClientSidebar;

