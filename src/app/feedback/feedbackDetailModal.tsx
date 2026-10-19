"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Check,
  FolderKanban,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Send,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateClientFeedbackApi } from "./apis/updateClientFeedbackApi";
import { getFeedbackRepliesApi, FeedbackReply } from "./apis/getFeedbackRepliesApi";
import {
  ClientFeedbackStatus,
  TICKET_STATUS_CONFIG,
  TICKET_TYPE_OPTIONS,
  type TicketItem,
} from "./types/ticket";

interface FeedbackDetailModalProps {
  ticket: TicketItem | null;
  open: boolean;
  onClose: () => void;
  onTicketUpdated: (updated: {
    id: string | number;
    status: ClientFeedbackStatus;
    reply?: string;
  }) => void;
  canManage: boolean;
}

export default function FeedbackDetailModal({
  ticket,
  open,
  onClose,
  onTicketUpdated,
  canManage,
}: FeedbackDetailModalProps) {
  const [currentStatus, setCurrentStatus] = useState<ClientFeedbackStatus>(
    ticket?.status || "open"
  );
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<FeedbackReply[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchReplies = useCallback(async () => {
    if (!ticket) return;
    try {
      setIsLoadingReplies(true);
      const data = await getFeedbackRepliesApi(ticket.rawId);
      setReplies(data);
    } catch (err) {
      console.warn("Failed to load replies:", err);
    } finally {
      setIsLoadingReplies(false);
    }
  }, [ticket]);

  useEffect(() => {
    if (ticket && open) {
      setCurrentStatus(ticket.status || "open");
      setReplyText("");
      void fetchReplies();
    }
  }, [ticket, open, fetchReplies]);

  if (!ticket) return null;

  const statusCfg = TICKET_STATUS_CONFIG[currentStatus] || TICKET_STATUS_CONFIG.open;
  const typeCfg = TICKET_TYPE_OPTIONS.find((t) => t.value === ticket.feedbackType);

  const clientName = ticket.client?.name || "Client Account";
  const clientCompany = ticket.client?.company || "Direct Client Account";
  const clientEmail = ticket.client?.email || "";
  const clientPhone = ticket.client?.phone || "";

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
    hour: "2-digit",
    minute: "2-digit",
  });

  const displayId =
    typeof ticket.rawId === "number"
      ? `TK-${ticket.rawId}`
      : String(ticket.rawId || ticket.id).slice(0, 8).toUpperCase();

  const copyToClipboard = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    window.setTimeout(() => setCopiedField(null), 1800);
  };

  // Direct status change handler
  const handleStatusChange = async (newStatus: ClientFeedbackStatus) => {
    if (!canManage || newStatus === currentStatus) return;

    try {
      setIsUpdatingStatus(true);
      await updateClientFeedbackApi({
        id: ticket.rawId,
        status: newStatus,
      });

      setCurrentStatus(newStatus);
      onTicketUpdated({
        id: ticket.rawId,
        status: newStatus,
      });
      toast.success(`Ticket status updated to ${TICKET_STATUS_CONFIG[newStatus].label}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update ticket status";
      toast.error(msg);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Send reply handler (optionally with updated status)
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error("Please enter a reply message.");
      return;
    }

    try {
      setIsSubmittingReply(true);
      await updateClientFeedbackApi({
        id: ticket.rawId,
        status: currentStatus,
        reply: replyText.trim(),
      });

      toast.success("Reply sent to client successfully!");
      setReplyText("");
      onTicketUpdated({
        id: ticket.rawId,
        status: currentStatus,
        reply: replyText.trim(),
      });
      await fetchReplies();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send reply";
      toast.error(msg);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-v2-neutral-600/80 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="relative z-10 flex flex-col w-full max-w-3xl max-h-[90vh] rounded-2xl border border-v2-neutral-400 bg-v2-neutral-600 shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-v2-neutral-500 bg-v2-neutral-600 px-6 py-5 shrink-0">
              <div className="space-y-1.5 min-w-0 pr-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-v2-neutral-300 bg-v2-neutral-500 px-2 py-0.5 rounded-md">
                    {displayId}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${
                      typeCfg?.badgeClass || "bg-v2-neutral-500 text-v2-neutral-200"
                    }`}
                  >
                    {typeCfg?.label || ticket.feedbackType}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-semibold ${statusCfg.badgeClass}`}
                  >
                    <span className={`size-1.5 rounded-full ${statusCfg.dotClass}`} />
                    {statusCfg.label}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-v2-neutral-100 tracking-tight line-clamp-1">
                  {ticket.titleOfFeedback}
                </h2>

                <p className="flex items-center gap-2 text-xs text-v2-neutral-400">
                  <span className="flex items-center gap-1">
                    <FolderKanban className="size-3.5 text-v2-neutral-400" />
                    <span>{ticket.projectName || "General Workspace"}</span>
                  </span>
                  <span>•</span>
                  <span>Submitted {formattedDate}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl border border-v2-neutral-500 text-v2-neutral-400 hover:bg-v2-neutral-500 hover:text-v2-neutral-100 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Client Info Strip & Status Controller */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Client Profile Card */}
                <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/30 p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-v2-neutral-100 text-sm font-bold text-v2-neutral-600 shadow-sm">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-v2-neutral-100">
                        {clientName}
                      </p>
                      <p className="flex items-center gap-1.5 truncate text-xs text-v2-neutral-400 mt-0.5">
                        <Building2 className="size-3.5 shrink-0" />
                        <span className="truncate">{clientCompany}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {clientEmail && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(clientEmail, "email")}
                        title={`Copy ${clientEmail}`}
                        className="p-2 rounded-lg border border-v2-neutral-500 text-v2-neutral-400 hover:text-v2-neutral-100 hover:bg-v2-neutral-500 transition-colors cursor-pointer"
                      >
                        {copiedField === "email" ? (
                          <Check className="size-3.5 text-emerald-400" />
                        ) : (
                          <Mail className="size-3.5" />
                        )}
                      </button>
                    )}
                    {clientPhone && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(clientPhone, "phone")}
                        title={`Copy ${clientPhone}`}
                        className="p-2 rounded-lg border border-v2-neutral-500 text-v2-neutral-400 hover:text-v2-neutral-100 hover:bg-v2-neutral-500 transition-colors cursor-pointer"
                      >
                        {copiedField === "phone" ? (
                          <Check className="size-3.5 text-emerald-400" />
                        ) : (
                          <Phone className="size-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Selector Box (Employee POV) */}
                <div className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/30 p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-v2-neutral-400">
                    Manage Status
                  </span>
                  <div className="mt-2">
                    {canManage ? (
                      <Select
                        value={currentStatus}
                        onValueChange={(val) =>
                          handleStatusChange(val as ClientFeedbackStatus)
                        }
                        disabled={isUpdatingStatus}
                      >
                        <SelectTrigger className="h-9 w-full rounded-xl border-v2-neutral-400 bg-v2-neutral-600 px-3 text-xs font-semibold text-v2-neutral-100 shadow-none hover:border-v2-neutral-300">
                          <SelectValue placeholder="Update status..." />
                        </SelectTrigger>
                        <SelectContent className="z-[100] rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                          {(
                            [
                              "open",
                              "in_progress",
                              "in_review",
                              "resolved",
                              "rejected",
                            ] as ClientFeedbackStatus[]
                          ).map((st) => {
                            const cfg = TICKET_STATUS_CONFIG[st];
                            return (
                              <SelectItem
                                key={st}
                                value={st}
                                className="cursor-pointer rounded-lg py-2 text-xs text-v2-neutral-600 focus:bg-v2-neutral-200/80 focus:text-v2-neutral-600"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`size-2 rounded-full ${cfg.dotClass}`}
                                  />
                                  <span>{cfg.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${statusCfg.badgeClass}`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${statusCfg.dotClass}`}
                        />
                        {statusCfg.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Client Original Feedback Content */}
              <div className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/20 p-4 sm:p-5">
                <div className="flex items-center justify-between pb-3 border-b border-v2-neutral-500">
                  <span className="text-xs font-semibold uppercase tracking-wider text-v2-neutral-300">
                    Client Description & Submission
                  </span>

                  {typeof ticket.starRating === "number" &&
                    ticket.starRating > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`size-3.5 ${
                                i < (ticket.starRating || 0)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-v2-neutral-400"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-amber-400">
                          {ticket.starRating}.0
                        </span>
                      </div>
                    )}
                </div>

                <div className="mt-3 text-xs leading-relaxed text-v2-neutral-200 whitespace-pre-wrap">
                  {ticket.feedback}
                </div>
              </div>

              {/* Conversation & Threaded Replies Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-v2-neutral-300 flex items-center gap-2">
                    <MessageSquare className="size-3.5 text-v2-neutral-400" />
                    <span>Communication Thread ({replies.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => void fetchReplies()}
                    title="Refresh thread"
                    className="p-1 rounded-md text-v2-neutral-400 hover:text-v2-neutral-200 cursor-pointer"
                  >
                    <RefreshCw className={`size-3.5 ${isLoadingReplies ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {isLoadingReplies ? (
                  <div className="py-8 flex flex-col items-center justify-center text-v2-neutral-400">
                    <Loader2 className="size-6 animate-spin mb-2" />
                    <p className="text-xs">Loading replies...</p>
                  </div>
                ) : replies.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-v2-neutral-500 p-6 text-center text-v2-neutral-400">
                    <MessageSquare className="size-6 mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-semibold text-v2-neutral-300">
                      No replies logged yet
                    </p>
                    <p className="text-[11px] text-v2-neutral-400 mt-0.5">
                      Send an official update, resolution, or inquiry to the client using the reply composer below.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {replies.map((reply, idx) => {
                      const isEmployee = Boolean(reply.replier || reply.createdBy);
                      const authorName =
                        reply.replier?.name ||
                        reply.createdBy?.name ||
                        (isEmployee ? "Workspace Staff" : clientName);
                      const replyTime = reply.createdAt
                        ? new Date(reply.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now";

                      return (
                        <div
                          key={reply.id || idx}
                          className={`rounded-xl border p-4 ${
                            isEmployee
                              ? "border-v2-neutral-400 bg-v2-neutral-500/40 ml-4 sm:ml-8"
                              : "border-v2-neutral-500 bg-v2-neutral-500/20 mr-4 sm:mr-8"
                          }`}
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-v2-neutral-500/50">
                            <div className="flex items-center gap-2">
                              <span
                                className={`size-6 rounded-full grid place-items-center text-[10px] font-bold ${
                                  isEmployee
                                    ? "bg-v2-neutral-100 text-v2-neutral-600"
                                    : "bg-v2-neutral-400 text-v2-neutral-100"
                                }`}
                              >
                                {authorName.charAt(0).toUpperCase()}
                              </span>
                              <span className="text-xs font-semibold text-v2-neutral-100">
                                {authorName}
                              </span>
                              {isEmployee && (
                                <span className="rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 text-[10px] font-medium">
                                  Support
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-v2-neutral-400">
                              {replyTime}
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-v2-neutral-200 whitespace-pre-wrap">
                            {reply.message}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Employee Reply Composer */}
              {canManage && (
                <form
                  onSubmit={handleSendReply}
                  className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/30 p-4 space-y-3"
                >
                  <label className="block text-xs font-semibold uppercase tracking-wider text-v2-neutral-300">
                    Reply to Client
                  </label>

                  <textarea
                    rows={3}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official reply, action plan, or resolution to the client..."
                    className="w-full rounded-xl border border-v2-neutral-400 bg-v2-neutral-600 p-3 text-xs text-v2-neutral-100 outline-none placeholder:text-v2-neutral-400 focus:border-v2-neutral-300 focus:ring-2 focus:ring-v2-neutral-400/20 resize-none"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    {/* Status change along with reply */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-v2-neutral-300">Status with reply:</span>
                      <div className="w-36">
                        <Select
                          value={currentStatus}
                          onValueChange={(val) =>
                            setCurrentStatus(val as ClientFeedbackStatus)
                          }
                        >
                          <SelectTrigger className="h-8 w-full rounded-lg border-v2-neutral-400 bg-v2-neutral-600 px-2 text-xs text-v2-neutral-100 shadow-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="z-[100] rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                            {(
                              [
                                "open",
                                "in_progress",
                                "in_review",
                                "resolved",
                                "rejected",
                              ] as ClientFeedbackStatus[]
                            ).map((st) => (
                              <SelectItem
                                key={st}
                                value={st}
                                className="cursor-pointer text-xs"
                              >
                                {TICKET_STATUS_CONFIG[st].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmittingReply || !replyText.trim()}
                      className="gap-1.5 text-xs h-8 px-4"
                    >
                      {isSubmittingReply ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Send className="size-3.5" />
                      )}
                      <span>Send Reply</span>
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex shrink-0 items-center justify-between border-t border-v2-neutral-500 bg-v2-neutral-600/90 px-6 py-4">
              <span className="text-xs text-v2-neutral-400">
                Ticket ID:{" "}
                <span className="font-mono text-[11px] text-v2-neutral-300">
                  {ticket.id}
                </span>
              </span>

              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
