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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CookieManager } from "@/lib/cookieManager";
import { getAllProjectsApi } from "@/app/projects/apis/getAllProjectsApi";
import { getClientsApi } from "@/app/projects/apis/getAllClients";
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

  // Modals & Selection
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTicketId, setDeleteTicketId] = useState<string | number | null>(
    null
  );

  // Debounced search
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim().toLowerCase());
    }, 250);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  // Load Projects and Clients for dropdowns
  useEffect(() => {
    async function loadAuxiliaryData() {
      try {
        const [projRes, clientRes] = await Promise.allSettled([
          getAllProjectsApi(),
          getClientsApi(),
        ]);

        const pMap: Record<string, string> = {};
        if (projRes.status === "fulfilled" && Array.isArray(projRes.value)) {
          const mappedProjs = projRes.value.map((p) => ({
            id: String(p.id),
            name: p.name,
          }));
          setProjects(mappedProjs);
          mappedProjs.forEach((p) => {
            pMap[p.id] = p.name;
          });
          setProjectMap(pMap);
        }

        if (clientRes.status === "fulfilled" && Array.isArray(clientRes.value)) {
          const mappedClients = clientRes.value.map(
            (c: { id: string | number; name?: string; company?: string }) => ({
              id: String(c.id),
              name: c.name || "Unnamed Client",
              company: c.company,
            })
          );
          setClients(mappedClients);
        }
      } catch (auxErr) {
        console.warn("Failed to load auxiliary projects/clients:", auxErr);
      }
    }

    void loadAuxiliaryData();
  }, []);

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

            {canManage && (
              <Button
                type="button"
                size="sm"
                onClick={() => setIsCreateOpen(true)}
                className="gap-1.5 shadow-md"
              >
                <Plus className="size-4" />
                <span>Record Ticket</span>
              </Button>
            )}
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
      {canManage && (
        <CreateTicketModal
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onTicketCreated={() => void fetchTickets(1)}
          clients={clients}
          projects={projects}
        />
      )}

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
