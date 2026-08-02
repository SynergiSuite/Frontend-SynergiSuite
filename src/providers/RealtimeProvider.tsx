"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import RealtimeContext, {
  CallAcknowledgement,
  CallDto,
  CallTokenResponse,
  RealtimeContextValue,
} from "@/context/RealtimeContext";
import { socket } from "@/lib/socket";
import { CookieManager } from "@/lib/cookieManager";
import { playNotificationSound } from "@/lib/soundUtils";
import { getCallToken, getCurrentCall } from "@/app/collab-station/apis/callApi";
import { normalizeMeetingDto } from "@/app/meetings/types/meetingTypes";
import CallOverlay from "@/app/collab-station/CallOverlay";
import { toast } from "sonner";

// ─── Debug Logger ────────────────────────────────────────────────────────────

const LOG_PREFIX = "[Realtime]";
const log = {
  socket: (...args: any[]) => console.log(`${LOG_PREFIX} [Socket]`, ...args),
  call: (...args: any[]) => console.log(`${LOG_PREFIX} [Call]`, ...args),
  meeting: (...args: any[]) => console.log(`${LOG_PREFIX} [Meeting]`, ...args),
  error: (...args: any[]) => console.error(`${LOG_PREFIX} [ERROR]`, ...args),
};

// ─── Token Helpers ───────────────────────────────────────────────────────────

type UserId = number | string;
type TokenUser = {
  user_id?: UserId;
  sub?: UserId;
  id?: UserId;
  userId?: UserId;
  email?: string;
};

function readTokenUser(token: string): TokenUser {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
}

function getAccessToken(): string | undefined {
  return CookieManager("get", "access-token") as string | undefined;
}

function resolveUserId(user: TokenUser): UserId | undefined {
  const cookieUserId =
    CookieManager("get", "user-id") ||
    CookieManager("get", "user_id");
  if (cookieUserId && !isNaN(Number(cookieUserId))) {
    return Number(cookieUserId);
  }
  if (cookieUserId) return cookieUserId as string;

  const rawUserCookie = CookieManager("get", "user");
  if (rawUserCookie && typeof rawUserCookie === "string" && rawUserCookie.startsWith("{")) {
    try {
      const parsed = JSON.parse(rawUserCookie);
      const parsedId = parsed.id || parsed.user_id || parsed.userId;
      if (parsedId) return !isNaN(Number(parsedId)) ? Number(parsedId) : parsedId;
    } catch {}
  }

  const jwtId = user.user_id ?? user.id ?? user.userId ?? user.sub;
  if (jwtId && !isNaN(Number(jwtId))) return Number(jwtId);
  return jwtId;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export default function RealtimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // ── State ──
  const [connected, setConnected] = useState(false);
  const [currentCall, setCurrentCall] = useState<CallDto | null>(null);
  const [callSide, setCallSide] = useState<"caller" | "recipient" | undefined>();
  const [callCredentials, setCallCredentials] = useState<CallTokenResponse | null>(null);
  const [callError, setCallError] = useState("");
  const [isRecipientOffline, setIsRecipientOffline] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<UserId | undefined>();
  const [groupMeetingsMap, setGroupMeetingsMap] = useState<Record<string, any>>({});

  // ── Refs ──
  const currentCallRef = useRef<CallDto | null>(null);
  const currentUserRef = useRef<TokenUser>({});
  const currentUserIdRef = useRef<UserId | undefined>(undefined);
  const tokenRequestCallIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);

  // Keep currentCallRef in sync
  useEffect(() => {
    currentCallRef.current = currentCall;
  }, [currentCall]);

  // ── Identity ──
  const setCurrentUserIdentity = useCallback((userId?: UserId) => {
    if (userId === undefined || userId === null) return;
    currentUserIdRef.current = userId;
    setCurrentUserId(userId);
  }, []);

  const identifyCurrentUser = useCallback(() => {
    const token = getAccessToken();
    const user = token ? readTokenUser(token) : {};
    currentUserRef.current = user;
    const resolvedId = resolveUserId(user);
    setCurrentUserIdentity(resolvedId);
    return { token, user };
  }, [setCurrentUserIdentity]);

  const isCurrentUser = useCallback((target?: any): boolean => {
    if (target === undefined || target === null) return false;
    const myId = currentUserIdRef.current;
    const myEmail = currentUserRef.current?.email;

    if (typeof target === "object") {
      const targetId = target.user_id ?? target.id ?? target.userId;
      const targetEmail = target.email;
      if (myId != null && targetId != null && String(targetId) === String(myId)) return true;
      if (myEmail && targetEmail && myEmail.toLowerCase() === String(targetEmail).toLowerCase())
        return true;
      return false;
    }

    if (myEmail && typeof target === "string" && target.includes("@") && target.toLowerCase() === myEmail.toLowerCase()) {
      return true;
    }

    return myId != null && String(target) === String(myId);
  }, []);

  const getCallSide = useCallback(
    (call: CallDto): "caller" | "recipient" | undefined => {
      if (!call) return undefined;
      if (isCurrentUser(call.caller)) return "caller";
      if (isCurrentUser(call.recipient)) return "recipient";
      return undefined;
    },
    [isCurrentUser]
  );

  // ── Call State Helpers ──
  const clearCall = useCallback(() => {
    setCurrentCall(null);
    setCallSide(undefined);
    setCallCredentials(null);
    setCallError("");
    setIsRecipientOffline(false);
    tokenRequestCallIdRef.current = null;
  }, []);

  const setTerminalCall = useCallback(
    (rawPayload: any) => {
      const call: CallDto = rawPayload?.call || rawPayload;
      if (!call) return;

      const activeCall = currentCallRef.current;
      const isActiveCall =
        activeCall &&
        String(call.callId || (call as any).id) === String(activeCall.callId);
      const isParticipant =
        !call || isCurrentUser(call.caller) || isCurrentUser(call.recipient);

      if (!isActiveCall && !isParticipant) return;

      log.call("Terminal event received:", call.status, call.callId);
      setCallSide(getCallSide(call));
      setCurrentCall(call);
      setCallCredentials(null);
      tokenRequestCallIdRef.current = null;

      window.setTimeout(() => {
        if (mountedRef.current) clearCall();
      }, 400);
    },
    [isCurrentUser, getCallSide, clearCall]
  );

  // ── Socket Emit Helper ──
  const emitCallEvent = useCallback(
    async (event: string, payload: Record<string, string>): Promise<CallAcknowledgement> => {
      if (!socket.connected) throw new Error("Call signaling is disconnected");
      log.call(`Emitting ${event}`, payload);

      const expectedBroadcastMap: Record<string, string[]> = {
        "call:invite": ["call:ringing", "call:incoming"],
        "call:accept": ["call:accepted"],
        "call:reject": ["call:rejected"],
        "call:cancel": ["call:cancelled"],
        "call:end": ["call:ended"],
      };

      const expectedEvents = expectedBroadcastMap[event] || [];

      return new Promise<CallAcknowledgement>((resolve, reject) => {
        let settled = false;
        const cleanupFns: Array<() => void> = [];

        const finish = (err: Error | null, res?: CallAcknowledgement) => {
          if (settled) return;
          settled = true;
          cleanupFns.forEach((fn) => fn());
          if (err) reject(err);
          else resolve(res || { success: true });
        };

        // Listen for expected broadcast events
        expectedEvents.forEach((evtName) => {
          const handler = (rawPayload: any) => {
            const call = rawPayload?.call || rawPayload;
            log.call(`Received broadcast ${evtName} during emit ${event}:`, call);
            finish(null, { success: true, call });
          };
          socket.on(evtName, handler);
          cleanupFns.push(() => socket.off(evtName, handler));
        });

        // Listen for call:error broadcast
        const errorHandler = (errPayload: any) => {
          const msg = errPayload?.error?.message || errPayload?.message || "Call operation failed";
          log.error(`Received call:error during emit ${event}:`, msg);
          finish(new Error(msg));
        };
        socket.on("call:error", errorHandler);
        cleanupFns.push(() => socket.off("call:error", errorHandler));

        // Emit with ack (if server supports ack callback)
        socket
          .timeout(5_000)
          .emitWithAck(event, payload)
          .then((ack: any) => {
            log.call(`Ack for ${event}:`, ack);
            if (ack && typeof ack === "object") {
              if (ack.success === false) {
                finish(new Error(ack.error?.message || "Call operation failed"));
              } else {
                finish(null, ack);
              }
            } else {
              finish(null, { success: true });
            }
          })
          .catch((err) => {
            log.call(`emitWithAck for ${event} did not return ack callback:`, err?.message);
            // If timeout occurred, check if broadcast or state change occurred
            window.setTimeout(() => {
              if (!settled) {
                const activeCall = currentCallRef.current;
                if (activeCall && (activeCall.status === "active" || event.includes("accept"))) {
                  finish(null, { success: true, call: activeCall });
                } else {
                  finish(new Error(err?.message || "Call operation timed out"));
                }
              }
            }, 1000);
          });
      });
    },
    []
  );

  // ── Call Actions ──
  const inviteCall = useCallback(
    async (groupId: string) => {
      try {
        setCallError("");
        setIsRecipientOffline(false);
        setCallSide("caller");
        log.call("Inviting call for group:", groupId);

        const ack = await emitCallEvent("call:invite", { groupId });
        if (ack.call) {
          setCurrentCall(ack.call);
        }
        if (ack.delivery && !ack.delivery.recipientOnline) {
          setIsRecipientOffline(true);
          toast.error("User is not online. They won't receive the call.");
        }
      } catch (err: any) {
        const msg = err?.message || "Unable to start voice call";
        log.error("inviteCall failed:", err);
        setCallError(msg);
        toast.error(msg);
        setCallSide(undefined);
      }
    },
    [emitCallEvent]
  );

  const acceptCall = useCallback(async () => {
    const call = currentCallRef.current;
    if (!call) return;
    try {
      if (!socket.connected) {
        const { token } = identifyCurrentUser();
        if (token) {
          socket.auth = { token };
          socket.connect();
          await new Promise((r) => setTimeout(r, 400));
        }
      }
      const ack = await emitCallEvent("call:accept", { callId: call.callId });
      if (ack.call) {
        setCallSide("recipient");
        setCurrentCall(ack.call);
      }
    } catch (err: any) {
      log.error("acceptCall error:", err);
      setCallError(err?.message || "Unable to accept call");
    }
  }, [emitCallEvent, identifyCurrentUser]);

  const rejectCall = useCallback(async () => {
    const call = currentCallRef.current;
    if (!call) return;
    if (["missed", "cancelled", "ended", "rejected"].includes(call.status)) {
      clearCall();
      return;
    }
    try {
      const ack = await emitCallEvent("call:reject", { callId: call.callId });
      if (ack.call) setCurrentCall(ack.call);
      window.setTimeout(() => clearCall(), 400);
    } catch (err: any) {
      if (/missed|ended|cancelled|rejected|Cannot/.test(String(err?.message))) {
        clearCall();
      } else {
        setCallError(err?.message || "Unable to reject call");
      }
    }
  }, [emitCallEvent, clearCall]);

  const cancelCall = useCallback(async () => {
    const call = currentCallRef.current;
    if (!call) return;
    if (["missed", "cancelled", "ended", "rejected"].includes(call.status)) {
      clearCall();
      return;
    }
    try {
      const ack = await emitCallEvent("call:cancel", { callId: call.callId });
      if (ack.call) setCurrentCall(ack.call);
      window.setTimeout(() => clearCall(), 400);
    } catch (err: any) {
      if (/missed|ended|cancelled|rejected|Cannot/.test(String(err?.message))) {
        clearCall();
      } else {
        setCallError(err?.message || "Unable to cancel call");
      }
    }
  }, [emitCallEvent, clearCall]);

  const endCall = useCallback(async () => {
    const call = currentCallRef.current;
    if (!call) return;
    if (["missed", "cancelled", "ended", "rejected"].includes(call.status)) {
      clearCall();
      return;
    }
    try {
      const ack = await emitCallEvent("call:end", { callId: call.callId });
      if (ack.call) setCurrentCall(ack.call);
      window.setTimeout(() => clearCall(), 400);
    } catch (err: any) {
      if (/missed|ended|cancelled|rejected|Cannot/.test(String(err?.message))) {
        clearCall();
      } else {
        setCallError(err?.message || "Unable to end call");
      }
    }
  }, [emitCallEvent, clearCall]);

  // ── Auto-fetch LiveKit token when call becomes active ──
  useEffect(() => {
    if (!currentCall || currentCall.status !== "active" || callCredentials) return;
    if (tokenRequestCallIdRef.current === currentCall.callId) return;

    let cancelled = false;
    tokenRequestCallIdRef.current = currentCall.callId;
    log.call("Fetching LiveKit token for call:", currentCall.callId);

    getCallToken(currentCall.callId)
      .then((credentials) => {
        if (!cancelled && mountedRef.current) {
          log.call("LiveKit token received:", credentials.url);
          setCallCredentials(credentials);
        }
      })
      .catch((error) => {
        tokenRequestCallIdRef.current = null;
        if (!cancelled && mountedRef.current) {
          log.error("Failed to get call token:", error);
          setCallError(error instanceof Error ? error.message : "Unable to join the voice call");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentCall, callCredentials]);

  // ── Meeting event handlers ──
  const onMeetingCreated = useCallback((meeting: any) => {
    const norm = normalizeMeetingDto(meeting);
    log.meeting("Created:", norm.meetingId);
  }, []);

  const onMeetingStarted = useCallback((meeting: any) => {
    const norm = normalizeMeetingDto(meeting);
    norm.status = "live";
    log.meeting("Started (live):", norm.meetingId, "groupId:", norm.groupId);
    if (norm.groupId) {
      setGroupMeetingsMap((prev) => ({ ...prev, [norm.groupId!]: norm }));
    }
  }, []);

  const onMeetingEnded = useCallback((rawPayload: any) => {
    const raw = rawPayload?.meeting || rawPayload;
    const norm = normalizeMeetingDto(raw);
    norm.status = "ended";
    log.meeting("Ended:", norm.meetingId, "groupId:", norm.groupId);
    if (norm.groupId) {
      setGroupMeetingsMap((prev) => {
        const next = { ...prev };
        delete next[norm.groupId!];
        return next;
      });
    }
  }, []);

  // ── Socket Connection & Global Listeners ──
  useEffect(() => {
    mountedRef.current = true;
    const { token, user } = identifyCurrentUser();

    if (!token) {
      log.socket("No auth token found, not connecting");
      return;
    }

    // ── Connection Handlers ──
    const onConnect = () => {
      log.socket("Connected, socket id:", socket.id);
      setConnected(true);
      // Join user-specific room for call delivery
      const { user: currentUser } = identifyCurrentUser();
      const myId = resolveUserId(currentUser);
      if (myId != null) {
        const numId = Number(myId);
        const joinPayload = { userId: !isNaN(numId) ? numId : myId };
        socket.emit("user:join", joinPayload);
        log.socket("Joined user room:", joinPayload);
      } else {
        log.error("Could not resolve userId for user:join!");
      }
    };

    const onDisconnect = (reason: string) => {
      log.socket("Disconnected, reason:", reason);
      setConnected(false);
    };

    const onConnectError = (err: Error) => {
      log.error("Socket connection error:", err.message);
      setConnected(false);
    };

    // ── Call Event Handlers ──
    const onIncoming = (rawPayload: any) => {
      const call: CallDto = rawPayload?.call || rawPayload;
      if (!call) return;
      log.call("Incoming call:", call.callId, "from:", call.caller?.name);
      if (!isCurrentUser(call.recipient)) {
        log.call("Ignoring incoming — not the recipient");
        return;
      }
      playNotificationSound();
      setCallSide("recipient");
      setCallError("");
      setIsRecipientOffline(false);
      setCurrentCall(call);
    };

    const onRinging = (rawPayload: any) => {
      const call: CallDto = rawPayload?.call || rawPayload;
      if (!call) return;
      log.call("Ringing:", call.callId);
      if (!isCurrentUser(call.caller)) return;
      setCallSide("caller");
      setCurrentCall(call);
    };

    const onAccepted = (rawPayload: any) => {
      const call: CallDto = rawPayload?.call || rawPayload;
      if (!call) return;
      log.call("Accepted:", call.callId);
      setCallSide(getCallSide(call));
      setCallError("");
      setIsRecipientOffline(false);
      setCurrentCall(call);
    };

    const onCallError = (payload: { message?: string; error?: { message?: string } }) => {
      log.error("Call error event:", payload);
      setCallError(payload.error?.message || payload.message || "Call operation failed");
    };

    // ── Meeting Event Handlers ──
    const onMeetingCreatedEvent = (raw: any) => {
      log.meeting("Event: meeting:created");
      onMeetingCreated(raw);
    };

    const onMeetingStartedEvent = (raw: any) => {
      log.meeting("Event: meeting:started");
      onMeetingStarted(raw);
    };

    const onMeetingJoinedEvent = (raw: any) => {
      log.meeting("Event: meeting:joined", raw?.userId);
    };

    const onMeetingLeftEvent = (raw: any) => {
      log.meeting("Event: meeting:left", raw?.userId);
    };

    const onMeetingEndedEvent = (raw: any) => {
      log.meeting("Event: meeting:ended");
      onMeetingEnded(raw);
    };

    const onMeetingCancelledEvent = (raw: any) => {
      log.meeting("Event: meeting:cancelled");
      onMeetingEnded(raw); // same cleanup
    };

    // ── Register Listeners ──
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    socket.on("call:incoming", onIncoming);
    socket.on("call:ringing", onRinging);
    socket.on("call:accepted", onAccepted);
    socket.on("call:rejected", setTerminalCall);
    socket.on("call:cancelled", setTerminalCall);
    socket.on("call:missed", setTerminalCall);
    socket.on("call:ended", setTerminalCall);
    socket.on("call:error", onCallError);

    socket.on("meeting:created", onMeetingCreatedEvent);
    socket.on("meeting:started", onMeetingStartedEvent);
    socket.on("meeting:joined", onMeetingJoinedEvent);
    socket.on("meeting:left", onMeetingLeftEvent);
    socket.on("meeting:ended", onMeetingEndedEvent);
    socket.on("meeting:cancelled", onMeetingCancelledEvent);

    // ── Connect ──
    socket.auth = { token };
    log.socket("Connecting with auth token present:", Boolean(token));
    if (!socket.connected) {
      socket.connect();
    } else {
      onConnect();
    }

    // ── Restore Active Call ──
    getCurrentCall()
      .then(async (call) => {
        if (!call) return;
        if (["missed", "ended", "cancelled", "rejected"].includes(call.status)) return;
        log.call("Restored active call:", call.callId, call.status);
        const restoredSide = getCallSide(call);
        if (!restoredSide) return;
        setCallSide(restoredSide);
        setCurrentCall(call);
      })
      .catch(() => undefined);

    // ── Cleanup ──
    return () => {
      mountedRef.current = false;
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);

      socket.off("call:incoming", onIncoming);
      socket.off("call:ringing", onRinging);
      socket.off("call:accepted", onAccepted);
      socket.off("call:rejected", setTerminalCall);
      socket.off("call:cancelled", setTerminalCall);
      socket.off("call:missed", setTerminalCall);
      socket.off("call:ended", setTerminalCall);
      socket.off("call:error", onCallError);

      socket.off("meeting:created", onMeetingCreatedEvent);
      socket.off("meeting:started", onMeetingStartedEvent);
      socket.off("meeting:joined", onMeetingJoinedEvent);
      socket.off("meeting:left", onMeetingLeftEvent);
      socket.off("meeting:ended", onMeetingEndedEvent);
      socket.off("meeting:cancelled", onMeetingCancelledEvent);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Context Value ──
  const value: RealtimeContextValue = {
    socket,
    connected,
    currentCall,
    callSide,
    callCredentials,
    callError,
    isRecipientOffline,
    inviteCall,
    acceptCall,
    rejectCall,
    cancelCall,
    endCall,
    clearCall,
    groupMeetingsMap,
    onMeetingCreated,
    onMeetingStarted,
    onMeetingEnded,
    currentUserId,
    isCurrentUser,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
      {/* Global Call Overlay — renders on ANY page when a call is active */}
      <CallOverlay
        call={currentCall}
        currentUserId={currentUserId}
        callSide={callSide}
        credentials={callCredentials}
        error={callError}
        onAccept={() => void acceptCall()}
        onReject={() => void rejectCall()}
        onCancel={() => void cancelCall()}
        onEnd={() => void endCall()}
      />
    </RealtimeContext.Provider>
  );
}
