"use client";

import React from "react";
import { Users, Zap, ShieldAlert } from "lucide-react";
import { ClientPriority } from "../enums/clientPriority.enum";
import { ClientType } from "./page";

type Props = {
  clients: ClientType[];
};

const StatsCards = ({ clients }: Props) => {
  const highPriorityClients = clients.filter(
    (client) => Number(client.priority) === ClientPriority.HIGH
  ).length;

  const mediumPriorityClients = clients.filter(
    (client) => Number(client.priority) === ClientPriority.MEDIUM
  ).length;

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
        {/* Total Clients Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-[#5271ff]/30 hover:shadow-[0_0_20px_rgba(82,113,255,0.15)] hover:-translate-y-0.5">
          {/* Accent light glow */}
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#5271ff]/10 blur-xl transition-all duration-500 group-hover:scale-150" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Total Clients
              </p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {clients.length}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5271ff]/10 border border-[#5271ff]/20 text-[#5271ff] shadow-[0_0_15px_rgba(82,113,255,0.1)]">
              <Users className="h-6 w-6 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5271ff]" />
            Active platform partners
          </div>
        </div>

        {/* High Priority Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:-translate-y-0.5">
          {/* Accent light glow */}
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-red-500/10 blur-xl transition-all duration-500 group-hover:scale-150" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                High Priority
              </p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-red-400 sm:text-4xl">
                {highPriorityClients}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <Zap className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            Requires immediate attention
          </div>
        </div>

        {/* Medium Priority Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:-translate-y-0.5">
          {/* Accent light glow */}
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-amber-500/10 blur-xl transition-all duration-500 group-hover:scale-150" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Medium Priority
              </p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-amber-400 sm:text-4xl">
                {mediumPriorityClients}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <ShieldAlert className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Standard operational tracks
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsCards;

