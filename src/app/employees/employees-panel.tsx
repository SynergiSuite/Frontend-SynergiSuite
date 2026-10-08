"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LoaderCircle, RefreshCw, UsersRound } from "lucide-react";
import { gsap } from "gsap";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CookieManager } from "@/lib/cookieManager";

import EmployeeDetailModal from "./employeeDetail";
import EmployeeList from "./employeesList";
import EmployeeListFooter from "./listfooter";
import EmployeeListHeader from "./listheader";
import RoleDistribution from "./roledistribution";
import type { PaginationMeta } from "./schemas/apiResponse";
import type { UIEmployee } from "./schemas/employee";
import StatsCards from "./statecards";
import UserActions from "./useraction";
import { fetchEmployeesData } from "./apis/getEmployeeApi";

const PAGE_SIZE = 5;

const INITIAL_STATS = {
  totalEmployees: 0,
  totalNewReg: 0,
  totalNewProj: 0,
  totalProjects: 0,
  activeEmployees: 0,
};

export default function EmployeesPanel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [statsData, setStatsData] = useState(INITIAL_STATS);
  const [employees, setEmployees] = useState<UIEmployee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<UIEmployee | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let isCancelled = false;

    const loadPage = async () => {
      setIsDataLoading(true);
      setDataError(null);

      try {
        const result = await fetchEmployeesData({
          page: currentPage,
          limit: PAGE_SIZE,
          search: debouncedSearch,
        });

        if (!isCancelled) {
          setEmployees(result.employees);
          setStatsData(result.stats);
          setPaginationMeta(result.meta);
        }
      } catch (error) {
        if (!isCancelled) {
          setDataError(
            error instanceof Error
              ? error.message
              : "Employee information could not be loaded.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsDataLoading(false);
          setIsInitialLoading(false);
        }
      }
    };

    void loadPage();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, debouncedSearch, reloadKey]);

  useEffect(() => {
    const role =
      CookieManager("get", "primary_role") || CookieManager("get", "role");
    setCurrentUserRole(String(role || ""));
  }, []);

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
      gsap.from("[data-employees-section]", {
        autoAlpha: 0,
        y: 14,
        duration: 0.5,
        stagger: 0.075,
        ease: "power3.out",
      });
    }, root);

    return () => context.revert();
  }, [isInitialLoading]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const refresh = () => setReloadKey((current) => current + 1);

  const stats = [
    {
      title: "Total employees",
      value: statsData.totalEmployees,
      change: "People in this workspace",
    },
    {
      title: "Active employees",
      value: statsData.activeEmployees,
      change: "Currently active accounts",
    },
    {
      title: "Projects",
      value: statsData.totalProjects,
      change: `${statsData.totalNewProj} added this month`,
    },
    {
      title: "New this month",
      value: statsData.totalNewReg,
      change: "Recently registered employees",
    },
  ];

  const roleCounts = employees.reduce<Record<string, number>>((counts, employee) => {
    counts[employee.role] = (counts[employee.role] || 0) + 1;
    return counts;
  }, {});

  const roleData = Object.entries(roleCounts).map(([label, value]) => ({
    label,
    value,
  }));

  return (
    <div ref={rootRef} className="min-h-full text-v2-neutral-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-2 sm:py-3">
        <header
          data-employees-section
          className="flex flex-col gap-5 border-b border-v2-neutral-500 pb-7 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-100 sm:text-4xl">
              Employees
            </h1>
            <p className="mt-3 text-sm leading-6 text-v2-neutral-300">
              Keep your directory, roles, and employee access organized in one workspace.
            </p>
          </div>
          <UserActions onEmployeeAdded={refresh} />
        </header>

        {isInitialLoading ? (
          <Card data-employees-section className="min-h-80 items-center justify-center">
            <CardContent className="flex flex-col items-center gap-3 text-sm text-v2-neutral-400">
              <LoaderCircle className="size-5 animate-spin text-v2-neutral-600" aria-hidden="true" />
              Loading employee workspace...
            </CardContent>
          </Card>
        ) : dataError && employees.length === 0 ? (
          <Card data-employees-section>
            <CardContent className="flex min-h-72 flex-col items-center justify-center text-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-v2-neutral-200 text-v2-neutral-500">
                <UsersRound className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-base font-semibold">Employees could not be loaded</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-v2-neutral-400">{dataError}</p>
              <Button type="button" variant="outline" className="mt-5" onClick={refresh}>
                <RefreshCw aria-hidden="true" />
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div data-employees-section>
              <StatsCards stats={stats} />
            </div>

            <div
              data-employees-section
              className="grid min-w-0 flex-1 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,0.8fr)]"
            >
              <Card className="relative min-h-[540px] min-w-0">
                <CardHeader>
                  <EmployeeListHeader
                    searchQuery={searchQuery}
                    onSearch={handleSearch}
                  />
                </CardHeader>
                <CardContent className="relative flex flex-1 flex-col">
                  {isDataLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-v2-neutral-100/85 backdrop-blur-[2px]">
                      <LoaderCircle className="size-5 animate-spin text-v2-neutral-600" aria-label="Loading employees" />
                    </div>
                  )}
                  {dataError && (
                    <div role="alert" className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                      <span>{dataError}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={refresh} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                        Retry
                      </Button>
                    </div>
                  )}
                  <EmployeeList
                    employees={employees}
                    currentUserIsFounder={currentUserRole}
                    onSelectEmployee={setSelectedEmployee}
                    onRefresh={refresh}
                  />
                  <EmployeeListFooter
                    showing={employees.length}
                    total={paginationMeta?.totalItems ?? employees.length}
                    paginationMeta={paginationMeta}
                    onPageChange={setCurrentPage}
                  />
                </CardContent>
              </Card>

              <Card className="xl:sticky xl:top-4">
                <CardContent>
                  <RoleDistribution roles={roleData} />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <EmployeeDetailModal
        employee={selectedEmployee}
        open={selectedEmployee !== null}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
}
