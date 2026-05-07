"use client";

import React, { useMemo, useState } from "react";

import Header from "./header";
import SidebarForm from "./sidebarclientaddform";
import SubHeader from "./subheadingsearchbar";
import StatsCards from "./statescards";
import ClientsTable from "./clienttable";
import Pagination from "./footer";

export type ClientType = {
  id: number;
  name: string;
  email: string;
  company: string;
  status: string;
  image: string;
};

const initialClients: ClientType[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@techcorp.com",
    company: "TechCorp",
    status: "Active",
    image: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael@innovate.io",
    company: "Innovate",
    status: "Pending",
    image: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@design.com",
    company: "Design Studio",
    status: "Active",
    image: "https://i.pravatar.cc/100?img=3",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david@startup.com",
    company: "Startup Inc",
    status: "Active",
    image: "https://i.pravatar.cc/100?img=4",
  },
  {
    id: 5,
    name: "Robert Fox",
    email: "robert@agency.com",
    company: "Agency",
    status: "Pending",
    image: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: 6,
    name: "Jessica Lee",
    email: "jessica@media.com",
    company: "Media House",
    status: "Active",
    image: "https://i.pravatar.cc/100?img=6",
  },
];

const ClientManagementPage = () => {
  // ✅ DYNAMIC STATE
  const [clients, setClients] =
    useState<ClientType[]>(initialClients);

  // ✅ SEARCH STATE
  const [search, setSearch] = useState("");

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;

  // ✅ FILTERED CLIENTS
  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [clients, search]);

  // ✅ PAGINATION LOGIC
  const totalPages = Math.ceil(
    filteredClients.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentClients = filteredClients.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ✅ ADD CLIENT FUNCTION
  const addClient = (client: ClientType) => {
    setClients((prev) => [client, ...prev]);
  };

  // ✅ DELETE CLIENT
  const deleteClient = (id: number) => {
    setClients((prev) =>
      prev.filter((client) => client.id !== id)
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#f7f7f7] p-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <Header />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
            <SidebarForm addClient={addClient} />

            <div>
              <SubHeader
                search={search}
                setSearch={setSearch}
              />

              <StatsCards clients={clients} />

              <ClientsTable
                clients={currentClients}
                deleteClient={deleteClient}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientManagementPage;