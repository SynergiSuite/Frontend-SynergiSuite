"use client";

import React from "react";

import TableHeader from "./clientTableHeader";
import ClientRow from "./clientTableRows";

type Props = {
  clients: any[];
  deleteClient: (id: string) => void;
  onSelectClient: (client: any) => void;
  onEditClient: (client: any) => void;
  canManageClients: boolean;
};

const ClientsTable = ({
  clients,
  deleteClient,
  onSelectClient,
  onEditClient,
  canManageClients,
}: Props) => {
  return (
    <>
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <TableHeader />

        {clients.length > 0 ? (
          <div className="flex-1">
            {clients.map((client) => (
              <ClientRow
                key={client.id}
                client={client}
                deleteClient={deleteClient}
                onSelectClient={onSelectClient}
                onEditClient={onEditClient}
                canManageClients={canManageClients}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center px-6 py-12 text-sm text-gray-500">
            No clients found
          </div>
        )}
      </div>
    </>
  );
};

export default ClientsTable;
