"use client";

import { useEffect, useState } from "react";
import { UsersRound } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { CookieManager } from "@/lib/cookieManager";

import { Actions } from "./actions";
import type { UIEmployee } from "./schemas/employee";

type EmployeeListProps = {
  employees: UIEmployee[];
  currentUserIsFounder: string;
  onSelectEmployee: (employee: UIEmployee) => void;
  onRefresh?: () => void;
};

function EmployeeAvatar({ name }: { name: string }) {
  const initials = (name || "Employee")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <Avatar className="size-9 rounded-xl">
      <AvatarFallback className="rounded-xl bg-v2-neutral-500 text-xs font-semibold text-v2-neutral-100">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

function StatusBadge({ status }: { status: UIEmployee["status"] }) {
  const active = status === "Active";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-v2-neutral-200 bg-v2-neutral-200/45 px-2.5 py-1 text-[11px] font-medium text-v2-neutral-500">
      <span
        className={`size-1.5 rounded-full ${active ? "bg-v2-neutral-500" : "bg-v2-neutral-300"}`}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

export default function EmployeeList({
  employees,
  currentUserIsFounder,
  onSelectEmployee,
  onRefresh,
}: EmployeeListProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = CookieManager("get", "user-id");
    if (id) {
      setCurrentUserId(String(id));
    }
  }, []);

  const currentUserRole = currentUserIsFounder.trim().toLowerCase();
  const isFounder = currentUserRole.includes("founder");
  const isManager =
    currentUserRole.includes("manager") || currentUserRole.includes("admin");
  const canPerformActions = isFounder || isManager;

  const canManageTarget = (targetRole: string, targetId: number) => {
    // No user can edit or remove themselves
    if (currentUserId && String(targetId) === String(currentUserId)) {
      return false;
    }

    if (isFounder) {
      return true;
    }

    if (isManager) {
      return targetRole.trim().toLowerCase() !== "founder";
    }

    return false;
  };

  const canViewDetail = (targetRole: string) => {
    if (targetRole.trim().toLowerCase() === "founder") {
      return isFounder;
    }

    return isFounder || isManager;
  };

  const openEmployee = (employee: UIEmployee) => {
    if (canViewDetail(employee.role)) {
      onSelectEmployee(employee);
      return;
    }

    toast.error("You do not have permission to view this employee profile.");
  };

  if (employees.length === 0) {
    return (
      <div className="flex min-h-72 flex-1 flex-col items-center justify-center text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-v2-neutral-200 text-v2-neutral-400">
          <UsersRound className="size-5" aria-hidden="true" />
        </span>
        <p className="mt-4 text-sm font-medium text-v2-neutral-500">No employees found</p>
        <p className="mt-1 text-xs text-v2-neutral-400">Try a different name or clear your search.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="hidden min-w-[620px] md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-v2-neutral-200">
              <th scope="col" className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-v2-neutral-400">Employee</th>
              <th scope="col" className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-v2-neutral-400">Role</th>
              <th scope="col" className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-v2-neutral-400">Status</th>
              {canPerformActions && (
                <th scope="col" className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-v2-neutral-400">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                tabIndex={0}
                className="group cursor-pointer border-b border-v2-neutral-200/70 outline-none transition-colors last:border-b-0 hover:bg-v2-neutral-200/25 focus-visible:bg-v2-neutral-200/40"
                onClick={() => openEmployee(employee)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openEmployee(employee);
                  }
                }}
              >
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-3">
                    <EmployeeAvatar name={employee.name} />
                    <span className="text-sm font-medium text-v2-neutral-600">{employee.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-sm text-v2-neutral-400">{employee.role}</td>
                <td className="px-3 py-3.5"><StatusBadge status={employee.status} /></td>
                {canPerformActions && (
                  <td className="px-3 py-3.5 text-right" onClick={(event) => event.stopPropagation()}>
                    {canManageTarget(employee.role, employee.id) && (
                      <Actions
                        id={employee.id}
                        role={employee.role}
                        name={employee.name}
                        isFounderUser={isFounder}
                        onRefresh={onRefresh}
                      />
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {employees.map((employee) => (
          <Card
            key={employee.id}
            size="sm"
            variant="subtle"
            role="button"
            tabIndex={0}
            className="cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-v2-neutral-400/25"
            onClick={() => openEmployee(employee)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openEmployee(employee);
              }
            }}
          >
            <CardContent>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <EmployeeAvatar name={employee.name} />
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-v2-neutral-600">{employee.name}</h3>
                    <p className="mt-0.5 truncate text-xs text-v2-neutral-400">{employee.role}</p>
                  </div>
                </div>
                {canPerformActions && canManageTarget(employee.role, employee.id) && (
                  <div className="shrink-0" onClick={(event) => event.stopPropagation()}>
                    <Actions
                      id={employee.id}
                      role={employee.role}
                      name={employee.name}
                      isFounderUser={isFounder}
                      onRefresh={onRefresh}
                    />
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-v2-neutral-300/60 pt-3">
                <span className="text-xs text-v2-neutral-400">Account status</span>
                <StatusBadge status={employee.status} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
