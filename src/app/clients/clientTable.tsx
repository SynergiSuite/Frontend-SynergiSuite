"use client";

import React from "react";
import { Building2 } from "lucide-react";
import TableHeader from "./clientTableHeader";
import ClientRow from "./clientTableRows";
import type { ClientType } from "./page";

type Props = {
  clients: ClientType[];
  deleteClient: (id: string) => void;
  onSelectClient: (client: ClientType) => void;
  onEditClient: (client: ClientType) => void;
  canManageClients: boolean;
};

export default function ClientsTable({
  clients,
  deleteClient,
  onSelectClient,
  onEditClient,
  canManageClients,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-v2-neutral-600">
        <TableHeader />
        <tbody className="divide-y divide-v2-neutral-200/60">
          {clients.length > 0 ? (
            clients.map((client) => (
              <ClientRow
                key={client.id}
                client={client}
                deleteClient={deleteClient}
                onSelectClient={onSelectClient}
                onEditClient={onEditClient}
                canManageClients={canManageClients}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="grid size-12 place-items-center rounded-2xl bg-v2-neutral-200 text-v2-neutral-500 mb-3">
                    <Building2 className="size-6" />
                  </div>
                  <p className="text-sm font-semibold text-v2-neutral-600">
                    No clients found
                  </p>
                  <p className="mt-1 text-xs text-v2-neutral-400">
                    Try adjusting your search criteria or register a new client.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
