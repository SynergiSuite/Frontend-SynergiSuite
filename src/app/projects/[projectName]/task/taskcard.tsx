"use client";
import React, { useState } from "react";
import { Trash } from "lucide-react";

export default function TaskCard({
  id,
  title,
  desc,
  due,
  priority,
  status,
  assigned_to,
  onClick,
  onDeleteClick,
  canDelete,
  draggable,
  onDragStart,
  onDragEnd,
}: {
  id: string;
  title: string;
  desc: string;
  due: string;
  priority: string;
  status: string;
  assigned_to: string[];
  onClick?: () => void;
  onDeleteClick?: (taskId: string) => void;
  canDelete?: boolean;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
}) {
  const normalizedStatus = status?.trim().toLowerCase();
  const statusStyles =
    normalizedStatus === "completed"
      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      : normalizedStatus === "blocked"
        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
        : normalizedStatus === "in_progress"
          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
          : "bg-white/[0.04] text-white/60 border border-white/[0.08]";

  const normalizedPriority = priority?.trim().toLowerCase();
  const priorityStyles =
    normalizedPriority === "low"
      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
      : normalizedPriority === "medium"
        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
        : normalizedPriority === "high"
          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          : "bg-white/[0.04] text-white/60 border border-white/[0.08]";

  const isClickable = typeof onClick === "function";
  const [isTrashActive, setIsTrashActive] = useState(false);

  return (
    <>
      <div
        className={`group bg-[#0a0826]/40 border border-white/[0.08] backdrop-blur-md rounded-2xl p-4 h-full flex flex-col hover:border-[#5271ff]/30 hover:shadow-[0_0_20px_rgba(82,113,255,0.15)] transition-all duration-300 ${
          isClickable ? "cursor-pointer" : ""
        }`}
        onClick={onClick}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
      >
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-white group-hover:text-[#5271ff] transition-colors truncate">{title}</h4>
            <p className="text-sm text-ellipsis overflow-hidden max-w-[180px] text-white/50 mt-1 line-clamp-2">{desc}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles}`}
            >
              {status}
            </span>
            {canDelete ? (
              <button
                type="button"
                aria-pressed={isTrashActive}
                aria-label={isTrashActive ? "Trash marked" : "Mark as trash"}
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${
                  isTrashActive
                    ? "border-red-500 bg-red-500/10 text-red-400"
                    : "border-white/[0.08] bg-[#030114]/40 text-white/40 hover:border-red-500 hover:text-red-400"
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsTrashActive((prev) => !prev);
                  onDeleteClick?.(id);
                }}
              >
                <Trash className="h-4.5 w-4.5" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm text-white/40 border-t border-white/[0.04] pt-3">
          <div className="flex items-center justify-between">
            <span>Due Date</span>
            <span className="text-white/70 font-semibold">{due}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Priority</span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${priorityStyles}`}
            >
              {priority}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.04] text-sm text-white/40">
          <span>Assigned: </span>
          <span className="text-white/70 font-semibold ml-1">
            {assigned_to?.length ? assigned_to?.join(", ") : "Unassigned"}
          </span>
        </div>
      </div>
    </>
  );
}
