import { socket } from "@/lib/socket";
import { CookieManager } from "@/lib/cookieManager";
import {
  CreateMeetingPayload,
  MeetingResponseDto,
  MeetingSocketAck,
  normalizeMeetingDto,
} from "./types/meetingTypes";

export async function connectMeetingSocket() {
  const token = await CookieManager("get", "access-token");

  socket.auth = { token };
  if (!socket.connected) {
    socket.connect();
  }
}

export function emitCreateMeeting(
  payload: CreateMeetingPayload
): Promise<MeetingResponseDto> {
  return new Promise((resolve, reject) => {
    socket.emit("meeting:create", payload, (ack: MeetingSocketAck) => {
      if (ack?.success && ack.meeting) {
        resolve(normalizeMeetingDto(ack.meeting));
      } else {
        reject(new Error(ack?.error?.message || "Failed to create meeting via socket"));
      }
    });
  });
}

export function emitStartMeeting(meetingId: string): Promise<MeetingResponseDto> {
  return new Promise((resolve, reject) => {
    socket.emit("meeting:start", { meetingId }, (ack: MeetingSocketAck) => {
      if (ack?.success && ack.meeting) {
        const norm = normalizeMeetingDto(ack.meeting);
        norm.status = "live";
        resolve(norm);
      } else {
        reject(new Error(ack?.error?.message || "Failed to start meeting via socket"));
      }
    });
  });
}

export function emitJoinMeeting(meetingId: string): Promise<MeetingResponseDto> {
  return new Promise((resolve, reject) => {
    socket.emit("meeting:join", { meetingId }, (ack: MeetingSocketAck) => {
      if (ack?.success && ack.meeting) {
        resolve(normalizeMeetingDto(ack.meeting));
      } else {
        reject(new Error(ack?.error?.message || "Failed to join meeting via socket"));
      }
    });
  });
}

export function emitLeaveMeeting(meetingId: string): Promise<MeetingResponseDto> {
  return new Promise((resolve, reject) => {
    socket.emit("meeting:leave", { meetingId }, (ack: MeetingSocketAck) => {
      if (ack?.success && ack.meeting) {
        resolve(normalizeMeetingDto(ack.meeting));
      } else {
        reject(new Error(ack?.error?.message || "Failed to leave meeting via socket"));
      }
    });
  });
}

export function emitEndMeeting(meetingId: string): Promise<MeetingResponseDto> {
  return new Promise((resolve, reject) => {
    socket.emit("meeting:end", { meetingId }, (ack: MeetingSocketAck) => {
      if (ack?.success && ack.meeting) {
        const norm = normalizeMeetingDto(ack.meeting);
        norm.status = "ended";
        resolve(norm);
      } else {
        reject(new Error(ack?.error?.message || "Failed to end meeting via socket"));
      }
    });
  });
}

export function emitCancelMeeting(meetingId: string): Promise<MeetingResponseDto> {
  return new Promise((resolve, reject) => {
    socket.emit("meeting:cancel", { meetingId }, (ack: MeetingSocketAck) => {
      if (ack?.success && ack.meeting) {
        const norm = normalizeMeetingDto(ack.meeting);
        norm.status = "cancelled";
        resolve(norm);
      } else {
        reject(new Error(ack?.error?.message || "Failed to cancel meeting via socket"));
      }
    });
  });
}

export interface MeetingSocketListeners {
  onCreated?: (meeting: MeetingResponseDto) => void;
  onStarted?: (meeting: MeetingResponseDto) => void;
  onJoined?: (data: { meeting: MeetingResponseDto; userId: number }) => void;
  onLeft?: (data: { meeting: MeetingResponseDto; userId: number }) => void;
  onEnded?: (meeting: MeetingResponseDto) => void;
  onCancelled?: (meeting: MeetingResponseDto) => void;
}

export function subscribeMeetingSocketEvents(listeners: MeetingSocketListeners) {
  const handleCreated = (raw: any) => listeners.onCreated?.(normalizeMeetingDto(raw));
  const handleStarted = (raw: any) => {
    const norm = normalizeMeetingDto(raw);
    norm.status = "live";
    listeners.onStarted?.(norm);
  };
  const handleJoined = (raw: any) => {
    const meeting = normalizeMeetingDto(raw?.meeting || raw);
    listeners.onJoined?.({ meeting, userId: Number(raw?.userId || 0) });
  };
  const handleLeft = (raw: any) => {
    const meeting = normalizeMeetingDto(raw?.meeting || raw);
    listeners.onLeft?.({ meeting, userId: Number(raw?.userId || 0) });
  };
  const handleEnded = (raw: any) => {
    const norm = normalizeMeetingDto(raw?.meeting || raw);
    norm.status = "ended";
    listeners.onEnded?.(norm);
  };
  const handleCancelled = (raw: any) => {
    const norm = normalizeMeetingDto(raw?.meeting || raw);
    norm.status = "cancelled";
    listeners.onCancelled?.(norm);
  };

  if (listeners.onCreated) socket.on("meeting:created", handleCreated);
  if (listeners.onStarted) socket.on("meeting:started", handleStarted);
  if (listeners.onJoined) socket.on("meeting:joined", handleJoined);
  if (listeners.onLeft) socket.on("meeting:left", handleLeft);
  if (listeners.onEnded) socket.on("meeting:ended", handleEnded);
  if (listeners.onCancelled) socket.on("meeting:cancelled", handleCancelled);

  return () => {
    if (listeners.onCreated) socket.off("meeting:created", handleCreated);
    if (listeners.onStarted) socket.off("meeting:started", handleStarted);
    if (listeners.onJoined) socket.off("meeting:joined", handleJoined);
    if (listeners.onLeft) socket.off("meeting:left", handleLeft);
    if (listeners.onEnded) socket.off("meeting:ended", handleEnded);
    if (listeners.onCancelled) socket.off("meeting:cancelled", handleCancelled);
  };
}
