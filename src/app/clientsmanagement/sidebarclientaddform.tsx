"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface ClientType {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  image: string;
}

interface AddClientSidebarProps {
  addClient: (client: ClientType) => void;
}

const AddClientSidebar = ({
  addClient,
}: AddClientSidebarProps) => {

  // States
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [status, setStatus] =
    useState<string>("Active");

  // Add Client Function
  const handleAddClient = () => {
    if (
      !name ||
      !email ||
      !phone ||
      !company
    ) {
      return;
    }

    const newClient: ClientType = {
      id: Date.now(),
      name,
      email,
      phone,
      company,
      status,
      image: `https://i.pravatar.cc/100?u=${email}`,
    };

    addClient(newClient);

    // Clear Form
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setStatus("Active");
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-6">

        {/* Heading */}
        <h2 className="mb-6 text-lg font-semibold text-black">
          Add New Client
        </h2>

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
              className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Status
            </label>

            <div className="relative">

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="h-12 w-full appearance-none rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Pending">
                  Pending
                </option>
              </select>

              <ChevronDown
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddClient}
            className="h-12 w-full rounded-xl bg-black text-sm font-medium text-white transition-all hover:opacity-90"
          >
            Add Client
          </button>

          {/* Clear Button */}
          <button
            onClick={() => {
              setName("");
              setEmail("");
              setPhone("");
              setCompany("");
              setStatus("Active");
            }}
            className="h-12 w-full rounded-xl border border-gray-200 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50"
          >
            Clear Form
          </button>
        </div>
      </div>
    </>
  );
};

export default AddClientSidebar;