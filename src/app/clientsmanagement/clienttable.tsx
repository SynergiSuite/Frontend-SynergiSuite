"use client";

import React from "react";

import TableHeader from "./clienttableheader";
import ClientRow from "./clienttablerows";

type Props = {
  clients: any[];
  deleteClient: (id: number) => void;
};

const ClientsTable = ({
  clients,
  deleteClient,
}: Props) => {
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <TableHeader />

        {clients.map((client) => (
          <ClientRow
            key={client.id}
            client={client}
            deleteClient={deleteClient}
          />
        ))}
      </div>
    </>
  );
};

export default ClientsTable;