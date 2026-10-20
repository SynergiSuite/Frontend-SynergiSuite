"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlusCircle, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createTicketApi } from "./apis/createTicketApi";
import { submitClientFeedbackApi } from "./apis/submitClientFeedbackApi";
import {
  ClientFeedbackTargetType,
  ClientFeedbackType,
  TICKET_TYPE_OPTIONS,
} from "./types/ticket";

const RATING_LABELS: Record<number, string> = {
  1: "1.0 ★ — Poor / Critical issue",
  2: "2.0 ★ — Fair / Needs attention",
  3: "3.0 ★ — Satisfactory / Moderate",
  4: "4.0 ★ — Good / High quality",
  5: "5.0 ★ — Excellent / Exceeded expectations",
};

interface CreateTicketModalProps {
  open: boolean;
  onClose: () => void;
  onTicketCreated: () => void;
  clients: Array<{ id: string; name: string; company?: string }>;
  projects: Array<{ id: string; name: string }>;
  isClient?: boolean;
  defaultClientId?: string;
  clientName?: string;
}

export default function CreateTicketModal({
  open,
  onClose,
  onTicketCreated,
  clients,
  projects,
  isClient = false,
  defaultClientId,
  clientName,
}: CreateTicketModalProps) {
  const [selectedClientId, setSelectedClientId] = useState(defaultClientId || "");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ClientFeedbackType>("issue");
  const [targetType, setTargetType] =
    useState<ClientFeedbackTargetType>("project");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setSelectedClientId(defaultClientId || "");
    setSelectedProjectId("");
    setTitle("");
    setCategory("issue");
    setTargetType("project");
    setMessage("");
    setRating(0);
    setHoverRating(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Please enter a ticket title and description.");
      return;
    }

    if (!isClient && !selectedClientId) {
      toast.error("Please select a client account.");
      return;
    }

    if (!selectedProjectId) {
      toast.error("Please select an associated project.");
      return;
    }

    try {
      setIsSubmitting(true);
      const starRatingValue = rating > 0 ? rating : undefined;

      if (isClient) {
        // Direct client feedback submission endpoint
        await submitClientFeedbackApi({
          feedbackTitle: title.trim(),
          category,
          projectId: selectedProjectId,
          feedback: message.trim(),
          rating: starRatingValue,
        });
      } else {
        await createTicketApi({
          clientId: selectedClientId,
          titleOfFeedback: title.trim(),
          feedback: message.trim(),
          feedbackType: category,
          targetType,
          typeId: selectedProjectId,
          starRating: starRatingValue,
        });
      }

      toast.success(
        isClient
          ? "Your ticket has been submitted successfully!"
          : "Client ticket registered successfully!"
      );
      resetForm();
      onClose();
      onTicketCreated();
    } catch (err) {
      // Fallback: If submitClientFeedbackApi had an issue and we have clientId, try createTicketApi
      if (isClient && (defaultClientId || selectedClientId)) {
        try {
          const starRatingValue = rating > 0 ? rating : undefined;
          await createTicketApi({
            clientId: defaultClientId || selectedClientId,
            titleOfFeedback: title.trim(),
            feedback: message.trim(),
            feedbackType: category,
            targetType,
            typeId: selectedProjectId,
            starRating: starRatingValue,
          });
          toast.success("Your ticket has been submitted successfully!");
          resetForm();
          onClose();
          onTicketCreated();
          return;
        } catch {
          // fall through to error handling
        }
      }

      const msg = err instanceof Error ? err.message : "Failed to create ticket";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-v2-neutral-600/75 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="relative z-10 w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border border-v2-neutral-400 bg-v2-neutral-600 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-v2-neutral-500 px-6 py-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-v2-neutral-100 text-v2-neutral-600 shadow-sm">
                  <PlusCircle className="size-4.5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-v2-neutral-100">
                    {isClient ? "Create New Ticket" : "Register Client Ticket"}
                  </h3>
                  <p className="text-xs text-v2-neutral-400">
                    {isClient
                      ? "Submit an inquiry, bug report, or deliverable request for your project."
                      : "Record an inquiry, bug report, or deliverable request for a client."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-v2-neutral-500 text-v2-neutral-400 hover:bg-v2-neutral-500 hover:text-v2-neutral-100 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
              {/* Client & Project Selectors */}
              {isClient ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-v2-neutral-300">
                      Target Project *
                    </label>
                    {clientName && (
                      <span className="text-[11px] text-v2-neutral-400">
                        Submitting as{" "}
                        <span className="text-v2-neutral-200 font-medium">
                          {clientName}
                        </span>
                      </span>
                    )}
                  </div>
                  <Select
                    value={selectedProjectId}
                    onValueChange={setSelectedProjectId}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                      <SelectValue placeholder="Select project..." />
                    </SelectTrigger>
                    <SelectContent className="z-[100] max-h-56 rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                      {projects.map((p) => (
                        <SelectItem
                          key={p.id}
                          value={p.id}
                          className="cursor-pointer text-xs"
                        >
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                      Client Account *
                    </label>
                    <Select
                      value={selectedClientId}
                      onValueChange={setSelectedClientId}
                    >
                      <SelectTrigger className="h-10 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                        <SelectValue placeholder="Select client..." />
                      </SelectTrigger>
                      <SelectContent className="z-[100] max-h-56 rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                        {clients.map((c) => (
                          <SelectItem
                            key={c.id}
                            value={c.id}
                            className="cursor-pointer text-xs"
                          >
                            {c.name} {c.company ? `(${c.company})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                      Target Project *
                    </label>
                    <Select
                      value={selectedProjectId}
                      onValueChange={setSelectedProjectId}
                    >
                      <SelectTrigger className="h-10 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                        <SelectValue placeholder="Select project..." />
                      </SelectTrigger>
                      <SelectContent className="z-[100] max-h-56 rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                        {projects.map((p) => (
                          <SelectItem
                            key={p.id}
                            value={p.id}
                            className="cursor-pointer text-xs"
                          >
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                  Ticket Subject / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navigation bar styling inconsistency"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none placeholder:text-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
                />
              </div>

              {/* Category & Target Type */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                    Category Type *
                  </label>
                  <Select
                    value={category}
                    onValueChange={(val) => setCategory(val as ClientFeedbackType)}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent className="z-[100] rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                      {TICKET_TYPE_OPTIONS.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="cursor-pointer text-xs"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                    Target Scope
                  </label>
                  <Select
                    value={targetType}
                    onValueChange={(val) =>
                      setTargetType(val as ClientFeedbackTargetType)
                    }
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                      <SelectValue placeholder="Select scope..." />
                    </SelectTrigger>
                    <SelectContent className="z-[100] rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                      <SelectItem value="project" className="cursor-pointer text-xs">
                        Overall Project
                      </SelectItem>
                      <SelectItem value="milestone" className="cursor-pointer text-xs">
                        Milestone Deliverable
                      </SelectItem>
                      <SelectItem value="task" className="cursor-pointer text-xs">
                        Specific Task
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Rating / Satisfaction Score */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-v2-neutral-300">
                    Rating / Satisfaction
                    <span className="ml-1.5 text-[11px] font-normal text-v2-neutral-400">
                      (Optional)
                    </span>
                  </label>
                  {rating > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setRating(0);
                        setHoverRating(0);
                      }}
                      className="text-[11px] text-v2-neutral-400 hover:text-v2-neutral-200 transition-colors cursor-pointer"
                    >
                      Clear rating
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3.5 py-2.5">
                  <div
                    className="flex items-center gap-1"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const activeRating = hoverRating || rating;
                      const isFilled = starValue <= activeRating;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() =>
                            setRating((prev) => (prev === starValue ? 0 : starValue))
                          }
                          onMouseEnter={() => setHoverRating(starValue)}
                          className="group p-1 transition-transform hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
                          aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                        >
                          <Star
                            className={`size-5 transition-colors ${
                              isFilled
                                ? "fill-amber-400 text-amber-400 drop-shadow-[0_1px_3px_rgba(251,191,36,0.35)]"
                                : "text-v2-neutral-300 group-hover:text-amber-400/60"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-medium text-v2-neutral-600">
                      {(hoverRating || rating) > 0
                        ? RATING_LABELS[hoverRating || rating]
                        : "Click a star to rate (optional)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Description */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the issue, feedback, or resolution request from the client..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 p-3 text-xs text-v2-neutral-600 outline-none placeholder:text-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-v2-neutral-500 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? isClient
                      ? "Submitting..."
                      : "Registering..."
                    : isClient
                    ? "Submit Ticket"
                    : "Register Ticket"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
