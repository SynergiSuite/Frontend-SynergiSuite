"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import {
  Building2,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CookieManager } from "@/lib/cookieManager";
import { canManageClients } from "@/lib/rolePermissions";
import { ClientPriority } from "../enums/clientPriority.enum";
import { getClientsApi } from "../projects/apis/getAllClients";
import { createClientApi } from "./apis/createClient";
import { editClientApi } from "./apis/editClient";
import { deleteClientApi } from "./apis/deleteClient";
import type { CreateClientDto } from "./dtos/createClient.dto";
import type { EditClientDto } from "./dtos/editClient.dto";
import type { GetAllClientsResponseDto } from "./dtos/getAllClientsResponse.dto";

import StatsCards from "./statesCards";
import ClientsTable from "./clientTable";
import Pagination from "./footer";
import CreateClientModal from "./createClientModal";
import EditClientModal from "./editClientModal";
import DeleteClientModal from "./deleteClientModal";
import ClientDetailModal from "./clientDetail";

export type ClientType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  priority: number;
  paymentType: string;
  amount: number;
  image: string;
  created_at?: string;
  updated_at?: string;
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
  paymentType: client.paymentType ?? "per_hour",
  amount: typeof client.amount === "number" ? client.amount : Number(client.amount) || 0,
  image: `https://i.pravatar.cc/100?u=${client.email ?? client.name ?? index}`,
});

const PAGE_SIZE = 6;

