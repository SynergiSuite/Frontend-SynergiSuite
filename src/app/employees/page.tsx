"use client";
import React, { useEffect, useState } from "react";
import UserActions from "./useraction";
import StatsCards from "./statecards";
import RoleDistribution from "./roledistribution";
import EmployeeListHeader from "./listheader";
import EmployeeListFooter from "./listfooter";
import EmployeeList from "./employeelist";
import { getCookie } from "cookies-next";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [business, setBusiness] = useState("");
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [activeEmployees, setActiveEmployees] = useState<number>(0);
  const [token, setToken] = useState<string>("");
  const [employee, setEmployee] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const totalEmployees = async () => {
      setIsLoading(true);
      const token = getCookie("access_token");
      setToken(token as string);

      const business_name = getCookie("business_name");
      setBusiness(business_name as string);
      try {
        const res = await fetch(
          `http://localhost:3002/business/get-employees`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({}),
          },
        );

        const data = await res.json();

        const formatted = data.map((emp: any, index: number) => ({
          id: emp.user_id ?? index,
          name: emp.name || "Unknown",
          role: emp.role?.name || "N/A",
          department: emp.business?.name || "Unknown",
          status: emp.isExpired === false ? "Active" : "Inactive", // (or derive from backend if you have a field)
        }));

        setEmployee(formatted);
        setActiveEmployees(
          formatted.filter((emp: { status: string }) => emp.status === "Active")
            .length,
        );
        setTotalEmployees(formatted.length);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    totalEmployees();
  }, []);

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      change: "+25% from last month",
    },
    {
      title: "Active Users",
      value: activeEmployees,
      change: "+15% from last month",
    },
    { title: "Business", value: business, change: "" },
    { title: "New This Month", value: 8, change: "+2 this week" },
  ];

  const roleCounts = employee.reduce((acc: Record<string, number>, emp) => {
    acc[emp.role] = (acc[emp.role] || 0) + 1;
    return acc;
  }, {});

  const roleData = Object.entries(roleCounts).map(([role, count]) => ({
    label: role,
    value: count,
  }));

  const filteredEmployees = employee.filter((emp) =>
    emp.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <div className="flex flex-row justify-center items-center w-full h-screen">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">User Management</h1>
            <UserActions />
          </div>

          <div className="mb-6">
            <StatsCards stats={stats} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
              <EmployeeListHeader onSearch={setSearchQuery} />
              <EmployeeList employees={filteredEmployees} />
              <EmployeeListFooter
                showing={filteredEmployees.length}
                total={employee.length}
              />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <RoleDistribution roles={roleData} />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
