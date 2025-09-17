"use client";
import React, { useState } from "react";

import Sidebar from "./sidebar";
import Navbar from "./navbar";
import UserActions from "./useraction";
import StatsCards from "./statecards";
import RoleDistribution from "./roledistribution";
import EmployeeListHeader from "./listheader";
import EmployeeListFooter from "./listfooter";
import EmployeeList from "./employeelist";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { title: "Total Employees", value: 234, change: "+25% from last month" },
    { title: "Active Users", value: 198, change: "+15% from last month" },
    { title: "Departments", value: 12, change: "Across company" },
    { title: "New This Month", value: 8, change: "+2 this week" },
  ];

  const employees = [
    { id: 1, name: "Ali", role: "Manager", department: "HR", status: "Active", lastActive: "Today" },
    { id: 2, name: "Sara", role: "Developer", department: "IT", status: "Inactive", lastActive: "Yesterday" },
    { id: 3, name: "Ahmed", role: "Designer", department: "UI/UX", status: "Active", lastActive: "2 days ago" },
    { id: 4, name: "Usman", role: "Support", department: "Customer Care", status: "Active", lastActive: "3 days ago" },
    { id: 5, name: "Zara", role: "Analyst", department: "Finance", status: "Inactive", lastActive: "Last week" },
  ];

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
     
      <Navbar />

      <div className="flex flex-1">
       
        <Sidebar />

        
        <main className="flex-1 p-6 bg-gray-50">
          
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
                total={employees.length}
              />
            </div>

          
            <div className="bg-white p-4 rounded-lg shadow-md">
              <RoleDistribution />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
