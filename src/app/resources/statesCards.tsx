"use client";

import React from "react";
import { HardDrive, CheckCircle2, AlertOctagon } from "lucide-react";

export type ResourceType = {
  id: string;
  name: string;
  type: string;
  status: "Available" | "Allocated" | "Under Maintenance";
  quantity: number;
  cost: string;
};

type Props = {
  resources: ResourceType[];
};

const StatsCards = ({ resources }: Props) => {
  const totalAssets = resources.reduce((sum, res) => sum + res.quantity, 0);
  const allocatedAssets = resources
    .filter((res) => res.status === "Allocated")
    .reduce((sum, res) => sum + res.quantity, 0);
  const maintenanceAssets = resources
    .filter((res) => res.status === "Under Maintenance")
    .reduce((sum, res) => sum + res.quantity, 0);

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
        {/* Total Assets Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-[#5271ff]/30 hover:shadow-[0_0_20px_rgba(82,113,255,0.15)] hover:-translate-y-0.5">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#5271ff]/10 blur-xl transition-all duration-500 group-hover:scale-150" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Total Units
              </p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {totalAssets}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5271ff]/10 border border-[#5271ff]/20 text-[#5271ff] shadow-[0_0_15px_rgba(82,113,255,0.1)]">
              <HardDrive className="h-6 w-6 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5271ff]" />
            Registered physical & cloud assets
          </div>
        </div>

        {/* Allocated Assets Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-0.5">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-cyan-500/10 blur-xl transition-all duration-500 group-hover:scale-150" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Allocated Units
              </p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-cyan-400 sm:text-4xl">
                {allocatedAssets}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
            Currently active in workspaces
          </div>
        </div>

        {/* Maintenance Assets Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:-translate-y-0.5">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-amber-500/10 blur-xl transition-all duration-500 group-hover:scale-150" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                In Maintenance
              </p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-amber-400 sm:text-4xl">
                {maintenanceAssets}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <AlertOctagon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Awaiting inspection or setup
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsCards;
