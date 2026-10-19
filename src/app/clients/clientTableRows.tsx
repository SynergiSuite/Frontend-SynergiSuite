"use client";

import React from "react";
import { Building2, DollarSign, Mail, MapPin, Pencil, Phone, Trash2 } from "lucide-react";
import { ClientPriority } from "../enums/clientPriority.enum";
import type { ClientType } from "./page";

type Props = {
  client: ClientType;
  deleteClient: (id: string) => void;
  onSelectClient: (client: ClientType) => void;
  onEditClient: (client: ClientType) => void;
  canManageClients: boolean;
};

export default function ClientRow({
  client,
  deleteClient,
  onSelectClient,
  onEditClient,
  canManageClients,
}: Props) {
  const priorityValue = Number(client?.priority);
  const priorityLabel =
    priorityValue === ClientPriority.HIGH
      ? "High"
      : priorityValue === ClientPriority.MEDIUM
      ? "Medium"
      : priorityValue === ClientPriority.LOW
      ? "Low"
      : "Standard";

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "High":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Low":
        return "bg-sky-50 text-sky-700 border-sky-200";
      default:
        return "bg-v2-neutral-200 text-v2-neutral-600 border-v2-neutral-300";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "CL";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  };

  const paymentLabel =
    client.paymentType === "each_milestone"
      ? "Milestone"
      : "Hourly";

  return (
    <tr
      onClick={() => onSelectClient(client)}
      className="group cursor-pointer border-b border-v2-neutral-200/70 transition-colors hover:bg-v2-neutral-200/40 last:border-b-0"
    >
      {/* Client Name & Avatar */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-v2-neutral-200 text-xs font-bold text-v2-neutral-600 shadow-xs">
            {getInitials(client.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-v2-neutral-600">
              {client.name || "Unnamed Client"}
            </p>
            {client.email && (
              <p className="flex items-center gap-1 truncate text-xs text-v2-neutral-400">
                <Mail className="size-3 shrink-0" />
                <span className="truncate">{client.email}</span>
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Company & Address */}
      <td className="px-5 py-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-sm font-medium text-v2-neutral-600">
            <Building2 className="size-3.5 shrink-0 text-v2-neutral-400" />
            <span className="truncate">{client.company || "Direct Individual"}</span>
          </p>
          {client.address && (
            <p className="flex items-center gap-1 truncate text-xs text-v2-neutral-400 mt-0.5">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{client.address}</span>
            </p>
          )}
        </div>
      </td>

      {/* Phone / Contact */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-xs text-v2-neutral-600">
          <Phone className="size-3.5 shrink-0 text-v2-neutral-400" />
          <span className="truncate font-medium">{client.phone || "—"}</span>
        </div>
      </td>

      {/* Priority Pill */}
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getPriorityBadge(
            priorityLabel
          )}`}
        >
          <span
            className={`size-1.5 rounded-full ${
              priorityLabel === "High"
                ? "bg-rose-500"
                : priorityLabel === "Medium"
                ? "bg-amber-500"
                : "bg-sky-500"
            }`}
          />
          {priorityLabel}
        </span>
      </td>

      {/* Billing & Rate */}
      <td className="px-5 py-4">
        <div className="inline-flex items-center gap-1 rounded-md border border-v2-neutral-300 bg-v2-neutral-200/50 px-2 py-0.5 text-xs font-medium text-v2-neutral-600">
          <DollarSign className="size-3 text-v2-neutral-400" />
          <span>
            {client.amount ? `$${client.amount}` : "Standard"} / {paymentLabel}
          </span>
        </div>
      </td>

      {/* Action Buttons */}
      <td className="px-5 py-4 text-right">
        {canManageClients ? (
          <div
            className="flex items-center justify-end gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Edit client"
              onClick={() => onEditClient(client)}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-500 transition-colors hover:border-v2-neutral-400 hover:bg-v2-neutral-200 hover:text-v2-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v2-neutral-400 cursor-pointer"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Delete client"
              onClick={() => deleteClient(client.id)}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-v2-neutral-400">View only</span>
        )}
      </td>
    </tr>
  );
}
