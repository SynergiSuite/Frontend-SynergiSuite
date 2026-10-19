export type ClientFeedbackStatus =
  | "open"
  | "in_progress"
  | "in_review"
  | "resolved"
  | "rejected";

export type ClientFeedbackType =
  | "request"
  | "review"
  | "issue"
  | "question"
  | "approval"
  | "general";

export type ClientFeedbackTargetType = "project" | "milestone" | "task";

export interface TicketClientInfo {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
}

export interface TicketCreatorInfo {
  user_id?: number | string;
  name?: string;
  email?: string;
}

export interface TicketReplyItem {
  id: string;
  feedbackId?: string;
  message: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  replier?: {
    userId?: number | string;
    name?: string;
    email?: string;
  } | null;
  createdBy?: {
    name?: string;
    email?: string;
  } | null;
}

export interface TicketItem {
  id: string;
  rawId: string | number;
  titleOfFeedback: string;
  feedback: string;
  feedbackType: ClientFeedbackType;
  targetType: ClientFeedbackTargetType;
  typeId: string;
  status: ClientFeedbackStatus;
  starRating?: number | null;
  createdAt: string;
  updatedAt?: string;
  client?: TicketClientInfo | null;
  createdBy?: TicketCreatorInfo | null;
  projectName?: string;
  replies?: TicketReplyItem[];
}

export interface FeedbackPaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface GetTicketsApiResponse {
  data: unknown[];
  meta?: FeedbackPaginationMeta;
}

export const TICKET_STATUS_CONFIG: Record<
  ClientFeedbackStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    borderClass: string;
    description: string;
  }
> = {
  open: {
    label: "Open",
    badgeClass: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
    dotClass: "bg-blue-500",
    borderClass: "border-blue-500/40",
    description: "New ticket awaiting initial team review",
  },
  in_progress: {
    label: "In Progress",
    badgeClass: "bg-violet-500/10 text-violet-400 border border-violet-500/30",
    dotClass: "bg-violet-500",
    borderClass: "border-violet-500/40",
    description: "Actively being worked on by project squad",
  },
  in_review: {
    label: "In Review",
    badgeClass: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
    dotClass: "bg-amber-500",
    borderClass: "border-amber-500/40",
    description: "Under manager or QA assessment",
  },
  resolved: {
    label: "Resolved",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    dotClass: "bg-emerald-500",
    borderClass: "border-emerald-500/40",
    description: "Deliverable or resolution verified with client",
  },
  rejected: {
    label: "Rejected",
    badgeClass: "bg-rose-500/10 text-rose-400 border border-rose-500/30",
    dotClass: "bg-rose-500",
    borderClass: "border-rose-500/40",
    description: "Out of contract scope or declined request",
  },
};

export const TICKET_TYPE_OPTIONS: Array<{
  value: ClientFeedbackType;
  label: string;
  badgeClass: string;
}> = [
  {
    value: "issue",
    label: "Bug / Issue",
    badgeClass: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  },
  {
    value: "request",
    label: "Feature Request",
    badgeClass: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  },
  {
    value: "review",
    label: "Milestone Review",
    badgeClass: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  },
  {
    value: "approval",
    label: "Approval Needed",
    badgeClass: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  {
    value: "question",
    label: "Inquiry / Question",
    badgeClass: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  },
  {
    value: "general",
    label: "General Support",
    badgeClass: "bg-v2-neutral-400/20 text-v2-neutral-300 border-v2-neutral-400/30",
  },
];
