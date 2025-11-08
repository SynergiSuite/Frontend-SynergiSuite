"use client";
import React, { useEffect, useState } from "react";
import UserActions from "./useraction";
import StatsCards from "./stateCards";
import RoleDistribution from "./roledistribution";
import EmployeeListHeader from "./listheader";
import EmployeeListFooter from "./listfooter";
import EmployeeList from "./employeeList";
import LoaderCustom from "@/components/ui/loader-custom";
import { CookieManager } from "@/lib/cookieManager";

type UIEmployee = {
  id: number;
  name: string;
  role: string;
  department: string;
  status: "Active" | "Inactive";
};

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [business, setBusiness] = useState("");
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [activeEmployees, setActiveEmployees] = useState<number>(0);
  const [employee, setEmployee] = useState<UIEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  useEffect(() => {
    const totalEmployees = async () => {
      setIsLoading(true);
      try {
        const token = CookieManager("get", "access-token");
        const business_name = CookieManager("get", "business-name");
        setBusiness((business_name as string) ?? "");

        const res = await fetch(`${requestBaseUrl}/business/get-employees`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({}),
        });

        // Guard: ensure JSON and OK
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status} ${text}`);
        }

        const data: unknown = await res.json();

        // Normalize possible shapes (prefer data.employees as per your current logic)
        const employeesArray: any[] = Array.isArray((data as any)?.employees)
          ? (data as any).employees
          : Array.isArray(data)
          ? (data as any)
          : [];

        const formatted: UIEmployee[] = employeesArray.map((emp: any, index: number) => ({
          id: emp?.user_id ?? index,
          name: emp?.name || "Unknown",
          role: emp?.role?.name || "N/A",
          department: emp?.business?.name || "Unknown",
          status: emp?.isExpired === false ? "Active" : "Inactive",
        }));

        setEmployee(formatted);
        setActiveEmployees(formatted.filter((e) => e.status === "Active").length);
        setTotalEmployees(formatted.length);
      } catch (error) {
        // Keep behavior the same (no UI change), just log
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

  const roleCounts = employee.reduce((acc: Record<string, number>, emp: UIEmployee) => {
    acc[emp.role] = (acc[emp.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const roleData = Object.entries(roleCounts).map(([role, count]) => ({
    label: role,
    value: count,
  }));

  const filteredEmployees = employee.filter((emp) =>
    (emp.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <LoaderCustom />
      ) : (
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Employees</h1>
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