export default function ClientsPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modals & Selection
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);
  const [detailClient, setDetailClient] = useState<ClientType | null>(null);
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState("");

  const canManage = canManageClients(userRole);

  // Read role from cookie
  useEffect(() => {
    const roleCookie =
      CookieManager("get", "primary_role") || CookieManager("get", "role");
    setUserRole(String(roleCookie || ""));
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  // Load clients data
  const loadClients = useCallback(async () => {
    setIsDataLoading(true);
    setDataError(null);

    try {
      const response = await getClientsApi();
      const mapped = response.map((client, index) =>
        mapClientResponse(client, index)
      );
      setClients(mapped);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load clients list.";
      setDataError(msg);
      toast.error(msg);
      setClients([]);
    } finally {
      setIsDataLoading(false);
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadClients();
  }, [loadClients, reloadKey]);

  const refresh = () => setReloadKey((prev) => prev + 1);

  // GSAP entrance animation
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (
      isInitialLoading ||
      !root ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.from("[data-clients-section]", {
        autoAlpha: 0,
        y: 12,
        duration: 0.45,
        stagger: 0.08,
        ease: "power2.out",
      });
    }, root);

    return () => context.revert();
  }, [isInitialLoading]);

  // Filter clients by search
  const filteredClients = useMemo(() => {
    if (!debouncedSearch) return clients;
    const q = debouncedSearch.toLowerCase();
    return clients.filter((client) =>
      [client.name, client.email, client.company, client.phone, client.address]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [clients, debouncedSearch]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentClients = filteredClients.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // Actions
  const handleAddClient = async (payload: CreateClientDto) => {
    try {
      const response = await createClientApi(payload);
      const mapped = mapClientResponse(
        response as GetAllClientsResponseDto,
        Date.now()
      );
      setClients((prev) => [mapped, ...prev]);
      toast.success("Client account registered successfully.");
      setIsCreateOpen(false);
    } catch (err) {
      toast.error("Failed to register client: " + err);
      throw err;
    }
  };

  const handleEditClient = async (id: string, payload: EditClientDto) => {
    try {
      const response = await editClientApi(id, payload);
      const mapped = mapClientResponse(
        response as GetAllClientsResponseDto,
        0,
        id
      );

      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...mapped } : c))
      );
      setSelectedClient(null);
      toast.success("Client profile updated successfully.");
    } catch (err) {
      toast.error("Failed to update client: " + err);
      throw err;
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteClientApi(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
      setDeleteClientId(null);
      toast.success("Client account deleted.");
    } catch (err) {
      toast.error("Failed to delete client: " + err);
      throw err;
    }
  };

  return (
    <div ref={rootRef} className="min-h-full text-v2-neutral-100">
      <div className="flex flex-col gap-6">
        {/* Page Top Header */}
        <header
          data-clients-section
          className="flex flex-col gap-4 border-b border-v2-neutral-500 pb-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-100 sm:text-4xl">
              Clients
            </h1>
            <p className="mt-2 text-sm leading-6 text-v2-neutral-300">
              Manage client partnerships, contracts, billing structures, and strategic account priorities.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={isDataLoading}
              className="gap-1.5"
            >
              <RefreshCw
                className={`size-3.5 ${isDataLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>

            {canManage && (
              <Button
                type="button"
                size="sm"
                onClick={() => setIsCreateOpen(true)}
                className="gap-1.5 shadow-md"
              >
                <Plus className="size-4" />
                <span>Add Client</span>
              </Button>
            )}
          </div>
        </header>

        {/* State / KPI Cards */}
        <div data-clients-section>
          <StatsCards clients={clients} />
        </div>

        {/* Error State */}
        {dataError ? (
          <div data-clients-section>
            <Card className="border-v2-neutral-500 bg-v2-neutral-500/30 p-8 text-center">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <span className="grid size-12 place-items-center rounded-2xl bg-v2-neutral-200 text-v2-neutral-500 mb-3">
                  <Building2 className="size-6" />
                </span>
                <h3 className="text-base font-semibold text-v2-neutral-100">
                  Unable to load clients
                </h3>
                <p className="mt-1 text-xs text-v2-neutral-300 max-w-sm">
                  {dataError}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={refresh}
                  className="mt-4"
                >
                  <RefreshCw className="size-3.5 mr-1.5" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Main Client Table Card */
          <div data-clients-section>
            <Card className="relative min-w-0 border-v2-neutral-200 bg-v2-neutral-100 shadow-sm">
              <CardHeader className="border-b border-v2-neutral-200 pb-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-base font-semibold text-v2-neutral-600">
                        Client Directory
                      </h2>
                      <span className="inline-flex items-center rounded-full bg-v2-neutral-200 px-2.5 py-0.5 text-xs font-semibold text-v2-neutral-600">
                        {filteredClients.length}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-v2-neutral-400">
                      Overview of registered business accounts and key contact personnel.
                    </p>
                  </div>

                  {/* Search Filter */}
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-v2-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search clients..."
                      className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 pl-9 pr-3 text-xs text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative flex flex-1 flex-col p-0">
                {isDataLoading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-v2-neutral-100/85 backdrop-blur-[2px]">
                    <LoaderCircle className="size-5 animate-spin text-v2-neutral-600" />
                  </div>
                )}

                <ClientsTable
                  clients={currentClients}
                  deleteClient={setDeleteClientId}
                  onSelectClient={setDetailClient}
                  onEditClient={setSelectedClient}
                  canManageClients={canManage}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  totalItems={filteredClients.length}
                  itemsPerPage={PAGE_SIZE}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create Client Modal */}
      {isCreateOpen && canManage && (
        <CreateClientModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onAddClient={handleAddClient}
        />
      )}

      {/* Edit Client Modal */}
      {selectedClient && canManage && (
        <EditClientModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onSave={handleEditClient}
        />
      )}

      {/* Client Detail Modal */}
      <ClientDetailModal
        client={detailClient}
        open={detailClient !== null}
        onClose={() => setDetailClient(null)}
        onEdit={setSelectedClient}
        canManageClients={canManage}
      />

      {/* Delete Client Confirmation Modal */}
      <DeleteClientModal
        open={deleteClientId !== null && canManage}
        clientId={deleteClientId}
        onOpenChange={(open) => {
          if (!open) setDeleteClientId(null);
        }}
        onConfirm={handleDeleteClient}
      />
    </div>
  );
}
