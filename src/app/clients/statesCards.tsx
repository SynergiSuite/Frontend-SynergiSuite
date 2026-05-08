"use client";

import React from "react";
import { ClientPriority } from "../enums/clientPriority.enum";

type Props = {
  clients: any[];
};

const StatsCards = ({ clients }: Props) => {
  const highPriorityClients = clients.filter(
    (client) => Number(client.priority) === ClientPriority.HIGH
  ).length;

  const mediumPriorityClients = clients.filter(
    (client) => Number(client.priority) === ClientPriority.MEDIUM
  ).length;

  return (
    <>
      <div className="mb-6 grid grid-cols-3 gap-5">
        <div className="rounded-2xl border p-6 bg-white">
          <h3 className="text-4xl font-bold">
            {clients.length}
          </h3>

          <p>Total Clients</p>
        </div>

        <div className="rounded-2xl border p-6 bg-white">
          <h3 className="text-4xl font-bold"> 
            {highPriorityClients}
          </h3>

          <p>High Priority</p>
        </div>

        <div className="rounded-2xl border p-6 bg-white">
          <h3 className="text-4xl font-bold">
            {mediumPriorityClients}
          </h3>

          <p>Medium Priority</p>
        </div>
      </div>
    </>
  );
};

export default StatsCards;
