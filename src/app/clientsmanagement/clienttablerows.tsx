"use client";

import React from "react";

type Props = {
  client: any;
  deleteClient: (id: number) => void;
};

const ClientRow = ({
  client,
  deleteClient,
}: Props) => {
  return (
    <>
      <div className="grid grid-cols-5 items-center border-b px-6 py-5">
        <div className="flex items-center gap-4">
          <img
            src={client.image}
            alt={client.name}
            className="h-12 w-12 rounded-full"
          />

          <p>{client.name}</p>
        </div>

        <div>{client.email}</div>

        <div>{client.company}</div>

        <div>
          <span
            className={`rounded-full px-4 py-1 text-xs ${
              client.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {client.status}
          </span>
        </div>

        <div className="flex gap-4">
          <button>✏️</button>

          {/* ✅ REAL DELETE */}
          <button
            onClick={() =>
              deleteClient(client.id)
            }
          >
            🗑️
          </button>
        </div>
      </div>
    </>
  );
};

export default ClientRow;