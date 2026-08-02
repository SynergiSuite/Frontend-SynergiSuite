"use client";

import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";

// ─── Call Types ───────────────────────────────────────────────────────────────

export type CallStatus =
  | "ringing"
  | "active"
  | "rejected"
  | "cancelled"
  | "missed"
  | "ended"
  | "failed";

export interface CallParticipant {
  user_id?: number | string;
  id?: number | string;
  userId?: number | string;
  name: string;
  email?: string;
}

export interface CallDto {
  callId: string;
  groupId: string;
  status: CallStatus;
  caller: CallParticipant;
  recipient: CallParticipant;
  createdAt: string;
  answeredAt?: string;
  endedAt?: string;
}

export interface CallTokenResponse {
  token: string;
  url: string;
  roomName: string;
}

export interface CallAcknowledgement {
  success: boolean;
  call?: CallDto;
  delivery?: {
    recipientOnline: boolean;
    recipientSocketCount: number;
  };
  error?: { code: string; message: string };
}

// ─── Meeting Types (re-export compatible) ─────────────────────────────────────

export interface MeetingEvent {
  meeting: any;
  userId?: number;
}

// ─── Realtime Context Shape ──────────────────────────────────────────────────

export interface RealtimeContextValue {
  /** The single global socket instance */
  socket: Socket | null;
  /** Whether the socket is currently connected */
  connected: boolean;

  // ── Call State ──
  currentCall: CallDto | null;
  callSide: "caller" | "recipient" | undefined;
  callCredentials: CallTokenResponse | null;
  callError: string;
  isRecipientOffline: boolean;

  // ── Call Actions ──
  inviteCall: (groupId: string) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => Promise<void>;
  cancelCall: () => Promise<void>;
  endCall: () => Promise<void>;
  clearCall: () => void;

  // ── Meeting State ──
  /** Map of groupId → live meeting for banner display */
  groupMeetingsMap: Record<string, any>;

  // ── Meeting Actions ──
  onMeetingCreated: (meeting: any) => void;
  onMeetingStarted: (meeting: any) => void;
  onMeetingEnded: (meeting: any) => void;

  // ── User Identity ──
  currentUserId: number | string | undefined;
  isCurrentUser: (target?: any) => boolean;
}

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function useRealtime(): RealtimeContextValue {
  const ctx = useContext(RealtimeContext);
  if (!ctx) {
    throw new Error("useRealtime() must be used within a <RealtimeProvider>");
  }
  return ctx;
}

export default RealtimeContext;
