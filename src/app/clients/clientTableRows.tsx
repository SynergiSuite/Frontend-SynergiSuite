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
        className="grid w-full grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] items-center border-b px-6 py-5 text-left transition hover:bg-slate-50/80 focus:outline-none focus:bg-slate-50/80 last:border-b-0"
      >
        <div className="min-w-0">
          <p className="truncate" title={getDisplayValue(client?.name)}>
            {getDisplayValue(client?.name)}
          </p>
        </div>

        <div className="min-w-0 truncate" title={getDisplayValue(client?.email)}>
          {getDisplayValue(client?.email)}
        </div>

        <div className="min-w-0 truncate" title={getDisplayValue(client?.company)}>
          {getDisplayValue(client?.company)}
        </div>

        <div className="min-w-0">
          <span
            className={`rounded-full px-4 py-1 text-xs ${
              priorityLabel === "High"
                ? "bg-red-100 text-red-700"
                : priorityLabel === "Medium"
                  ? "bg-amber-100 text-amber-700"
                  : priorityLabel === "Low"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
            }`}
            title={priorityLabel}
          >
            {priorityLabel}
          </span>
        </div>

        <div className="flex min-w-0 gap-2">
          {canManageClients ? (
            <>
              <button
                type="button"
                aria-label="Edit client"
                onClick={(event) => {
                  event.stopPropagation();
                  onEditClient(client);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                aria-label="Delete client"
                onClick={(event) => {
                  event.stopPropagation();
                  deleteClient(client.id);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          ) : (
            <span className="text-sm text-gray-400">No access</span>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientRow;
