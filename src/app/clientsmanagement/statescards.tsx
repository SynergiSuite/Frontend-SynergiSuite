"use client";

import React from "react";

type Props = {
  clients: any[];
};

const StatsCards = ({ clients }: Props) => {
  const activeClients = clients.filter(
    (client) => client.status === "Active"
  ).length;

  const pendingClients = clients.filter(
    (client) => client.status === "Pending"
  ).length;

  return (
    <>
      <div className="mb-6 grid grid-cols-3 gap-5">
        <div className="rounded-2xl border p-6">
          <h3 className="text-4xl font-bold">
            {clients.length}
          </h3>

          <p>Total Clients</p>
        </div>

        <div className="rounded-2xl border p-6">
          <h3 className="text-4xl font-bold">
            {activeClients}
          </h3>

          <p>Active</p>
        </div>

        <div className="rounded-2xl border p-6">
          <h3 className="text-4xl font-bold">
            {pendingClients}
          </h3>

          <p>Pending</p>
        </div>
      </div>
    </>
  );
};

export default StatsCards;