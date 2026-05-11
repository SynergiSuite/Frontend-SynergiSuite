"use client";
import React from "react";
import { Actions } from "./actions";
import { UIEmployee } from "./schemas/employee";

type EmployeeListProps = {
  employees: UIEmployee[];
  currentUserIsFounder: string;
  onSelectEmployee: (employee: UIEmployee) => void;
};

export default function EmployeeList({
  employees,
  currentUserIsFounder,
  onSelectEmployee,
}: EmployeeListProps) {
  const canManageEmployee =
    currentUserIsFounder === "Founder" || currentUserIsFounder === "Manager";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-gray-600">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSelectEmployee(emp)}
              >
                <td className="px-4 py-2">{emp.name}</td>
                <td className="px-4 py-2">{emp.role}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded px-2 py-1 text-xs ${
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
                  {canManageEmployee ? (
                    <div onClick={(event) => event.stopPropagation()}>
                      <Actions
                        id={emp.id}
                        role={emp.role}
                        name={emp.name}
                        isFounderUser={currentUserIsFounder === "Founder"}
                      />
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {employees.map((emp) => (
          <button
            key={emp.id}
            type="button"
            className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:bg-gray-50"
            onClick={() => onSelectEmployee(emp)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Name
                </p>
                <h3 className="mt-1 break-words font-medium text-gray-900">
                  {emp.name}
                </h3>
              </div>

              {canManageEmployee ? (
                <div
                  className="shrink-0"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Actions
                    id={emp.id}
                    role={emp.role}
                    name={emp.name}
                    isFounderUser={currentUserIsFounder === "Founder"}
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role
                </p>
                <p className="mt-1 text-sm text-gray-800">{emp.role}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </p>
                <div className="mt-1">
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      emp.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {emp.status}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
