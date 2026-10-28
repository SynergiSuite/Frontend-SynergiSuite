"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import { gsap } from "gsap";
import { AlertCircle, Plus, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CookieManager } from "@/lib/cookieManager";
import { getAllProjectsApi } from "@/app/projects/apis/getAllProjectsApi";
import { getProjectsApi } from "@/app/projects/apis/getProjectsApi";
import { getClientsApi } from "@/app/projects/apis/getAllClients";
import { getClientDetailsApi } from "@/app/clients/apis/getClientDetails";
import {
  getClientFeedbackApi,
  getMyFeedbackApi,
  ClientFeedbackResponse,
  FeedbackPaginationMeta,
} from "./apis/getMyFeedbackApi";
import { updateClientFeedbackApi } from "./apis/updateClientFeedbackApi";
import TicketStatsCards from "./ticketStatsCards";
import TicketFilterBar from "./ticketFilterBar";
import TicketTable from "./ticketTable";
import FeedbackDetailModal from "./feedbackDetailModal";
import CreateTicketModal from "./createTicketModal";
import DeleteTicketModal from "./deleteTicketModal";
import {
  ClientFeedbackStatus,
  ClientFeedbackTargetType,
  ClientFeedbackType,
  type TicketItem,
} from "./types/ticket";

function normalizeStatus(raw?: string): ClientFeedbackStatus {
  const norm = (raw || "").trim().toLowerCase().replace(" ", "_");
  if (norm === "in_progress") return "in_progress";
  if (norm === "in_review") return "in_review";
  if (norm === "resolved") return "resolved";
  if (norm === "rejected") return "rejected";
  return "open";
}

function normalizeType(raw?: string): ClientFeedbackType {
  const norm = (raw || "").trim().toLowerCase();
  if (norm === "request") return "request";
  if (norm === "review") return "review";
  if (norm === "issue") return "issue";
  if (norm === "question") return "question";
  if (norm === "approval") return "approval";
  return "general";
}

function mapFeedbackItem(
  item: ClientFeedbackResponse,
  projectMap: Record<string, string>
): TicketItem {
  const rawId = item.id;
  const displayId =
    typeof rawId === "number" ? `TK-${rawId}` : String(rawId || "");

  const title =
    item.titleOfFeedback ||
    item.feedbackTitle ||
    item.title ||
    "Feedback Submission";
  const feedbackType = normalizeType(
    item.feedbackType || item.category || "general"
  );
  const targetType = (item.targetType ||
    item.target_type ||
    "project") as ClientFeedbackTargetType;
  const typeId = String(
    item.typeId ||
      item.type_id ||
      item.projectId ||
      item.project_id ||
      item.project?.id ||
      ""
  );

  const projectName =
    item.projectName ||
    item.project?.name ||
    (typeId ? projectMap[typeId] : undefined) ||
    "Workspace Project";

  const rating =
    typeof item.starRating === "number"
      ? item.starRating
      : typeof item.rating === "number"
      ? item.rating
      : undefined;

  return {
    id: displayId,
    rawId,
    titleOfFeedback: title,
    feedback: item.feedback || item.message || "",
    feedbackType,
    targetType,
    typeId,
    status: normalizeStatus(item.status),
    starRating: rating,
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    updatedAt: item.updatedAt || item.updated_at,
    client: item.client
      ? {
          id: String(item.client.id || ""),
          name: item.client.name,
          email: item.client.email,
          phone: item.client.phone,
          company: item.client.company,
        }
      : null,
    createdBy: item.createdBy,
    projectName,
  };
}

