"use client";

import React from "react";
import {
  Building2,
  Calendar,
  FolderKanban,
  MessageSquare,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  ClientFeedbackStatus,
  TICKET_STATUS_CONFIG,
  TICKET_TYPE_OPTIONS,
  type TicketItem,
} from "./types/ticket";

interface TicketTableRowProps {
  ticket: TicketItem;
  onSelectTicket: (ticket: TicketItem) => void;
  onQuickStatusChange: (ticketId: string | number, newStatus: ClientFeedbackStatus) => void;
  onDeleteTicket?: (ticketId: string | number) => void;
  canManageTickets: boolean;
}

export default function TicketTableRow({
  ticket,
  onSelectTicket,
  onQuickStatusChange,
  onDeleteTicket,
  canManageTickets,
}: TicketTableRowProps) {
  const statusCfg = TICKET_STATUS_CONFIG[ticket.status] || TICKET_STATUS_CONFIG.open;
  const typeCfg = TICKET_TYPE_OPTIONS.find((t) => t.value === ticket.feedbackType);

  const clientName = ticket.client?.name || "Client Account";
  const clientCompany = ticket.client?.company || "Direct Client";
  const clientEmail = ticket.client?.email || "";

  const initials = clientName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CL";

  const formattedDate = new Date(ticket.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const displayId =
    typeof ticket.rawId === "number"
      ? `TK-${ticket.rawId}`
      : String(ticket.rawId || ticket.id).slice(0, 8).toUpperCase();

  return (
    <tr className="group border-b border-v2-neutral-200 transition-colors hover:bg-v2-neutral-200/40">
      {/* Ticket ID & Title */}
      <td className="py-4 pl-4 pr-3 sm:pl-6 max-w-xs">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold text-v2-neutral-400 bg-v2-neutral-200/80 px-1.5 py-0.5 rounded-md">
              {displayId}
            </span>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${
                typeCfg?.badgeClass || "bg-v2-neutral-200 text-v2-neutral-500 border-v2-neutral-300"
              }`}
            >
              {typeCfg?.label || ticket.feedbackType}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectTicket(ticket)}
            className="text-left font-semibold text-xs text-v2-neutral-600 hover:text-v2-neutral-500 hover:underline truncate cursor-pointer"
            title={ticket.titleOfFeedback}
          >
            {ticket.titleOfFeedback}
          </button>

          <p className="text-[11px] text-v2-neutral-400 line-clamp-1">
            {ticket.feedback}
          </p>
        </div>
      </td>

      {/* Client Account */}
      <td className="px-3 py-4 hidden md:table-cell">
        <div className="flex items-center gap-2.5 min-w-0" title={clientEmail || undefined}>
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-v2-neutral-500 text-[11px] font-bold text-v2-neutral-100 shadow-xs">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-v2-neutral-600">
              {clientName}
            </p>
            <p className="flex items-center gap-1 truncate text-[11px] text-v2-neutral-400">
              <Building2 className="size-3 shrink-0" />
              <span className="truncate">{clientCompany}</span>
            </p>
          </div>
        </div>
      </td>

      {/* Project & Target */}
      <td className="px-3 py-4 hidden lg:table-cell">
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-medium text-v2-neutral-600 truncate">
            <FolderKanban className="size-3.5 shrink-0 text-v2-neutral-400" />
            <span className="truncate">{ticket.projectName || "Workspace"}</span>
          </div>
          <span className="text-[10px] text-v2-neutral-400 capitalize">
            Target: {ticket.targetType || "project"}
          </span>
        </div>
      </td>

      {/* Rating / Sentiment */}
      <td className="px-3 py-4 hidden sm:table-cell">
        {typeof ticket.starRating === "number" && ticket.starRating > 0 ? (
          <div className="flex items-center gap-1">
            <div className="flex items-center text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-3 ${
                    i < (ticket.starRating || 0)
                      ? "fill-amber-500 text-amber-500"
                      : "text-v2-neutral-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-v2-neutral-500 ml-1">
              {ticket.starRating}.0
            </span>
          </div>
        ) : (
          <span className="text-xs text-v2-neutral-300 font-mono">-</span>
        )}
      </td>

      {/* Status (with Quick Status change for employees) */}
      <td className="px-3 py-4">
        {canManageTickets ? (
          <div className="w-32">
            <Select
              value={ticket.status}
              onValueChange={(val) =>
                onQuickStatusChange(ticket.rawId, val as ClientFeedbackStatus)
              }
            >
              <SelectTrigger className="h-7 w-full rounded-lg border-v2-neutral-300 bg-v2-neutral-100 px-2 text-[11px] font-semibold text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-1 focus-visible:ring-v2-neutral-400/20">
                <div className="flex items-center gap-1.5 truncate">
                  <span className={`size-1.5 rounded-full shrink-0 ${statusCfg.dotClass}`} />
                  <span className="truncate">{statusCfg.label}</span>
                </div>
              </SelectTrigger>
              <SelectContent className="z-[100] rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                {(["open", "in_progress", "in_review", "resolved", "rejected"] as ClientFeedbackStatus[]).map(
                  (st) => {
                    const cfg = TICKET_STATUS_CONFIG[st];
                    return (
                      <SelectItem
                        key={st}
                        value={st}
                        className="cursor-pointer rounded-lg py-1.5 text-xs text-v2-neutral-600 focus:bg-v2-neutral-200/80 focus:text-v2-neutral-600"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`size-2 rounded-full ${cfg.dotClass}`} />
                          <span>{cfg.label}</span>
                        </div>
                      </SelectItem>
                    );
                  }
                )}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${statusCfg.badgeClass}`}
          >
            <span className={`size-1.5 rounded-full ${statusCfg.dotClass}`} />
            {statusCfg.label}
          </span>
        )}
      </td>

      {/* Submission Date */}
      <td className="px-3 py-4 hidden xl:table-cell text-xs text-v2-neutral-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="size-3.5 text-v2-neutral-400" />
          <span>{formattedDate}</span>
        </div>
      </td>

      {/* Action Buttons */}
      <td className="py-4 pl-3 pr-4 sm:pr-6 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onSelectTicket(ticket)}
            className="h-8 gap-1.5 text-xs bg-v2-neutral-200 hover:bg-v2-neutral-300 text-v2-neutral-600 border border-v2-neutral-300 cursor-pointer"
          >
            <MessageSquare className="size-3.5" />
            <span className="hidden sm:inline">Reply</span>
          </Button>

          {canManageTickets && onDeleteTicket && (
            <button
              type="button"
              onClick={() => onDeleteTicket(ticket.rawId)}
              title="Delete Ticket"
              className="grid size-8 place-items-center rounded-lg border border-v2-neutral-300 text-v2-neutral-400 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
