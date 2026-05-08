"use client";

import React, { useState, useEffect } from "react";
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
import { toast } from "sonner"
import { getTeamsApi } from "./apis/getTeamsApi";
import { canManageTeams } from "@/lib/rolePermissions";


export default function Page() {
  const [reload, setReload] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<Teams[]>([]);
  const [count, setCount] = useState<number>(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState("");
  const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const canManageTeamActions = canManageTeams(role);

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
      setIsLoading(false)
    };
    fetchTeamsData();
    fetchEmployeesData();
  }, [reload]);

  const handleSubmitOnCreate = async(formData: Team) => {
    if (!canManageTeamActions) {
      toast.error("You do not have permission to create teams.");
      return;
    }

    const accessToken = await CookieManager("get", "access-token")
    const response = await fetch(`${requestBaseUrl}/teams/create`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      },
    )

    if(!response.ok) {
      toast.error(response.statusText)
      return
    }
    setIsModalOpen(false);
    setReload((prev) => !prev);
    toast.success("Team created successfully")
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
        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Teams</h1>
          </div>
          <StateCards states={states} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TeamActivitiesChart />
            </div>
            <div className="lg:col-span-1">
              <TeamPerformanceChart />
            </div>
          </div>

          <div className="bg-white p-6 border border_primary rounded-lg shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                All Teams{" "}
                <span className="text-gray-500 text-sm">({count})</span>
              </h2>

              {canManageTeamActions ? (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="button_primary_lg"
                  variant="none"
                >
                  Create New Team
                </Button>
              ) : null}
            </div>

            <div className="overflow-x-auto">
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
