"use client";

import React from "react";
import { Pencil, Trash } from "lucide-react";
import { ResourceType } from "./statesCards";

type Props = {
  resource: ResourceType;
  onSelect: (resource: ResourceType) => void;
  onEdit: (resource: ResourceType) => void;
  onDelete: (id: string) => void;
};

const ResourceRow = ({
  resource,
  onSelect,
  onEdit,
  onDelete,
}: Props) => {
  const getDisplayValue = (value?: string | number) => {
    return value !== undefined && value !== null && String(value).trim() !== ""
      ? String(value)
      : "N/A";
  };

  const status = resource.status || "Available";

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(resource)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect(resource);
          }
        }}
        className="grid w-full gap-4 border-b border-white/[0.08] px-4 py-4 text-left transition-all duration-300 hover:bg-white/[0.03] hover:translate-x-1 focus:bg-white/[0.03] focus:outline-none last:border-b-0 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.6fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] md:items-center md:gap-0 md:px-6 md:py-5"
      >
        {/* Name */}
        <div className="min-w-0">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
            Resource Name
          </p>
          <p className="truncate font-semibold text-white text-sm" title={getDisplayValue(resource.name)}>
            {getDisplayValue(resource.name)}
          </p>
        </div>

        {/* Type */}
        <div className="min-w-0">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
            Type
          </p>
          <div className="truncate text-white/70 text-sm" title={getDisplayValue(resource.type)}>
            {getDisplayValue(resource.type)}
          </div>
        </div>

        {/* Status */}
        <div className="min-w-0">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
            Status
          </p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold border ${
              status === "Available"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                : status === "Allocated"
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
            }`}
            title={status}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${
              status === "Available"
                ? "bg-emerald-400 animate-pulse"
                : status === "Allocated"
                  ? "bg-cyan-400"
                  : "bg-amber-400"
            }`} />
            {status}
          </span>
        </div>

        {/* Quantity */}
        <div className="min-w-0">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
            Qty
          </p>
          <div className="truncate text-white/80 text-sm" title={getDisplayValue(resource.quantity)}>
            {getDisplayValue(resource.quantity)}
          </div>
        </div>

        {/* Cost */}
        <div className="min-w-0">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
            Estimated Cost
          </p>
          <div className="truncate text-white/70 text-sm" title={getDisplayValue(resource.cost)}>
            {getDisplayValue(resource.cost)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex min-w-0 items-center justify-between gap-3 md:justify-start">
          <p className="text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
            Actions
          </p>
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              aria-label="Edit resource"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(resource);
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/60 transition-all duration-200 hover:bg-white/[0.08] hover:border-[#5271ff]/30 hover:text-white"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label="Delete resource"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(resource.id);
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/60 transition-all duration-200 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
            >
              <Trash className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourceRow;
