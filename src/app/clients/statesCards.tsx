"use client";

import React from "react";
import { ClientPriority } from "../enums/clientPriority.enum";
import { ClientType } from "./page";

type Props = {
  clients: ClientType[];
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
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        <div className="rounded-2xl border bg-white p-5 sm:p-6">
          <h3 className="text-3xl font-bold sm:text-4xl">
            {clients.length}
          </h3>

          <p>Total Clients</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 sm:p-6">
          <h3 className="text-3xl font-bold sm:text-4xl"> 
            {highPriorityClients}
          </h3>

          <p>High Priority</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 sm:p-6">
          <h3 className="text-3xl font-bold sm:text-4xl">
            {mediumPriorityClients}
          </h3>

          <p>Medium Priority</p>
        </div>
      </div>
    </>
  );
};

export default StatsCards;
