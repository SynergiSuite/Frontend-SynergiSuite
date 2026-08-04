"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { gsap } from "gsap";
import Header from "./header";
import ProjectCards from "./statecards";
import { Projects } from "./schemas/project";
import LoaderCustom from "@/components/ui/loader-custom";
import { getProjectsApi, ProjectsPaginationMeta } from "./apis/getProjectsApi";
import { getTeamsApi } from "./apis/getAllTeamsApi";
import { Team } from "./schemas/team";
import { getClientsApi } from "./apis/getAllClients";
import { Client } from "./schemas/client";
import { toast } from "sonner";
import { CookieManager } from "@/lib/cookieManager";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Page() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [meta, setMeta] = useState<ProjectsPaginationMeta | undefined>(undefined);
  const [teams, setTeams] = useState<Team[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [role, setRole] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRole(String(CookieManager("get", "primary_role") || CookieManager("get", "role") || ""));
  }, []);

  // Reset page to 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getProjects = useCallback(async () => {
    setIsDataLoading(true);
    try {
      const res = await getProjectsApi(currentPage, searchQuery, role);
      setProjects(res.data || []);
      setMeta(res.meta);
    } catch (error: any) {
      console.error("Failed to fetch projects:", error);
      toast.error("Failed to fetch projects: " + (error?.message || ""));
    } finally {
      setIsDataLoading(false);
      setIsInitialLoading(false);
    }
  }, [currentPage, searchQuery, role]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  useEffect(() => {
    const getTeams = async () => {
      try {
        const res = await getTeamsApi();
        setTeams(res);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };
    getTeams();
  }, []);

  useEffect(() => {
    const getClients = async () => {
      try {
        const res = await getClientsApi();
        setClients(res);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    };
    getClients();
  }, []);

  // GSAP Page Entrance Animation
  useEffect(() => {
    if (!isInitialLoading && containerRef.current) {
      const animElements = containerRef.current.querySelectorAll(".project-animate-item");
      if (animElements.length > 0) {
        gsap.killTweensOf(animElements);
        gsap.fromTo(
          animElements,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
          }
        );
      }
    }
  }, [isInitialLoading]);

  const totalPages = meta?.totalPages ?? 1;

  return (
    <>
      {isInitialLoading ? (
        <LoaderCustom />
      ) : (
        <div ref={containerRef} className="relative flex min-h-full flex-col text-white">
          {/* Accent radial glow overlay */}
          <div className="absolute left-0 top-0 h-[500px] w-[500px] bg-[radial-gradient(circle_at_top_left,rgba(82,113,255,0.06),transparent_55%)] pointer-events-none" />
          <div className="absolute right-0 bottom-0 h-[400px] w-[400px] bg-[radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.04),transparent_50%)] pointer-events-none" />

          <div className="relative z-10 flex-1 flex flex-col">
            <Header
              filter={filter}
              setFilter={setFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              teams={teams}
              clients={clients}
              onProjectCreated={getProjects}
            />

            {isDataLoading && (
              <div className="mb-4 flex items-center gap-2 text-xs text-[#5271ff]">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#5271ff] border-t-transparent" />
                <span>Updating projects...</span>
              </div>
            )}

            <div className="flex-1">
              <ProjectCards
                filter={filter}
                searchQuery={searchQuery}
                projects={projects}
                teams={teams}
                clients={clients}
                role={role}
                onRefresh={getProjects}
              />
            </div>

            {/* Pagination Controls */}
            {meta && (meta.totalPages > 1 || meta.totalItems > 0) && (
              <div className="mt-8 flex flex-col gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-white/40">
                  Showing{" "}
                  <span className="font-semibold text-white/80">
                    {meta.itemCount > 0 ? (currentPage - 1) * meta.itemsPerPage + 1 : 0}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-white/80">
                    {Math.min(currentPage * meta.itemsPerPage, meta.totalItems)}
                  </span>{" "}
                  of <span className="font-semibold text-white/80">{meta.totalItems}</span> projects
                </p>

                {totalPages > 1 && (
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      disabled={currentPage <= 1 || isDataLoading}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <span className="px-3 text-xs font-medium text-white/60">
                      Page <span className="text-white font-semibold">{currentPage}</span> of{" "}
                      <span className="text-white font-semibold">{totalPages}</span>
                    </span>

                    <button
                      type="button"
                      disabled={currentPage >= totalPages || isDataLoading}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
