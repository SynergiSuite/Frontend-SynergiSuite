"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import StateCards from "./stateCards";
import TeamActivitiesChart from "./teamActivities";
import TeamPerformanceChart from "./teamPerformance";
import TeamTable from "./teamTable";
import CreateTeamModal from "./createTeamModal";
import { Button } from "@/global/buttons";
import { CookieManager } from "@/lib/cookieManager";
import LoaderCustom from "@/components/ui/loader-custom";
import { Employee, Team, Teams } from "./schemas/types";
import { toast } from "sonner";
import { getTeamsApi } from "./apis/getTeamsApi";
import { canManageTeams } from "@/lib/rolePermissions";
import { gsap } from "gsap";

export default function Page() {
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<Teams[]>([]);
  const [count, setCount] = useState<number>(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState("");
  const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const canManageTeamActions = canManageTeams(role);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger GSAP entrance animation once page finishes loading
  useEffect(() => {
    if (!isLoading && containerRef.current) {
      const targets = containerRef.current.querySelectorAll(".gsap-fade-in");
      if (targets.length > 0) {
        gsap.fromTo(
          targets,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.1,
          }
        );
      }
    }
  }, [isLoading]);

  // Get All Teams
  useEffect(() => {
    const cookieRole = CookieManager("get", "role");
    setRole((cookieRole as string) ?? "");

    const fetchTeamsData = async () => {
      setIsLoading(true);
      const data = await getTeamsApi();
      setTeams(data.teams);
      setCount(data.count);
    };

    const fetchEmployeesData = async () => {
      const accessToken = CookieManager("get", "access-token");
      const response = await fetch(
        `${requestBaseUrl}/business/get-employees`,
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({}),
        },
      );

      const data = await response.json();
      const normalizedEmployees: Employee[] = Array.isArray(
        (data as any)?.employees?.employees
      )
        ? (data as any).employees.employees
        : Array.isArray((data as any)?.employees)
        ? (data as any).employees
        : [];

      setEmployees(normalizedEmployees);
      setIsLoading(false);
    };
    fetchTeamsData();
    fetchEmployeesData();
  }, [reload]);

  const handleSubmitOnCreate = async(formData: Team) => {
    if (!canManageTeamActions) {
      toast.error("You do not have permission to create teams.");
      return;
    }

    const accessToken = await CookieManager("get", "access-token");
    const response = await fetch(`${requestBaseUrl}/teams/create`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      },
    );

    if(!response.ok) {
      toast.error(response.statusText);
      return;
    }
    setIsModalOpen(false);
    setReload((prev) => !prev);
    toast.success("Team created successfully");
  };

  const states = [
    { title: "Total Teams", value: count, change: "" },
    { title: "Active Projects", value: 8, change: "" },
    { title: "Pending Tasks", value: 24, change: "" },
    { title: "Reports", value: 15, change: "" },
  ];

  return (
    <>
      {isLoading ? (
        <LoaderCustom />
      ) : (
        <main className="space-y-6 p-4 sm:p-6 text-white relative min-h-screen" ref={containerRef}>
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 -z-10 h-[450px] w-[450px] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />

          <div className="gsap-fade-in mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                SynergiSuite Workspace
              </p>
              <h1 className="text-3xl font-extrabold text-white mt-1">Teams</h1>
            </div>
          </div>

          <div className="gsap-fade-in">
            <StateCards states={states} />
          </div>

          <div className="gsap-fade-in grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TeamActivitiesChart />
            </div>
            <div className="lg:col-span-1">
              <TeamPerformanceChart />
            </div>
          </div>

          <div className="gsap-fade-in space-y-4 rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 backdrop-blur-md p-4 shadow-lg sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  All Teams{" "}
                  <span className="text-white/40 text-sm font-normal">({count})</span>
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  Manage workspace team structures, leads, and participants.
                </p>
              </div>

              {canManageTeamActions ? (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="h-11 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(82,113,255,0.25)] transition-all hover:shadow-[0_0_24px_rgba(82,113,255,0.35)] w-full sm:w-auto"
                  variant="add"
                >
                  Create New Team
                </Button>
              ) : null}
            </div>

            <div className="overflow-hidden pt-2">
              <TeamTable
                teams={teams}
                employees={employees}
                canManageTeams={canManageTeamActions}
                onRefresh={() => setReload((prev) => !prev)}
              />
            </div>
          </div>
        </main>
      )}

      <AnimatePresence>
        {isModalOpen && canManageTeamActions ? (
          <CreateTeamModal
            onClose={() => setIsModalOpen(false)}
            onCreate={handleSubmitOnCreate}
            employees={employees}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
