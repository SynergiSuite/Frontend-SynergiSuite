"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";

import SidebarForm from "./sidebarClientAddForm";
import SubHeader from "./subHeadingSearchbar";
import StatsCards from "./statesCards";
import ClientsTable from "./clientTable";
import Pagination from "./footer";
import { getClientsApi } from "../projects/apis/getAllClients";
import { createClientApi } from "./apis/createClient";
import { editClientApi } from "./apis/editClient";
import { deleteClientApi } from "./apis/deleteClient";
import { GetAllClientsResponseDto } from "./dtos/getAllClientsResponse.dto";
import LoaderCustom from "@/components/ui/loader-custom";
import { toast } from "sonner";
import { ClientPriority } from "../enums/clientPriority.enum";
import { CreateClientDto } from "./dtos/createClient.dto";
import { EditClientDto } from "./dtos/editClient.dto";
import EditClientModal from "./editClientModal";
import DeleteClientModal from "./deleteClientModal";
import { CookieManager } from "@/lib/cookieManager";
import ClientDetailModal from "./clientDetail";

export type ClientType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  priority: number;
  image: string;
};

const mapClientResponse = (
  client: GetAllClientsResponseDto,
  index: number,
  fallbackId?: string
): ClientType => ({
  id: client.id ?? fallbackId ?? String(index + 1),
  name: client.name ?? "",
  email: client.email ?? "",
  phone: client.phoneNumber ?? client.phone ?? "",
  company: client.company ?? "",
  address: client.address ?? "",
  priority: client.priority ?? ClientPriority.MEDIUM,
  image: `https://i.pravatar.cc/100?u=${client.email ?? client.name ?? index}`,
});

const ClientManagementPage = () => {
  // ✅ DYNAMIC STATE
  const [clients, setClients] =
    useState<ClientType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);
  const [detailClient, setDetailClient] = useState<ClientType | null>(null);
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [role, setRole] = useState("");

  // ✅ SEARCH STATE
  const [search, setSearch] = useState("");

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;
  const allowedRoles = ["manager", "founder", "admin"];
  const normalizedRole = role.trim().toLowerCase();
  const canManageClients = allowedRoles.includes(normalizedRole);

  // ✅ FILTERED CLIENTS
  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      [client.name, client.email, client.company, client.phone, client.address]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [clients, search]);

  useEffect(() => {
    const cookieRole = CookieManager("get", "role");
    setRole((cookieRole as string) ?? "");
  }, []);

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      try {
        const response = await getClientsApi();
        const mappedClients = response.map((client, index) =>
          mapClientResponse(client, index)
        );
        setClients(mappedClients);
      } catch (error) {
        toast.error("Failed to fetch clients" + error);
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  useEffect(() => {
    if (!canManageClients) {
      setSelectedClient(null);
      setDeleteClientId(null);
    }
  }, [canManageClients]);

  // ✅ PAGINATION LOGIC
  const totalPages = Math.max(
    1,
    Math.ceil(filteredClients.length / itemsPerPage)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentClients = filteredClients.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ✅ ADD CLIENT FUNCTION
  const addClient = async (payload: CreateClientDto) => {
    try {
      const response = await createClientApi(payload);
      const mappedClient = mapClientResponse(
        response as GetAllClientsResponseDto,
        Date.now()
      );
      setClients((prev) => [mappedClient, ...prev]);
      toast.success("Client created successfully");
    } catch (error) {
      toast.error("Failed to create client" + error);
      throw error;
    }
  };

  // ✅ DELETE CLIENT
  const deleteClient = async (id: string) => {
    try {
      await deleteClientApi(id);
      setClients((prev) =>
        prev.filter((client) => client.id !== id)
      );
      toast.success("Client deleted successfully");
    } catch (error) {
      toast.error("Failed to delete client" + error);
      throw error;
    }
  };

  const handleEditClient = async (id: string, payload: EditClientDto) => {
    try {
      const response = await editClientApi(id, payload);
      const mappedClient = mapClientResponse(
        response as GetAllClientsResponseDto,
        0,
        id
      );

      setClients((prev) =>
        prev.map((client) =>
          client.id === id
            ? {
                ...client,
                ...mappedClient,
              }
            : client
        )
      );
      toast.success("Client updated successfully");
    } catch (error) {
      toast.error("Failed to update client" + error);
      throw error;
    }
  };

  return (
    <>
      {isLoading ? (
        <LoaderCustom />
      ) : (
        <div className="h-[calc(100vh-140px)]">
          <div
            className={`grid h-full grid-cols-1 items-stretch gap-8 ${
              canManageClients
                ? "lg:grid-cols-[minmax(420px,1.2fr)_minmax(0,0.8fr)]"
                : ""
            }`}
          >
              <div className="flex h-full flex-col">
                <SubHeader
                  search={search}
                  setSearch={setSearch}
                />

                <StatsCards clients={clients} />

                <div className="min-h-0 flex-1">
                  <ClientsTable
                    clients={currentClients}
                    deleteClient={setDeleteClientId}
                    onSelectClient={setDetailClient}
                    onEditClient={setSelectedClient}
                    canManageClients={canManageClients}
                  />
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </div>
              
              {canManageClients ? (
                <div className="h-full">
                  <SidebarForm addClient={addClient} />
                </div>
              ) : null}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedClient && canManageClients ? (
          <EditClientModal
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
            onSave={handleEditClient}
          />
        ) : null}
      </AnimatePresence>

      <ClientDetailModal
        client={detailClient}
        open={detailClient !== null}
        onClose={() => setDetailClient(null)}
      />

      <DeleteClientModal
        open={deleteClientId !== null && canManageClients}
        clientId={deleteClientId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteClientId(null);
          }
        }}
        onConfirm={async (clientId) => {
          await deleteClient(clientId);
          setDeleteClientId(null);
        }}
      />
    </>
  );
};

export default ClientManagementPage;
