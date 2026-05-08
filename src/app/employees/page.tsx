"use client";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import UserActions from "./useraction";
import StatsCards from "./statecards";
import RoleDistribution from "./roledistribution";
import EmployeeListHeader from "./listheader";
import EmployeeListFooter from "./listfooter";
import EmployeeList from "./employeeList";
import LoaderCustom from "@/components/ui/loader-custom";
import { UIEmployee } from "./schemas/employee";
import { fetchEmployeesData } from "./apis/getEmployeeApi";
import EmployeeDetailModal from "./employeeDetail";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stat, setStat] = useState({
    totalEmployees: 0,
    totalNewReg: 0,
    totalNewProj: 0,
    totalProjects: 0,
    activeEmployees: 0,
  });
  const [employee, setEmployee] = useState<UIEmployee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<UIEmployee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState("");

  useEffect(() => {
    const loadPage = async() => {
      setIsLoading(true);
      try {
        const {employees, stats} = await fetchEmployeesData();
        setEmployee(employees);
        setStat(stats);
      } catch (error) {
        console.error("Failed to load page data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPage();
  }, []);

  useEffect(() => {
    const role = getCookie("role");
    setCurrentUserRole((role as string) || "");
  }, []);

  const stats = [
    {
      title: "Total Employees",
      value: stat.totalEmployees,
      change: `+${stat.totalNewReg}% from last month`,
    },
    {
      title: "Active Users",
      value: stat.activeEmployees,
      change: "These are users currently active.",
    },
    { title: "Projects", value: stat.totalProjects, change: `+${stat.totalNewProj} this month.` },
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
    <div className="flex h-full flex-col">
      {isLoading ? (
        <LoaderCustom />
      ) : (
        <main className="flex flex-1 flex-col p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Employees</h1>
            <UserActions />
          </div>

          <div className="mb-6">
            <StatsCards stats={stats} />
          </div>

          <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex h-full min-h-[540px] flex-col rounded-lg bg-white p-4 shadow-md lg:col-span-2">
              <EmployeeListHeader onSearch={setSearchQuery} />
              <EmployeeList
                employees={filteredEmployees}
                currentUserIsFounder={currentUserRole}
                onSelectEmployee={setSelectedEmployee}
              />
              <EmployeeListFooter
                showing={filteredEmployees.length}
                total={employee.length}
              />
            </div>
          
            <div className="h-full rounded-lg bg-white p-4 shadow-md">
              <RoleDistribution roles={roleData} />
            </div>
          </div>
        </main>
      )}

      <EmployeeDetailModal
        employee={selectedEmployee}
        open={selectedEmployee !== null}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
}
