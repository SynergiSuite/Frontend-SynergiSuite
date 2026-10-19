"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import type { CreateClientDto } from "./dtos/createClient.dto";

interface AddClientSidebarProps {
  addClient: (client: CreateClientDto) => Promise<void>;
}

export default function AddClientSidebar({ addClient }: AddClientSidebarProps) {
  const [name, setName] = useState<string>("" );
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [priority, setPriority] = useState<ClientPriority>(ClientPriority.HIGH);
  const [paymentType, setPaymentType] = useState<string>("per_hour");
  const [amount, setAmount] = useState<number | string>(125);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddClient = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (!name || !email || !phone || !company) {
      return;
    }

    const newClient: CreateClientDto = {
      name,
      email,
      phone,
      address,
      company,
      priority,
      paymentType,
      amount: Number(amount) || 0,
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
      setPaymentType("per_hour");
      setAmount(125);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full border-v2-neutral-200 bg-v2-neutral-100 shadow-sm">
      <CardHeader className="border-b border-v2-neutral-200 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-v2-neutral-200 text-v2-neutral-600">
            <PlusCircle className="size-4.5" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-v2-neutral-600">
              Quick Add Client
            </h3>
            <p className="text-xs text-v2-neutral-400">
              Register a client directly into the directory
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleAddClient} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-v2-neutral-600">
              Client Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-9 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none placeholder:text-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-v2-neutral-600">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="client@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-9 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none placeholder:text-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-v2-neutral-600">
              Phone Number *
            </label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="h-9 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none placeholder:text-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
            />
          </div>

          {/* Company */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-v2-neutral-600">
              Company *
            </label>
            <input
              type="text"
              placeholder="Company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="h-9 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none placeholder:text-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
            />
          </div>

          {/* Address */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-v2-neutral-600">
              Address
            </label>
            <input
              type="text"
              placeholder="e.g. New York, NY"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-9 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none placeholder:text-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
            />
          </div>

          {/* Priority & Payment Type */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-v2-neutral-600">
                Priority
              </label>
              <Select
                value={String(priority)}
                onValueChange={(val) =>
                  setPriority(Number(val) as ClientPriority)
                }
              >
                <SelectTrigger className="h-9 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-2.5 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                  <SelectValue placeholder="Priority..." />
                </SelectTrigger>
                <SelectContent className="z-[100] rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                  {CLIENT_PRIORITY_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={String(opt.value)}
                      className="cursor-pointer rounded-lg py-1.5 text-xs text-v2-neutral-600 focus:bg-v2-neutral-200/80 focus:text-v2-neutral-600"
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
              <label className="mb-1 block text-xs font-semibold text-v2-neutral-600">
                Billing
              </label>
              <Select
                value={paymentType}
                onValueChange={(val) => setPaymentType(val)}
              >
                <SelectTrigger className="h-9 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-2.5 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                  <SelectValue placeholder="Billing..." />
                </SelectTrigger>
                <SelectContent className="z-[100] rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                  <SelectItem
                    value="per_hour"
                    className="cursor-pointer rounded-lg py-1.5 text-xs text-v2-neutral-600 focus:bg-v2-neutral-200/80 focus:text-v2-neutral-600"
                  >
                    Hourly
                  </SelectItem>
                  <SelectItem
                    value="each_milestone"
                    className="cursor-pointer rounded-lg py-1.5 text-xs text-v2-neutral-600 focus:bg-v2-neutral-200/80 focus:text-v2-neutral-600"
                  >
                    Milestone
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rate */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-v2-neutral-600">
              Billing Rate ($)
            </label>
            <input
              type="number"
              min="0"
              placeholder="125"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-9 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none placeholder:text-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-xs font-semibold"
            >
              {isSubmitting ? "Adding..." : "Add Client"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
