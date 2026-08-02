export type MeetingStatus = "scheduled" | "live" | "ended" | "cancelled";

export interface MeetingHost {
  user_id: number;
  name: string;
  email?: string;
}

export interface MeetingParticipant {
  user_id: number;
  name: string;
  role: "host" | "attendee";
  joinedAt?: string | null;
  leftAt?: string | null;
}

export interface MeetingResponseDto {
  meetingId: string;
  groupId: string;
  groupName?: string;
  title: string;
  roomName: string;
  status: MeetingStatus;
  host: MeetingHost;
  startsAt?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  createdAt: string;
  participants: MeetingParticipant[];
}

export interface MeetingTokenResponse {
  token: string;
  url: string;
}

export interface CreateMeetingPayload {
  groupId: string;
  title: string;
  startsAt?: string;
  participantIds?: number[];
}

export interface MeetingPageResponse {
  items: MeetingResponseDto[];
  nextCursor?: string | null;
}

export interface MeetingSocketAck {
  success: boolean;
  meeting?: MeetingResponseDto;
  error?: {
    code: string;
    message: string;
  };
}

export function normalizeMeetingDto(m: any): MeetingResponseDto {
  if (!m) {
    return {
      meetingId: "",
      groupId: "",
      title: "Untitled Meeting",
      roomName: "",
      status: "ended",
      host: { user_id: 0, name: "Host" },
      createdAt: new Date().toISOString(),
      participants: [],
    };
  }

  const meetingId = String(m.meetingId || m.id || m.meeting_id || "");
  const groupId = String(m.groupId || m.group_id || "");
  const groupName = m.groupName || m.group_name || m.group?.name || undefined;
  const title = m.title || "Untitled Meeting";
  const roomName = m.roomName || m.room_name || meetingId;
  const createdAt = m.createdAt || m.created_at || new Date().toISOString();

  let status: MeetingStatus = "ended";
  if (m.endedAt || m.ended_at) {
    status = "ended";
  } else {
    const rawStatus = String(m.status ?? "").toLowerCase().trim();
    if (rawStatus === "live" || rawStatus === "started" || rawStatus === "in_progress" || rawStatus === "1") {
      status = "live";
    } else if (rawStatus === "scheduled" || rawStatus === "0") {
      status = "scheduled";
    } else if (rawStatus === "cancelled" || rawStatus === "canceled" || rawStatus === "3") {
      status = "cancelled";
    } else {
      status = "ended";
    }
  }

  const host = {
    user_id: Number(m.host?.user_id || m.host?.id || m.hostId || m.host_id || 0),
    name: String(m.host?.name || m.host_name || m.host?.email || "Host"),
    email: m.host?.email,
  };

  const participants = Array.isArray(m.participants)
    ? m.participants.map((p: any) => ({
        user_id: Number(p.user_id || p.id || p.userId || 0),
        name: String(p.name || p.user?.name || "Participant"),
        role: (p.role || (p.user_id === host.user_id ? "host" : "attendee")) as "host" | "attendee",
        joinedAt: p.joinedAt || p.joined_at || null,
        leftAt: p.leftAt || p.left_at || null,
      }))
    : [];

  return {
    meetingId,
    groupId,
    groupName,
    title,
    roomName,
    status,
    host,
    startsAt: m.startsAt || m.starts_at || null,
    startedAt: m.startedAt || m.started_at || null,
    endedAt: m.endedAt || m.ended_at || null,
    createdAt,
    participants,
  };
}
