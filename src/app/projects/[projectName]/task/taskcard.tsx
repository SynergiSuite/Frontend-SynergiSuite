"use client";
import React from "react";
import {
  Calendar,
  Flag,
  Trash2,
  UserX,
  Users,
} from "lucide-react";
import { TaskAssignee, TaskTeam } from "./schemas/task";
import { Team } from "@/app/projects/schemas/team";
import {
  formatDueDate,
  getPriorityConfig,
  getStatusConfig,
  isDueToday,
  isOverdue,
} from "./task-utils";

type TaskCardProps = {
  id: string;
  title: string;
  desc?: string;
  due?: string;
  priority?: string;
  status?: string;
  assignee?: TaskAssignee | null;
  teams?: (Team | TaskTeam)[];
  assigned_to?: string[];
  onClick?: () => void;
  onDeleteClick?: (taskId: string) => void;
  canDelete?: boolean;
  draggable?: boolean;
  isDragging?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
};

export default function TaskCard({
  id,
  title,
  desc,
  due,
  priority,
  status,
  assignee,
  teams = [],
  assigned_to = [],
  onClick,
  onDeleteClick,
  canDelete,
  draggable,
  isDragging,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  const statusCfg = getStatusConfig(status);
  const priorityCfg = getPriorityConfig(priority);
  const overdue = isOverdue(due, status);
  const dueToday = isDueToday(due);
  const isClickable = typeof onClick === "function";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const primaryTeam = teams && teams.length > 0 ? teams[0] : null;
  const legacyTeamNames = assigned_to && assigned_to.length > 0 ? assigned_to : [];

  return (
    <div
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`group relative flex flex-col justify-between rounded-xl border p-3.5 sm:p-4 transition-all duration-200 select-none h-full min-h-[140px] ${
        isDragging
          ? "opacity-40 scale-[0.98] ring-2 ring-sky-500/50 bg-[#1e1e24] border-sky-500/50 shadow-2xl"
          : "border-v2-neutral-500/70 bg-[#161619]/95 hover:bg-[#1e1e24] hover:border-v2-neutral-400 hover:shadow-lg hover:shadow-black/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
      } ${isClickable ? "cursor-pointer" : ""}`}
    >
      {/* Top row: Priority Flag & Status Pill & Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* ClickUp Priority Flag */}
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border ${priorityCfg.badgeClass}`}
            title={`Priority: ${priorityCfg.label}`}
          >
            <Flag className="size-3 shrink-0" style={{ color: priorityCfg.flagColor }} />
            <span>{priorityCfg.label}</span>
          </span>

          {/* Status badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium border ${statusCfg.badgeClass}`}
          >
            <span
              className="size-1.5 rounded-full shadow-xs shrink-0"
              style={{ backgroundColor: statusCfg.dotColor }}
            />
            <span className="truncate">{statusCfg.label}</span>
          </span>
        </div>

        {/* Delete action button */}
        {canDelete && onDeleteClick && (
          <button
            type="button"
            aria-label="Delete task"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-all p-1 rounded-lg text-v2-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>

      {/* Title & Description */}
      <div className="my-2.5 flex-1 min-w-0">
        <h4 className="text-sm font-semibold tracking-tight text-v2-neutral-100 group-hover:text-white transition-colors line-clamp-2">
          {title}
        </h4>
        {desc && (
          <p className="mt-1 text-xs text-v2-neutral-400 group-hover:text-v2-neutral-300 transition-colors line-clamp-2 leading-relaxed">
            {desc}
          </p>
        )}
      </div>

      {/* Bottom Footer: Due Date & Assignment */}
      <div className="flex items-center justify-between gap-2 border-t border-v2-neutral-500/40 pt-2.5 text-xs">
        {/* Due Date pill */}
        <div
          className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium ${
            overdue
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/35"
              : dueToday
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/35"
              : "bg-v2-neutral-500/20 text-v2-neutral-300 border border-v2-neutral-500/40"
          }`}
        >
          <Calendar className="size-3 shrink-0" />
          <span className="truncate">{formatDueDate(due)}</span>
        </div>

        {/* Assignment Display */}
        <div className="flex items-center gap-1.5 overflow-hidden min-w-0 max-w-[55%] justify-end">
          {assignee ? (
            /* Specific Employee Assigned */
            <div
              className="flex items-center gap-1.5 rounded-lg border border-v2-neutral-500/70 bg-v2-neutral-500/30 px-2 py-0.5 text-[11px] text-v2-neutral-200 truncate"
              title={`${assignee.name} (${assignee.email})${primaryTeam ? ` • ${primaryTeam.name}` : ""}`}
            >
              <span className="grid size-4.5 place-items-center rounded-full bg-sky-500/25 text-[9px] font-bold text-sky-300 shrink-0">
                {getInitials(assignee.name)}
              </span>
              <span className="truncate font-medium">{assignee.name}</span>
            </div>
          ) : primaryTeam ? (
            /* Team Assigned (no specific employee) */
            <div
              className="flex items-center gap-1.5 rounded-lg border border-v2-neutral-500/70 bg-v2-neutral-500/30 px-2 py-0.5 text-[11px] font-medium text-v2-neutral-300 truncate"
              title={`Squad: ${primaryTeam.name}`}
            >
              <Users className="size-3 text-sky-400 shrink-0" />
              <span className="truncate">{primaryTeam.name}</span>
            </div>
          ) : legacyTeamNames.length > 0 ? (
            /* Fallback legacy team array */
            <div
              className="flex items-center gap-1.5 rounded-lg border border-v2-neutral-500/70 bg-v2-neutral-500/30 px-2 py-0.5 text-[11px] font-medium text-v2-neutral-300 truncate"
              title={`Squad: ${legacyTeamNames.join(", ")}`}
            >
              <Users className="size-3 text-sky-400 shrink-0" />
              <span className="truncate">{legacyTeamNames[0]}</span>
            </div>
          ) : (
            /* Unassigned */
            <div className="flex items-center gap-1 text-[11px] text-v2-neutral-400">
              <UserX className="size-3 shrink-0" />
              <span>Unassigned</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
