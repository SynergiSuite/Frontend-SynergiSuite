import { CookieManager } from "@/lib/cookieManager";
import {
  CreateMeetingPayload,
  MeetingPageResponse,
  MeetingResponseDto,
  MeetingTokenResponse,
  normalizeMeetingDto,
} from "../types/meetingTypes";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";

const getAuthHeaders = async () => {
  const token = await CookieManager("get", "access-token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "ngrok-skip-browser-warning": "1",
  };
};

// 1. GET /collab-station/meetings?limit=20&cursor=<optional>
export async function getMeetingsApi(
  limit: number = 20,
  cursor?: string
): Promise<MeetingPageResponse> {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.append("cursor", cursor);

  const res = await fetch(`${getBaseUrl()}/collab-station/meetings?${params.toString()}`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch meetings");
  }

  const data = await res.json();
  const rawList = Array.isArray(data)
    ? data
    : data.items || data.meetings || data.data || [];

  const items = rawList.map(normalizeMeetingDto);

  return {
    items,
    nextCursor: data.nextCursor || null,
  };
}

// 2. GET /collab-station/meetings/:meetingId
export async function getMeetingByIdApi(meetingId: string): Promise<MeetingResponseDto> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/collab-station/meetings/${meetingId}`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch meeting details");
  }

  const data = await res.json();
  return normalizeMeetingDto(data.meeting || data);
}

// 3. POST /collab-station/meetings
export async function createMeetingApi(payload: CreateMeetingPayload): Promise<MeetingResponseDto> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/collab-station/meetings`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create meeting");
  }

  const data = await res.json();
  return normalizeMeetingDto(data.meeting || data);
}

// 4. POST /collab-station/meetings/:meetingId/start
export async function startMeetingApi(meetingId: string): Promise<MeetingResponseDto> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/collab-station/meetings/${meetingId}/start`, {
    method: "POST",
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to start meeting");
  }

  const data = await res.json();
  const normalized = normalizeMeetingDto(data.meeting || data);
  normalized.status = "live";
  return normalized;
}

// 5. POST /collab-station/meetings/:meetingId/join
export async function joinMeetingApi(meetingId: string): Promise<MeetingResponseDto> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/collab-station/meetings/${meetingId}/join`, {
    method: "POST",
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to join meeting");
  }

  const data = await res.json();
  return normalizeMeetingDto(data.meeting || data);
}

// 6. POST /collab-station/meetings/:meetingId/leave
export async function leaveMeetingApi(meetingId: string): Promise<MeetingResponseDto> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/collab-station/meetings/${meetingId}/leave`, {
    method: "POST",
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to leave meeting");
  }

  const data = await res.json();
  return normalizeMeetingDto(data.meeting || data);
}

// 7. POST /collab-station/meetings/:meetingId/end
export async function endMeetingApi(meetingId: string): Promise<MeetingResponseDto> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/collab-station/meetings/${meetingId}/end`, {
    method: "POST",
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to end meeting");
  }

  const data = await res.json();
  const normalized = normalizeMeetingDto(data.meeting || data);
  normalized.status = "ended";
  return normalized;
}

// 8. POST /collab-station/meetings/:meetingId/cancel
export async function cancelMeetingApi(meetingId: string): Promise<MeetingResponseDto> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/collab-station/meetings/${meetingId}/cancel`, {
    method: "POST",
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to cancel meeting");
  }

  const data = await res.json();
  const normalized = normalizeMeetingDto(data.meeting || data);
  normalized.status = "cancelled";
  return normalized;
}

// 9. POST /collab-station/meetings/:meetingId/token
export async function getMeetingTokenApi(meetingId: string): Promise<MeetingTokenResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/collab-station/meetings/${meetingId}/token`, {
    method: "POST",
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to get LiveKit token for meeting");
  }

  return await res.json();
}

// 10. GET /collab-station/groups (Helper for fetching user collab groups)
export async function getCollabGroupsApi(): Promise<{ id: string; name: string }[]> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/collab-station/groups`, {
    method: "GET",
    headers,
  });

  if (!res.ok) return [];
  const data = await res.json();
  if (Array.isArray(data)) {
    return data.map((g: any) => ({
      id: String(g.id || g.group_id),
      name: String(g.name || "Unnamed Group"),
    }));
  }
  return [];
}
