"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  FolderKanban,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  UsersRound,
} from "lucide-react";

import { getAllEmployeesApi } from "@/app/employees/apis/getAllEmployeeApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CookieManager } from "@/lib/cookieManager";
import { canManageTeams } from "@/lib/rolePermissions";

import {
  getTeamsWithTasksApi,
  type PaginationMeta,
} from "./apis/getTeamsWithTasksApi";
import CreateTeamModal from "./createTeamModal";
import type { Employee, Teams } from "./schemas/types";
import StateCards, { type StateCardProps } from "./stateCards";
import TeamActivitiesChart from "./teamActivities";
import TeamPerformanceChart from "./teamPerformance";
import TeamTable from "./teamTable";

const PAGE_SIZE = 5;

export default function TeamsPanel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const [teams, setTeams] = useState<Teams[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  const canManageTeamActions = canManageTeams(userRole);

  // Debounced search
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  // Read user role from cookies
  useEffect(() => {
    const cookieRole =
      CookieManager("get", "primary_role") || CookieManager("get", "role");
    setUserRole(String(cookieRole || ""));
  }, []);

  // Fetch employees list for member assignment
  useEffect(() => {
    let cancelled = false;

    const loadEmployees = async () => {
      try {
        const allEmployees = await getAllEmployeesApi();
        if (!cancelled) {
          const normalized: Employee[] = allEmployees.map((emp) => ({
            user_id: emp.user_id,
            name:
              emp.name ||
              `${emp.first_name || ""} ${emp.last_name || ""}`.trim() ||
              "Unnamed",
            email: emp.email || "",
          }));
          setEmployees(normalized);
        }
      } catch (err) {
        console.error("Failed to load employees for teams:", err);
      }
    };

    void loadEmployees();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch teams with tasks
  useEffect(() => {
    let isCancelled = false;

    const loadTeams = async () => {
      setIsDataLoading(true);
      setDataError(null);

      try {
        const response = await getTeamsWithTasksApi(currentPage, PAGE_SIZE);
        if (!isCancelled) {
          setTeams(response.data);
          setPaginationMeta(response.meta);
          setTotalCount(response.meta?.totalItems ?? response.data.length);
        }
      } catch (error) {
        if (!isCancelled) {
          setDataError(
            error instanceof Error
              ? error.message
              : "Team data could not be loaded."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsDataLoading(false);
          setIsInitialLoading(false);
        }
      }
    };

    void loadTeams();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, reloadKey]);

  // GSAP Entrance animation
  useLayoutEffect(() => {
    const element = rootRef.current;

    if (
      !element ||
      isInitialLoading ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.from("[data-teams-section]", {
        autoAlpha: 0,
        y: 12,
        duration: 0.42,
        stagger: 0.08,
        ease: "power2.out",
      });
    }, element);

    return () => context.revert();
  }, [isInitialLoading]);

  const refresh = () => setReloadKey((prev) => prev + 1);

  // Filter teams by debounced search if search text entered
  const filteredTeams = debouncedSearch
    ? teams.filter((t) =>
        t.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        t.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : teams;

  const pendingTasksSum = teams.reduce((acc, t) => acc + (t.ongoingTasks ?? 0), 0);
  const completedTasksSum = teams.reduce((acc, t) => acc + (t.completedTasks ?? 0), 0);

  const stats: StateCardProps[] = [
    {
      title: "Total Squads",
      value: totalCount,
      change: "Active workspace teams",
    },
    {
      title: "Active Projects",
      value: 8,
      change: "In flight across squads",
    },
    {
      title: "Ongoing Tasks",
      value: pendingTasksSum,
      change: "Across active teams",
    },
    {
      title: "Completed Tasks",
      value: completedTasksSum,
      change: "Delivered deliverables",
    },
  ];

  return (
    <div ref={rootRef} className="min-h-full text-v2-neutral-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-2 sm:py-3">
        {/* Header */}
        <header
          data-teams-section
          className="flex flex-col gap-5 border-b border-v2-neutral-500 pb-7 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-100 sm:text-4xl">
              Teams & Squads
            </h1>
            <p className="mt-3 text-sm leading-6 text-v2-neutral-300">
              Manage workspace team structures, leads, participants, and cross-team velocity.
            </p>
          </div>

          {canManageTeamActions && (
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="default"
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2 bg-v2-neutral-100 text-v2-neutral-600 hover:bg-v2-neutral-200 shadow-md font-semibold"
              >
                <Plus className="size-4" />
                Create New Team
              </Button>
            </div>
          )}
        </header>

        {/* Loading / Error / Content */}
        {isInitialLoading ? (
          <Card data-teams-section className="min-h-80 items-center justify-center">
            <CardContent className="flex flex-col items-center gap-3 text-sm text-v2-neutral-400">
              <LoaderCircle className="size-5 animate-spin text-v2-neutral-600" />
              Loading team workspaces...
            </CardContent>
          </Card>
        ) : dataError && teams.length === 0 ? (
          <Card data-teams-section>
            <CardContent className="flex min-h-72 flex-col items-center justify-center text-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-v2-neutral-200 text-v2-neutral-500">
                <UsersRound className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-v2-neutral-600">
                Teams could not be loaded
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-v2-neutral-400">
                {dataError}
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-5"
                onClick={refresh}
              >
                <RefreshCw className="size-4 mr-2" />
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Top Stat Cards */}
            <div data-teams-section>
              <StateCards states={stats} />
            </div>

            {/* Analytics Grids */}
            <div data-teams-section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TeamActivitiesChart teams={teams} />
              </div>
              <div className="lg:col-span-1">
                <TeamPerformanceChart teams={teams} />
              </div>
            </div>

            {/* Main Team Table Card */}
            <div data-teams-section>
              <Card className="relative min-w-0">
                <CardHeader className="pb-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-base font-semibold text-v2-neutral-600">
                          All Squads
                        </h2>
                        <span className="inline-flex items-center rounded-full bg-v2-neutral-200 px-2.5 py-0.5 text-xs font-semibold text-v2-neutral-600">
                          {totalCount}
                        </span>
                      </div>
                      <p className="text-xs text-v2-neutral-400 mt-0.5">
                        Manage squad rosters, leadership roles, and performance goals.
                      </p>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-v2-neutral-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search teams..."
                        className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 pl-9 pr-3 text-xs text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20"
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative flex flex-1 flex-col pt-0">
                  {isDataLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-v2-neutral-100/85 backdrop-blur-[2px]">
                      <LoaderCircle className="size-5 animate-spin text-v2-neutral-600" />
                    </div>
                  )}

                  <TeamTable
                    teams={filteredTeams}
                    employees={employees}
                    canManageTeams={canManageTeamActions}
                    onRefresh={refresh}
                    paginationMeta={paginationMeta}
                    onPageChange={setCurrentPage}
                  />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Create Team Modal */}
      {isCreateModalOpen && canManageTeamActions && (
        <CreateTeamModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={refresh}
          employees={employees}
        />
      )}
    </div>
  );
}
