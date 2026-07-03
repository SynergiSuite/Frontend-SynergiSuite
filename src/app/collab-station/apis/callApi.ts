import { CookieManager } from "@/lib/cookieManager";
import { CallDto, CallTokenResponse } from "../callTypes";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

async function authorizedFetch(path: string, init?: RequestInit) {
  const token = await CookieManager("get", "access-token");
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || `Call request failed (${response.status})`);
  }

  return response;
}

export async function getCurrentCall(): Promise<CallDto | null> {
  const response = await authorizedFetch("/collab-station/calls/current");
  return response.json();
}

export async function getCallToken(callId: string): Promise<CallTokenResponse> {
  const response = await authorizedFetch(`/collab-station/calls/${callId}/token`, {
    method: "POST",
  });
  return response.json();
}
