"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { getCookie } from "cookies-next";
import UserActions from "./useraction";
import StatsCards from "./statecards";
import RoleDistribution from "./roledistribution";
import EmployeeListHeader from "./listheader";
import EmployeeListFooter from "./listfooter";
import EmployeeList from "./employeesList";
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

  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPage = async () => {
      setIsLoading(true);
      try {
        const { employees, stats } = await fetchEmployeesData();
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

  // GSAP stagger entrance once loaded
  useEffect(() => {
    if (isLoading) return;
    const ctx = gsap.context(() => {
      gsap.from([headerRef.current, statsRef.current, gridRef.current], {
        opacity: 0,
        y: 20,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.1,
        clearProps: "all",
      });
    });
    return () => ctx.revert();
  }, [isLoading]);

  const stats = [
    {
      title: "Total Employees",
      value: stat.totalEmployees,
      change: `+${stat.totalNewReg}% from last month`,
    },
    {
      title: "Active Users",
      value: stat.activeEmployees,
      change: "Currently active employees",
    },
    {
      title: "Projects",
      value: stat.totalProjects,
      change: `+${stat.totalNewProj} this month`,
    },
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
    <div className="relative flex h-full flex-col">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-[#5271ff]/[0.05] blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#3a4ec4]/[0.04] blur-[120px]" />

      {isLoading ? (
        <LoaderCustom />
      ) : (
        <main className="relative z-10 flex flex-1 flex-col gap-6">
          {/* Page header */}
          <div ref={headerRef} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#5271ff]/70">
                HR Module
              </p>
              <h1 className="mt-1 text-2xl font-bold text-white">Employees</h1>
            </div>
            <UserActions />
            {/* Separator */}
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#5271ff]/20 to-transparent" />

          {/* Stat cards */}
          <div ref={statsRef}>
            <StatsCards stats={stats} />
          </div>

          {/* Main grid */}
          <div ref={gridRef} className="grid flex-1 grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Employee list panel */}
            <div className="relative flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0826]/60 p-5 backdrop-blur-md lg:col-span-2">
              <div className="absolute left-0 top-0 h-[2px] w-24 bg-gradient-to-r from-[#5271ff] to-transparent" />
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

            {/* Role distribution panel */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0826]/60 p-5 backdrop-blur-md">
              <div className="absolute left-0 top-0 h-[2px] w-20 bg-gradient-to-r from-[#a78bfa] to-transparent" />
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
