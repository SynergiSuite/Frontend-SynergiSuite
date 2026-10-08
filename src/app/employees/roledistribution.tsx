"use client";

import { UsersRound } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Role = {
  label: string;
  value: number;
};

type RoleDistributionProps = {
  roles: Role[];
};

const COLORS = ["#353536", "#706f70", "#8e8d90", "#acadb1", "#d4d8df"];

function RoleTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: Role }>;
}) {
  const entry = payload?.[0];

  if (!active || !entry) {
    return null;
  }

  return (
    <div className="rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-v2-neutral-600">{entry.payload.label}</p>
      <p className="mt-0.5 text-v2-neutral-400">{entry.value} employees</p>
    </div>
  );
}

export default function RoleDistribution({ roles }: RoleDistributionProps) {
  const total = roles.reduce((sum, role) => sum + role.value, 0);

  return (
    <div>
      <div>
        <CardDescription className="text-xs font-medium">Current page</CardDescription>
        <CardTitle className="mt-1 text-lg font-semibold tracking-[-0.025em]">
          Role distribution
        </CardTitle>
        <CardDescription className="mt-1 text-xs leading-5">
          Breakdown of employees shown in this result set.
        </CardDescription>
      </div>

      {roles.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center text-center">
          <span className="grid size-11 place-items-center rounded-2xl bg-v2-neutral-200 text-v2-neutral-400">
            <UsersRound className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-sm text-v2-neutral-400">No roles to display</p>
        </div>
      ) : (
        <>
          <div className="relative mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={roles}
                  dataKey="value"
                  nameKey="label"
                  outerRadius={88}
                  innerRadius={60}
                  paddingAngle={2}
                  stroke="#ebedf1"
                  strokeWidth={2}
                >
                  {roles.map((role, index) => (
                    <Cell key={role.label} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<RoleTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute text-center">
              <span className="block text-2xl font-semibold tracking-[-0.04em] text-v2-neutral-600">
                {total}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-v2-neutral-400">
                Employees
              </span>
            </div>
          </div>

          <Separator className="mt-4 mb-5" />

          <div className="space-y-3">
            {roles.map((role, index) => {
              const percentage = total > 0 ? Math.round((role.value / total) * 100) : 0;
              const color = COLORS[index % COLORS.length];

              return (
                <div key={role.label} className="flex items-center gap-3">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                  <span className="min-w-0 flex-1 truncate text-sm text-v2-neutral-500">{role.label}</span>
                  <span className="text-xs font-medium text-v2-neutral-400">{role.value}</span>
                  <span className="w-8 text-right text-xs font-medium text-v2-neutral-600">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

