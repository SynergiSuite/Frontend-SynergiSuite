"use client";

import React from "react";
import { ChevronLeft, ChevronRight, MessageSquareQuote, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TicketTableRow from "./ticketTableRow";
import type { ClientFeedbackStatus, FeedbackPaginationMeta, TicketItem } from "./types/ticket";

interface TicketTableProps {
  tickets: TicketItem[];
  isLoading: boolean;
  onSelectTicket: (ticket: TicketItem) => void;
  onQuickStatusChange: (ticketId: string | number, newStatus: ClientFeedbackStatus) => void;
  onDeleteTicket?: (ticketId: string | number) => void;
  canManageTickets: boolean;
  onCreateTicket?: () => void;
  // Pagination
  currentPage: number;
  onPageChange: (page: number) => void;
  meta?: FeedbackPaginationMeta;
}

export default function TicketTable({
  tickets,
  isLoading,
  onSelectTicket,
  onQuickStatusChange,
  onDeleteTicket,
  canManageTickets,
  onCreateTicket,
  currentPage,
  onPageChange,
  meta,
}: TicketTableProps) {
  const totalPages = meta?.totalPages ?? 1;
  const totalItems = meta?.totalItems ?? tickets.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-v2-neutral-300 bg-v2-neutral-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-v2-neutral-300 bg-v2-neutral-200/50 text-[11px] font-semibold uppercase tracking-wider text-v2-neutral-400">
              <th className="py-3.5 pl-4 pr-3 sm:pl-6">Ticket & Subject</th>
              <th className="px-3 py-3.5 hidden md:table-cell">Client Account</th>
              <th className="px-3 py-3.5 hidden lg:table-cell">Project Context</th>
              <th className="px-3 py-3.5 hidden sm:table-cell">Satisfaction</th>
              <th className="px-3 py-3.5">Status</th>
              <th className="px-3 py-3.5 hidden xl:table-cell">Date</th>
              <th className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-v2-neutral-200">
            {isLoading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 pl-4 pr-3 sm:pl-6">
                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-v2-neutral-300 rounded" />
                      <div className="h-4 w-48 bg-v2-neutral-300 rounded" />
                      <div className="h-3 w-64 bg-v2-neutral-200 rounded" />
                    </div>
                  </td>
                  <td className="px-3 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-v2-neutral-300 shrink-0" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-24 bg-v2-neutral-300 rounded" />
                        <div className="h-3 w-16 bg-v2-neutral-200 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 hidden lg:table-cell">
                    <div className="h-3.5 w-28 bg-v2-neutral-300 rounded" />
                  </td>
                  <td className="px-3 py-4 hidden sm:table-cell">
                    <div className="h-3.5 w-16 bg-v2-neutral-300 rounded" />
                  </td>
                  <td className="px-3 py-4">
                    <div className="h-6 w-24 bg-v2-neutral-300 rounded-lg" />
                  </td>
                  <td className="px-3 py-4 hidden xl:table-cell">
                    <div className="h-3 w-20 bg-v2-neutral-200 rounded" />
                  </td>
                  <td className="py-4 pl-3 pr-4 sm:pr-6 text-right">
                    <div className="h-8 w-16 bg-v2-neutral-300 rounded-lg ml-auto" />
                  </td>
                </tr>
              ))
            ) : tickets.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <span className="grid size-12 place-items-center rounded-2xl bg-v2-neutral-200 text-v2-neutral-400 mb-3">
                      <MessageSquareQuote className="size-6" />
                    </span>
                    <h3 className="text-sm font-semibold text-v2-neutral-600">
                      No client tickets found
                    </h3>
                    <p className="mt-1 text-xs text-v2-neutral-400">
                      No tickets match the selected filters or search terms. Clear your filter criteria or record a new client ticket.
                    </p>
                    {onCreateTicket && (
                      <Button
                        type="button"
                        onClick={onCreateTicket}
                        className="mt-4 gap-1.5 text-xs"
                      >
                        <PlusCircle className="size-3.5" />
                        Create New Ticket
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <TicketTableRow
                  key={ticket.id}
                  ticket={ticket}
                  onSelectTicket={onSelectTicket}
                  onQuickStatusChange={onQuickStatusChange}
                  onDeleteTicket={onDeleteTicket}
                  canManageTickets={canManageTickets}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && tickets.length > 0 && (
        <div className="flex items-center justify-between border-t border-v2-neutral-300 px-4 py-3 sm:px-6 bg-v2-neutral-100">
          <p className="text-xs text-v2-neutral-400">
            Showing{" "}
            <span className="font-semibold text-v2-neutral-600">
              {tickets.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-v2-neutral-600">
              {totalItems}
            </span>{" "}
            tickets
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-v2-neutral-400 mr-2">
              Page {currentPage} of {Math.max(1, totalPages)}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
