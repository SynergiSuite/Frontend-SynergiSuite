"use client";

import React, { useState, useEffect } from "react";
import StateCards from "./stateCards";
import TeamActivitiesChart from "./teamActivities";
import TeamPerformanceChart from "./teamPerformance";
import TeamTable from "./teamTable";
import CreateTeamModal from "./createTeamModal";
import { Button } from "@/global/buttons";
import { CookieManager } from "@/lib/cookieManager";
import LoaderCustom from "@/components/ui/loader-custom";
import { Team, Teams } from "./schemas/types";
import { toast } from "sonner"


export default function Page() {
  const [reload, setReload] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<Teams[]>([]);
  const [count, setCount] = useState<number>(0);
  const [employees, setEmployees] = useState<[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  // Get All Teams
  useEffect(() => {
    const fetchTeamsData = async () => {
      setIsLoading(true);
      const accessToken = CookieManager("get", "access-token");
      const response = await fetch(
        `${requestBaseUrl}/teams/get-all-teams`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const data = await response.json();
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
      setEmployees(data);
      setIsLoading(false)
    };
    fetchTeamsData();
    fetchEmployeesData();
  }, [reload]);

  const handleSubmitOnCreate = async(formData: Team) => {
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

              <Button
                onClick={() => setIsModalOpen(true)}
                className="button_primary_lg"
                variant="none"
              >
                Create New Team
              </Button>
            </div>

            <div className="overflow-x-auto">
              <TeamTable teams={teams} employees={employees} />
            </div>
          </div>
        </main>
      )}

      {isModalOpen && (
        <CreateTeamModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleSubmitOnCreate}
          employees={employees}
        />
      )}
    </>
  );
}