export default function ClientTicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Role management
  const [userRole, setUserRole] = useState<string>("");
  useEffect(() => {
    const roleCookie =
      CookieManager("get", "primary_role") || CookieManager("get", "role");
    setUserRole(String(roleCookie || "").toLowerCase());
  }, []);

  const isClient = userRole === "client";
  const isFounder = userRole.includes("founder");
  const isManager =
    userRole.includes("manager") ||
    userRole.includes("admin") ||
    userRole.includes("lead");
  const canManage = isFounder || isManager || !isClient;

  // Metadata & Lookups
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [projectMap, setProjectMap] = useState<Record<string, string>>({});
  const [clients, setClients] = useState<
    Array<{ id: string; name: string; company?: string }>
  >([]);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusTab, setStatusTab] = useState<"all" | ClientFeedbackStatus>(
    "all"
  );
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<FeedbackPaginationMeta | undefined>(
    undefined
  );

  // SearchParams & Deep Linking
  const searchParams = useSearchParams();
  const ticketIdParam = searchParams?.get("ticketId") || searchParams?.get("feedbackId");

  // Modals & Selection
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTicketId, setDeleteTicketId] = useState<string | number | null>(
    null
  );

  // Auto-open ticket from shared link
  useEffect(() => {
    if (ticketIdParam && tickets.length > 0 && !selectedTicket) {
      const match = tickets.find(
        (t) =>
          String(t.id) === String(ticketIdParam) ||
          String(t.rawId) === String(ticketIdParam)
      );
      if (match) {
        setSelectedTicket(match);
      } else {
        toast.error("You don't have access to this item");
      }
    }
  }, [ticketIdParam, tickets, selectedTicket]);

  // Debounced search
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim().toLowerCase());
    }, 250);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  // Load Projects and Clients for dropdowns
  const loadAuxiliaryData = useCallback(async () => {
    try {
      const roleCookie = String(
        CookieManager("get", "primary_role") ||
          CookieManager("get", "role") ||
          ""
      ).toLowerCase();
      const currentIsClient = roleCookie === "client" || userRole === "client";

      const clientUserId = String(
        CookieManager("get", "user-id") ||
          CookieManager("get", "user_id") ||
          ""
      ).trim();
      const clientEmail = String(
        CookieManager("get", "user-email") || ""
      ).toLowerCase().trim();
      const clientName = String(
        CookieManager("get", "user") || ""
      ).toLowerCase().trim();

      const [allProjectsRes, clientRes, clientProjectsRes] =
        await Promise.allSettled([
          currentIsClient ? Promise.resolve([]) : getAllProjectsApi(),
          getClientsApi(),
          currentIsClient
            ? getProjectsApi(1, undefined, "client")
            : Promise.resolve({ data: [] }),
        ]);

      const allClients =
        clientRes.status === "fulfilled" && Array.isArray(clientRes.value)
          ? clientRes.value
          : [];

      // Map clients for dropdown (used in staff create ticket modal)
      const mappedClients = allClients.map(
        (c: { id: string | number; name?: string; company?: string }) => ({
          id: String(c.id),
          name: c.name || "Unnamed Client",
          company: c.company,
        })
      );
      setClients(mappedClients);

      let clientProjectList: Array<{ id: string; name: string }> = [];

      if (currentIsClient) {
        // CLIENT POV: only load projects that belong to this specific client
        const matchedClient = allClients.find((c) => {
          const cId = String(c.id || "").trim();
          const cEmail = (c.email || "").toLowerCase().trim();
          const cName = (c.name || "").toLowerCase().trim();
          return (
            (clientUserId && cId === clientUserId) ||
            (clientEmail && cEmail === clientEmail) ||
            (clientName && cName === clientName)
          );
        });

        // 1. If client record matched, retrieve projects from client details
        if (matchedClient?.id) {
          try {
            const clientDetails = await getClientDetailsApi(
              String(matchedClient.id)
            );
            if (Array.isArray(clientDetails?.projects)) {
              for (const cp of clientDetails.projects) {
                if (cp.id && cp.name) {
                  clientProjectList.push({
                    id: String(cp.id),
                    name: cp.name,
                  });
                }
              }
            }
          } catch (detailErr) {
            console.warn(
              "Failed to fetch client details for projects:",
              detailErr
            );
          }
        }

        // 2. Also check getProjectsApi (scoped to client) response
        if (
          clientProjectsRes.status === "fulfilled" &&
          Array.isArray(clientProjectsRes.value?.data)
        ) {
          for (const p of clientProjectsRes.value.data) {
            const pClientId = String(p.client?.id || "").trim();
            const pClientEmail = (p.client?.email || "").toLowerCase().trim();
            const pClientName = (p.client?.name || "").toLowerCase().trim();

            const belongsToClient =
              !p.client ||
              (matchedClient && pClientId === String(matchedClient.id)) ||
              (clientUserId && pClientId === clientUserId) ||
              (clientEmail && pClientEmail === clientEmail) ||
              (clientName && pClientName === clientName);

            if (belongsToClient && p.id && p.name) {
              if (!clientProjectList.some((cp) => cp.id === String(p.id))) {
                clientProjectList.push({ id: String(p.id), name: p.name });
              }
            }
          }
        }
      } else {
        // NON-CLIENT POV: show all projects across the business
        if (
          allProjectsRes.status === "fulfilled" &&
          Array.isArray(allProjectsRes.value)
        ) {
          clientProjectList = allProjectsRes.value.map((p) => ({
            id: String(p.id),
            name: p.name,
          }));
        }
      }

      const pMap: Record<string, string> = {};
      clientProjectList.forEach((p) => {
        pMap[p.id] = p.name;
      });

      setProjects(clientProjectList);
      setProjectMap((prev) => ({ ...prev, ...pMap }));
    } catch (auxErr) {
      console.warn("Failed to load auxiliary projects/clients:", auxErr);
    }
  }, [userRole]);

  useEffect(() => {
    void loadAuxiliaryData();
  }, [loadAuxiliaryData]);

  // Ensure selectedProjectId resets if it does not belong to the client
  useEffect(() => {
    if (isClient && selectedProjectId !== "all" && projects.length > 0) {
      if (!projects.some((p) => p.id === selectedProjectId)) {
        setSelectedProjectId("all");
      }
    }
  }, [isClient, projects, selectedProjectId]);

  // Fetch Tickets from API
  const fetchTickets = useCallback(
    async (pageToLoad: number = currentPage) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = {
          page: pageToLoad,
          status: statusTab !== "all" ? statusTab : undefined,
          feedbackType: selectedType !== "all" ? selectedType : undefined,
          typeId: selectedProjectId !== "all" ? selectedProjectId : undefined,
        };

        const res = isClient
          ? await getMyFeedbackApi(params)
          : await getClientFeedbackApi(params);

        // In Client POV, also merge any projects that appear in the client's own tickets
        if (isClient && Array.isArray(res.data)) {
          const ticketsProjects: Array<{ id: string; name: string }> = [];
          res.data.forEach((item) => {
            const projId = String(
              item.project?.id ||
                item.projectId ||
                item.project_id ||
                item.typeId ||
                ""
            );
            const projName = item.projectName || item.project?.name;
            if (projId && projName) {
              ticketsProjects.push({ id: projId, name: projName });
            }
          });

          if (ticketsProjects.length > 0) {
            setProjects((prev) => {
              const existingIds = new Set(prev.map((p) => p.id));
              const additions = ticketsProjects.filter(
                (p) => !existingIds.has(p.id)
              );
              if (additions.length === 0) return prev;
              return [...prev, ...additions];
            });

            setProjectMap((prev) => {
              const updated = { ...prev };
              ticketsProjects.forEach((p) => {
                updated[p.id] = p.name;
              });
              return updated;
            });
          }
        }

        const mapped = (res.data || []).map((item) =>
          mapFeedbackItem(item, projectMap)
        );

        setTickets(mapped);
        setMeta(res.meta);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to load client tickets.";
        setError(msg);
        setTickets([]);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, isClient, projectMap, selectedProjectId, selectedType, statusTab]
  );

  useEffect(() => {
    void fetchTickets(currentPage);
  }, [fetchTickets, currentPage]);

  // Client-side quick filter over the loaded set for instant search response
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Status filter
      if (statusTab !== "all" && ticket.status !== statusTab) {
        return false;
      }

      // Type filter
      if (selectedType !== "all" && ticket.feedbackType !== selectedType) {
        return false;
      }

      // Project filter
      if (
        selectedProjectId !== "all" &&
        ticket.typeId !== selectedProjectId
      ) {
        return false;
      }

      // Search query
      if (debouncedSearch) {
        const matchesTitle = ticket.titleOfFeedback
          .toLowerCase()
          .includes(debouncedSearch);
        const matchesMessage = ticket.feedback
          .toLowerCase()
          .includes(debouncedSearch);
        const matchesClient =
          ticket.client?.name?.toLowerCase().includes(debouncedSearch) ||
          ticket.client?.company?.toLowerCase().includes(debouncedSearch) ||
          ticket.client?.email?.toLowerCase().includes(debouncedSearch);
        const matchesProject = ticket.projectName
          ?.toLowerCase()
          .includes(debouncedSearch);
        const matchesId = String(ticket.id).toLowerCase().includes(debouncedSearch);

        return (
          matchesTitle ||
          matchesMessage ||
          matchesClient ||
          matchesProject ||
          matchesId
        );
      }

      return true;
    });
  }, [debouncedSearch, selectedProjectId, selectedType, statusTab, tickets]);

  // Tab counts
  const statusCounts = useMemo(() => {
    return {
      all: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      in_progress: tickets.filter((t) => t.status === "in_progress").length,
      in_review: tickets.filter((t) => t.status === "in_review").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      rejected: tickets.filter((t) => t.status === "rejected").length,
    };
  }, [tickets]);

  // Quick Status change from Table Row
  const handleQuickStatusChange = async (
    ticketId: string | number,
    newStatus: ClientFeedbackStatus
  ) => {
    try {
      await updateClientFeedbackApi({
        id: ticketId,
        status: newStatus,
      });

      setTickets((prev) =>
        prev.map((t) => (t.rawId === ticketId ? { ...t, status: newStatus } : t))
      );
      toast.success("Ticket status updated.");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update ticket status";
      toast.error(msg);
    }
  };

  // Sync ticket update from Detail Modal
  const handleTicketUpdated = (updated: {
    id: string | number;
    status: ClientFeedbackStatus;
    reply?: string;
  }) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.rawId === updated.id ? { ...t, status: updated.status } : t
      )
    );
    if (selectedTicket && selectedTicket.rawId === updated.id) {
      setSelectedTicket((prev) =>
        prev ? { ...prev, status: updated.status } : null
      );
    }
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusTab !== "all" ||
    selectedType !== "all" ||
    selectedProjectId !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusTab("all");
    setSelectedType("all");
    setSelectedProjectId("all");
  };

  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = rootRef.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(
        "[data-tickets-section]"
      );
      if (sections.length > 0) {
        gsap.fromTo(
          sections,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.05,
            ease: "power2.out",
            clearProps: "all",
          }
        );
      }
    }, element);

    return () => context.revert();
  }, [tickets.length]);

  return (
    <div ref={rootRef} className="min-h-full text-v2-neutral-100">
      <div className="flex flex-col gap-6">
        {/* Page Top Header */}
        <header
          data-tickets-section
          className="flex flex-col gap-4 border-b border-v2-neutral-500 pb-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-100 sm:text-4xl">
              Client Tickets
            </h1>
            <p className="mt-2 text-sm leading-6 text-v2-neutral-300">
              Review incoming client tickets, track project inquiries, update resolution status, and reply to client requests.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void fetchTickets(currentPage)}
              disabled={isLoading}
              className="gap-1.5"
            >
              <RefreshCw
                className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="gap-1.5 shadow-md"
            >
              <Plus className="size-4" />
              <span>{isClient ? "New Ticket" : "Record Ticket"}</span>
            </Button>
          </div>
        </header>

        {/* KPI Stats Strip */}
        <div data-tickets-section>
          <TicketStatsCards tickets={tickets} totalFromMeta={meta?.totalItems} />
        </div>

        {/* Filter and Search Bar */}
        <div data-tickets-section>
          <TicketFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusTab={statusTab}
            onStatusTabChange={setStatusTab}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedProjectId={selectedProjectId}
            onProjectChange={setSelectedProjectId}
            projectOptions={projects}
            statusCounts={statusCounts}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Error Notice */}
        {error && (
          <div
            data-tickets-section
            className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-500"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void fetchTickets(currentPage)}
              className="h-7 text-xs border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Ticket Table */}
        <div data-tickets-section>
          <TicketTable
            tickets={filteredTickets}
            isLoading={isLoading}
            onSelectTicket={setSelectedTicket}
            onQuickStatusChange={handleQuickStatusChange}
            onDeleteTicket={canManage ? setDeleteTicketId : undefined}
            canManageTickets={canManage}
            onCreateTicket={() => setIsCreateOpen(true)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            meta={meta}
          />
        </div>
      </div>

      {/* Ticket Detail & Communication Drawer / Modal */}
      <FeedbackDetailModal
        ticket={selectedTicket}
        open={selectedTicket !== null}
        onClose={() => setSelectedTicket(null)}
        onTicketUpdated={handleTicketUpdated}
        canManage={canManage}
      />

      {/* Create Client Ticket Modal */}
      <CreateTicketModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onTicketCreated={() => void fetchTickets(1)}
        clients={clients}
        projects={projects}
        isClient={isClient}
        defaultClientId={
          String(
            CookieManager("get", "user-id") ||
              CookieManager("get", "user_id") ||
              ""
          ).trim()
        }
        clientName={String(CookieManager("get", "user") || "").trim()}
      />

      {/* Delete Ticket Confirmation Modal */}
      {canManage && (
        <DeleteTicketModal
          open={deleteTicketId !== null}
          ticketId={deleteTicketId}
          onOpenChange={(isOpen) => {
            if (!isOpen) setDeleteTicketId(null);
          }}
          onDeleted={() => void fetchTickets(currentPage)}
        />
      )}
    </div>
  );
}
