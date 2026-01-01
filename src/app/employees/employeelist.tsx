"use client";
import React from "react";
import { Actions } from "./actions";
import { Employee } from "./schemas/employee";

type EmployeeListProps = {
  employees: Employee[];
  currentUserIsFounder: string;
};

export default function EmployeeList({ employees, currentUserIsFounder }: EmployeeListProps) {
  return (
    <div className="max-h-[45vh] overflow-y-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{emp.name}</td>
              <td className="px-4 py-2">{emp.role}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    emp.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {emp.status}
                </span>
              </td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2 text-center">
                {currentUserIsFounder === 'Founder' || currentUserIsFounder === 'Manager' ? (
                  <Actions
                    id={emp.id}
                    role={emp.role}
                    name={emp.name}
                    isFounderUser={currentUserIsFounder === 'Founder'}
                  />
                ) : null}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
