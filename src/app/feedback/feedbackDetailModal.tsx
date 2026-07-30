"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageSquareQuote,
  Star,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  Building,
  Send,
  Sliders,
  ChevronDown,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { updateClientFeedbackApi, AllowedFeedbackStatus } from "./apis/updateClientFeedbackApi";
import { getFeedbackRepliesApi, FeedbackReply } from "./apis/getFeedbackRepliesApi";

export interface FeedbackDetailData {
  rawId?: string | number;
  id: string;
  title: string;
  category: string;
  projectName: string;
  message: string;
  status: string;
  rating?: number;
  createdAt: string;
  clientName?: string;
  clientEmail?: string;
  reply?: string;
  replyAt?: string;
}

interface FeedbackDetailModalProps {
  feedback: FeedbackDetailData | null;
  onClose: () => void;
  onRefresh?: () => Promise<void> | void;
  onUpdateFeedback?: (updated: { id: string; status: string; reply?: string }) => void;
  isManagementRole?: boolean;
}

export default function FeedbackDetailModal({
  feedback,
  onClose,
  onRefresh,
  onUpdateFeedback,
  isManagementRole = true,
}: FeedbackDetailModalProps) {
  const [isManaging, setIsManaging] = useState(false);
  const [status, setStatus] = useState<string>(feedback?.status || "In Review");
  const [replyText, setReplyText] = useState(feedback?.reply || "");
  const [replies, setReplies] = useState<FeedbackReply[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawStatusMap: Record<string, AllowedFeedbackStatus> = {
    Open: "open",
    "In Review": "in_review",
    "In Progress": "in_progress",
    Resolved: "resolved",
    Rejected: "rejected",
  };

  const fetchReplies = useCallback(async () => {
    if (!feedback) return;
    const targetId = feedback.rawId ?? feedback.id;
    try {
      setIsLoadingReplies(true);
      const data = await getFeedbackRepliesApi(targetId);
      setReplies(data);
    } catch (err) {
      console.error("Failed to load replies:", err);
    } finally {
      setIsLoadingReplies(false);
    }
  }, [feedback]);

  useEffect(() => {
    if (feedback) {
      setStatus(feedback.status || "In Review");
      setReplyText(feedback.reply || "");
      void fetchReplies();
    }
  }, [feedback, fetchReplies]);

  if (!feedback) return null;

  const handleSaveManagement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const targetId = feedback.rawId ?? feedback.id;
      const targetStatus: AllowedFeedbackStatus =
        rawStatusMap[status] ||
        (status.toLowerCase().replace(" ", "_") as AllowedFeedbackStatus);

      await updateClientFeedbackApi({
        id: targetId,
        status: targetStatus,
        reply: replyText.trim() || undefined,
      });

      toast.success("Feedback ticket updated successfully!");

      // Update state locally in real time
      if (onUpdateFeedback) {
        onUpdateFeedback({
          id: feedback.id,
          status,
          reply: replyText.trim() || undefined,
        });
      }

      if (onRefresh) {
        await onRefresh();
      }
      await fetchReplies();
      setIsManaging(false);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to update feedback";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (statusVal: string) => {
    const norm = (statusVal || "").trim().toLowerCase();
    if (norm === "in_progress" || norm === "in progress") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
          <Clock className="h-3.5 w-3.5" />
          In Progress
        </span>
      );
    }
    if (norm === "in_review" || norm === "in review") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
          <AlertCircle className="h-3.5 w-3.5" />
          In Review
        </span>
      );
    }
    if (norm === "resolved") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Resolved
        </span>
      );
    }
    if (norm === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]">
          <X className="h-3.5 w-3.5" />
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
        Open
      </span>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop Overlay */}
        <div
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 18 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 14 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/[0.1] bg-[#0c0a2f] bg-gradient-to-br from-[#5271ff]/10 via-[#0c0a2f] to-[#0a0826] shadow-[0_24px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
        >
          {/* Top Neon Stripe Accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[#5271ff] via-cyan-400 to-[#3a4ec4]" />

          {/* Modal Header */}
          <div className="flex items-start justify-between border-b border-white/[0.08] p-6 sm:p-8">
            <div className="space-y-2 pr-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                  {feedback.id}
                </span>
                <span className="rounded-md border border-[#5271ff]/30 bg-[#5271ff]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5271ff]">
                  {feedback.category}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-white/70">
                  <Building className="h-3 w-3 text-cyan-400" />
                  {feedback.projectName}
                </span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                {feedback.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="max-h-[60vh] space-y-6 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
            {/* Meta Row: Status & Ratings */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0a0826]/50 p-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Status:
                </span>
                {getStatusBadge(status)}
              </div>

              <div className="flex items-center gap-3">
                {feedback.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-white/40 mr-1">Rating:</span>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (feedback.rating || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>
                )}
                <span className="text-xs text-white/40 font-medium">
                  {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Client Info (if available) */}
            {(feedback.clientName || feedback.clientEmail) && (
              <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-xs text-white/70">
                <User className="h-4 w-4 text-[#5271ff]" />
                <span>Submitted by:</span>
                <strong className="text-white">{feedback.clientName || "Client"}</strong>
                {feedback.clientEmail && (
                  <span className="text-white/40">({feedback.clientEmail})</span>
                )}
              </div>
            )}

            {/* Feedback Message */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">
                Feedback Details
              </h4>
              <div className="rounded-2xl border border-white/[0.08] bg-[#030114]/60 p-5 text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
                {feedback.message}
              </div>
            </div>

            {/* Replies Thread Section */}
            {(replies.length > 0 || feedback.reply) && !isManaging && (
              <div className="space-y-3 pt-2 border-t border-white/[0.08]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#5271ff] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Responses & Activity ({replies.length || (feedback.reply ? 1 : 0)})
                </h4>

                {isLoadingReplies ? (
                  <div className="flex items-center gap-2 text-xs text-white/40 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-[#5271ff]" />
                    Fetching response thread...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {replies.length > 0
                      ? replies.map((r, idx) => (
                          <div
                            key={r.id || idx}
                            className="rounded-2xl border border-[#5271ff]/30 bg-[#5271ff]/10 p-4 space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs text-white/50">
                              <span className="font-semibold text-white">
                                {r.replier?.name || r.sender?.name || r.createdBy?.name || "Management Team"}
                              </span>
                              {r.createdAt && (
                                <span>
                                  {new Date(r.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                              {r.message || r.reply || r.response}
                            </p>
                          </div>
                        ))
                      : feedback.reply && (
                          <div className="rounded-2xl border border-[#5271ff]/30 bg-[#5271ff]/10 p-4 text-sm text-white/90 leading-relaxed">
                            {feedback.reply}
                          </div>
                        )}
                  </div>
                )}
              </div>
            )}

            {/* Manage Form Expanded */}
            <AnimatePresence>
              {isManaging && (
                <motion.form
                  onSubmit={handleSaveManagement}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 rounded-2xl border border-[#5271ff]/40 bg-[#0a0826]/80 p-5 shadow-[0_0_30px_rgba(82,113,255,0.15)]"
                >
                  <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 text-sm font-bold text-white">
                    <Sliders className="h-4 w-4 text-[#5271ff]" />
                    <span>Manage Ticket & Send Response</span>
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
                      Update Ticket Status
                    </label>
                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="h-11 w-full appearance-none rounded-xl border border-white/[0.1] bg-[#0c0a2f] px-4 text-sm text-white outline-none transition focus:border-[#5271ff]"
                      >
                        <option value="Open" className="bg-[#0c0a2f] text-white">Open (open)</option>
                        <option value="In Review" className="bg-[#0c0a2f] text-white">In Review (in_review)</option>
                        <option value="In Progress" className="bg-[#0c0a2f] text-white">In Progress (in_progress)</option>
                        <option value="Resolved" className="bg-[#0c0a2f] text-white">Resolved (resolved)</option>
                        <option value="Rejected" className="bg-[#0c0a2f] text-white">Rejected (rejected)</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
                    </div>
                  </div>

                  {/* Reply Textarea */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
                      Add Response / Reply Message (Optional)
                    </label>
                    <textarea
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your response message to the client..."
                      className="w-full rounded-xl border border-white/[0.1] bg-[#030114]/60 p-4 text-sm text-white placeholder-white/20 outline-none focus:border-[#5271ff]"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsManaging(false)}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-5 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(82,113,255,0.3)] hover:opacity-95 disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{isSubmitting ? "Sending..." : "Send Feedback"}</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between border-t border-white/[0.08] bg-[#0a0826]/40 p-6 sm:px-8">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Close
            </button>

            {!isManaging && (
              <button
                type="button"
                onClick={() => setIsManaging(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-6 py-2.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(82,113,255,0.35)] transition-all duration-300 hover:opacity-95 active:scale-95 cursor-pointer"
              >
                <Sliders className="h-4 w-4" />
                <span>Manage Ticket</span>
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
