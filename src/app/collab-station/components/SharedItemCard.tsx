"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  MessageSquare,
  Calendar,
  Flag,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message, SharedEntityType, SharedItemSnapshot } from "../types";
import { getPriorityConfig, getStatusConfig } from "@/app/projects/[projectName]/task/task-utils";
import { TICKET_STATUS_CONFIG, ClientFeedbackStatus } from "@/app/feedback/types/ticket";

export interface SharedItemCardProps {
  message: Message;
  isMe: boolean;
  onOpenThread?: (message: Message) => void;
  onReply?: (message: Message) => void;
  isHighlighted?: boolean;
}

function formatDueDateDisplay(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return dateStr;
  }
}

export default function SharedItemCard({
  message,
  isMe,
  onOpenThread,
  onReply,
  isHighlighted,
}: SharedItemCardProps) {
  const router = useRouter();

  const entityType: SharedEntityType = message.sharedEntityType || "task";
  const entityId = message.sharedEntityId || "";
  const snapshot: SharedItemSnapshot = message.sharedEntitySnapshot || {
    title: "Untitled Shared Item",
    projectId: "",
  };

  const entityLabel =
    entityType === "client_feedback"
      ? "FEEDBACK"
      : entityType === "milestone"
      ? "MILESTONE"
      : "TASK";

  const actionButtonText =
    entityType === "client_feedback"
      ? "Open feedback"
      : entityType === "milestone"
      ? "Open milestone"
      : "Open task";

  const handleOpenItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!entityId) return;

    if (entityType === "client_feedback") {
      router.push(`/feedback?ticketId=${encodeURIComponent(entityId)}`);
    } else if (entityType === "milestone") {
      const projectSlug = snapshot.projectId || "all";
      router.push(`/projects/${encodeURIComponent(projectSlug)}/overview?milestoneId=${encodeURIComponent(entityId)}`);
    } else {
      const projectSlug = snapshot.projectId || "all";
      router.push(`/projects/${encodeURIComponent(projectSlug)}/task?taskId=${encodeURIComponent(entityId)}`);
    }
  };

  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReply) {
      onReply(message);
    } else if (onOpenThread) {
      onOpenThread(message);
    }
  };

  const formattedDueDate = formatDueDateDisplay(snapshot.dueDate);

  // Status configuration based on entity type
  const renderStatus = () => {
    if (!snapshot.status) return null;

    if (entityType === "client_feedback") {
      const fbStatus = snapshot.status.toLowerCase() as ClientFeedbackStatus;
      const cfg = TICKET_STATUS_CONFIG[fbStatus];
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
            cfg?.badgeClass || "bg-v2-neutral-500 text-v2-neutral-200 border-v2-neutral-400"
          }`}
        >
          {cfg?.dotClass && <span className={`size-1.5 rounded-full ${cfg.dotClass}`} />}
          <span>Status: {cfg?.label || snapshot.status}</span>
        </span>
      );
    }

    const taskCfg = getStatusConfig(snapshot.status);
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold border ${taskCfg.badgeClass}`}
      >
        <span className="size-1.5 rounded-full" style={{ backgroundColor: taskCfg.dotColor }} />
        <span>Status: {taskCfg.label}</span>
      </span>
    );
  };

  // Priority configuration
  const renderPriority = () => {
    if (!snapshot.priority) return null;
    const prioCfg = getPriorityConfig(snapshot.priority);
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border ${prioCfg.badgeClass}`}
      >
        <Flag className="size-3" style={{ color: prioCfg.flagColor }} />
        <span>Priority: {prioCfg.label}</span>
      </span>
    );
  };

  const repliesCount = message.repliesCount ?? 0;

  return (
    <div
      className={`relative w-full max-w-md rounded-2xl border transition-all duration-300 overflow-hidden ${
        isHighlighted
          ? "border-v2-neutral-100 ring-2 ring-v2-neutral-100/40 shadow-xl"
          : isMe
          ? "border-v2-neutral-400 bg-v2-neutral-600/90 text-v2-neutral-100 shadow-md"
          : "border-v2-neutral-400/80 bg-v2-neutral-600 text-v2-neutral-100 shadow-md"
      }`}
    >
      {/* Top Banner: Entity type & optional project name */}
      <div className="flex items-center justify-between border-b border-v2-neutral-500 bg-v2-neutral-500/30 px-4 py-2 text-[11px] font-mono tracking-wider text-v2-neutral-300">
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold text-v2-neutral-200 uppercase">{entityLabel}</span>
          {snapshot.projectName && (
            <>
              <span className="text-v2-neutral-500">·</span>
              <span className="truncate text-v2-neutral-400">{snapshot.projectName}</span>
            </>
          )}
        </div>
      </div>

      {/* Main Card Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h4 className="text-sm font-semibold tracking-tight text-v2-neutral-100 leading-snug break-words">
          {snapshot.title || "Untitled shared item"}
        </h4>

        {/* Badges: Status and Priority */}
        {(snapshot.status || snapshot.priority) && (
          <div className="flex flex-wrap items-center gap-2">
            {renderStatus()}
            {renderPriority()}
            {snapshot.targetType && (
              <span className="inline-flex items-center gap-1 rounded-md border border-v2-neutral-500 bg-v2-neutral-500/40 px-2 py-0.5 text-[10px] font-medium text-v2-neutral-300 uppercase">
                Scope: {snapshot.targetType}
              </span>
            )}
          </div>
        )}

        {/* Due Date (if present) */}
        {formattedDueDate && (
          <div className="flex items-center gap-1.5 text-xs text-v2-neutral-300">
            <Calendar className="size-3.5 text-v2-neutral-400 shrink-0" />
            <span className="font-medium text-v2-neutral-400">Due:</span>
            <span className="font-semibold text-v2-neutral-200">{formattedDueDate}</span>
          </div>
        )}

        {/* Stale snapshot hint */}
        <div className="flex items-center gap-1 pt-1 text-[10px] text-v2-neutral-400 italic">
          <Info className="size-3 shrink-0" />
          <span>Open for latest status</span>
        </div>

        {/* Card Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-v2-neutral-500/60">
          <div className="flex items-center gap-2">
            {/* Open Item Button */}
            <Button
              type="button"
              size="sm"
              onClick={handleOpenItem}
              className="h-7 rounded-lg bg-v2-neutral-100 px-3 text-xs font-semibold text-v2-neutral-600 shadow-xs hover:bg-v2-neutral-200 active:scale-[0.98] cursor-pointer gap-1.5"
            >
              <span>{actionButtonText}</span>
              <ExternalLink className="size-3 shrink-0" />
            </Button>

            {/* Reply in thread Button */}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleReplyClick}
              className="h-7 rounded-lg border-v2-neutral-400 bg-v2-neutral-500/40 px-2.5 text-xs text-v2-neutral-200 hover:bg-v2-neutral-500 hover:text-v2-neutral-100 cursor-pointer gap-1"
            >
              <MessageSquare className="size-3 shrink-0" />
              <span>Reply</span>
            </Button>
          </div>

          {/* Thread reply count preview */}
          {repliesCount > 0 && onOpenThread && (
            <button
              type="button"
              onClick={() => onOpenThread(message)}
              className="flex items-center gap-1.5 text-xs font-medium text-v2-neutral-300 hover:text-v2-neutral-100 transition-colors cursor-pointer"
            >
              <span className="rounded-full bg-v2-neutral-500 px-2 py-0.5 text-[10px] font-semibold text-v2-neutral-200">
                {repliesCount} {repliesCount === 1 ? "reply" : "replies"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
