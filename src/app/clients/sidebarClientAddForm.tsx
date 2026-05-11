"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
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
      <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">

        {/* Heading */}
        <h2 className="mb-6 text-lg font-semibold text-black">
          Add New Client
        </h2>

        <form className="flex flex-1 flex-col" onSubmit={handleAddClient}>
          <div className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
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
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
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
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
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
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Address */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Address
              </label>

              <input
                type="text"
                placeholder="123 Market Street, NY"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Company */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
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
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Priority
              </label>

              <div className="relative">

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(Number(e.target.value) as ClientPriority)
                  }
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

          <div className="mt-6 space-y-3 pt-2 lg:mt-auto lg:pt-6">
            {/* Add Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-black text-sm font-medium text-white transition-all hover:opacity-90"
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
              className="h-12 w-full rounded-xl border border-gray-200 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50"
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
