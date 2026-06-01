"use client";
import React from "react";
import { Actions } from "./actions";
import { UIEmployee } from "./schemas/employee";

type EmployeeListProps = {
  employees: UIEmployee[];
  currentUserIsFounder: string;
  onSelectEmployee: (employee: UIEmployee) => void;
};

// Initials avatar helper
function Avatar({ name, color }: { name: string; color: string }) {
  const initial = (name ?? "?").charAt(0).toUpperCase();
  return (
    <div
      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{
        background: `${color}25`,
        border: `1px solid ${color}50`,
        boxShadow: `0 0 8px ${color}20`,
      }}
    >
      {initial}
    </div>
  );
}

const AVATAR_COLORS = ["#5271ff", "#22d3ee", "#a78bfa", "#f59e0b", "#34d399"];

export default function EmployeeList({
  employees,
  currentUserIsFounder,
  onSelectEmployee,
}: EmployeeListProps) {
  const canManageEmployee =
    currentUserIsFounder === "Founder" || currentUserIsFounder === "Manager";

  if (employees.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03]">
          <span className="text-2xl">👥</span>
        </div>
        <p className="text-sm font-medium text-white/40">No employees found</p>
        <p className="text-xs text-white/20">Try adjusting your search query</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-widest text-white/40">Name</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-widest text-white/40">Role</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-widest text-white/40">Status</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white/40"></th>
              {canManageEmployee && (
                <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-white/40">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => {
              const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <tr
                  key={emp.id}
                  className="group cursor-pointer border-b border-white/[0.04] transition-colors duration-150 hover:bg-white/[0.03]"
                  onClick={() => onSelectEmployee(emp)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} color={color} />
                      <span className="text-sm font-medium text-white/80">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-white/50">{emp.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        emp.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-white/[0.05] text-white/40 border border-white/[0.06]"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3"></td>
                  {canManageEmployee && (
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <Actions
                        id={emp.id}
                        role={emp.role}
                        name={emp.name}
                        isFounderUser={currentUserIsFounder === "Founder"}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {employees.map((emp, i) => {
          const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
          return (
            <button
              key={emp.id}
              type="button"
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-all duration-200 hover:border-[#5271ff]/25 hover:bg-white/[0.04]"
              onClick={() => onSelectEmployee(emp)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={emp.name} color={color} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/35">Name</p>
                    <h3 className="mt-0.5 truncate text-sm font-semibold text-white/90">{emp.name}</h3>
                  </div>
                </div>

                {canManageEmployee && (
                  <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Actions
                      id={emp.id}
                      role={emp.role}
                      name={emp.name}
                      isFounderUser={currentUserIsFounder === "Founder"}
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/35">Role</p>
                  <p className="mt-0.5 text-sm text-white/70">{emp.role}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/35">Status</p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        emp.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-white/[0.05] text-white/40 border border-white/[0.06]"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
