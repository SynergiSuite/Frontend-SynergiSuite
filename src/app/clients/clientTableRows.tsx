"use client";

import React from "react";
import { Pencil, Trash } from "lucide-react";
import { ClientPriority } from "../enums/clientPriority.enum";
import { ClientType } from "./page";

type Props = {
  client: ClientType;
  deleteClient: (id: string) => void;
  onSelectClient: (client: ClientType) => void;
  onEditClient: (client: ClientType) => void;
  canManageClients: boolean;
};

const ClientRow = ({
  client,
  deleteClient,
  onSelectClient,
  onEditClient,
  canManageClients,
}: Props) => {
  const getDisplayValue = (value?: string) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : "N/A";
  };

  const priorityValue = Number(client?.priority);
  const priorityLabel =
    priorityValue === ClientPriority.HIGH
      ? "High"
      : priorityValue === ClientPriority.MEDIUM
        ? "Medium"
        : priorityValue === ClientPriority.LOW
          ? "Low"
          : "N/A";

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelectClient(client)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelectClient(client);
          }
        }}
        className="grid w-full gap-4 border-b border-white/[0.08] px-4 py-4 text-left transition-all duration-300 hover:bg-white/[0.03] hover:translate-x-1 focus:bg-white/[0.03] focus:outline-none last:border-b-0 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] md:items-center md:gap-0 md:px-6 md:py-5"
      >
        <div className="min-w-0">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
            Client Name
          </p>
          <p className="truncate font-semibold text-white text-sm" title={getDisplayValue(client?.name)}>
            {getDisplayValue(client?.name)}
          </p>
        </div>

        <div className="min-w-0">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
            Email
          </p>
          <div className="truncate text-white/70 text-sm" title={getDisplayValue(client?.email)}>
            {getDisplayValue(client?.email)}
          </div>
        </div>

        <div className="min-w-0">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
            Company
          </p>
          <div className="truncate text-white/70 text-sm" title={getDisplayValue(client?.company)}>
            {getDisplayValue(client?.company)}
          </div>
        </div>

        <div className="min-w-0">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
            Priority
          </p>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-semibold border ${
              priorityLabel === "High"
                ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                : priorityLabel === "Medium"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                  : priorityLabel === "Low"
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : "bg-white/5 text-white/40 border-white/10"
            }`}
            title={priorityLabel}
          >
            <span className={`h-1 w-1 rounded-full ${
              priorityLabel === "High" ? "bg-red-400" : priorityLabel === "Medium" ? "bg-amber-400" : "bg-cyan-400"
            }`} />
            {priorityLabel}
          </span>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-3 md:justify-start">
          <p className="text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
            Actions
          </p>
          {canManageClients ? (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                aria-label="Edit client"
                onClick={(event) => {
                  event.stopPropagation();
                  onEditClient(client);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/60 transition-all duration-200 hover:bg-white/[0.08] hover:border-[#5271ff]/30 hover:text-white"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              </button>

              <button
                type="button"
                aria-label="Delete client"
                onClick={(event) => {
                  event.stopPropagation();
                  deleteClient(client.id);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/60 transition-all duration-200 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
              >
                <Trash className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <span className="rounded-md border border-white/[0.04] bg-white/[0.02] px-2 py-0.5 text-xs text-white/30">
              No Access
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientRow;

