import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export interface CreateCustomGroupPayload {
  name: string;
  description?: string;
  avatarUrl?: string;
  members?: number[];
}

export async function createCustomGroupApi(payload: CreateCustomGroupPayload) {
  const token = CookieManager("get", "access-token");

  if (!token) {
    throw new Error("No access token found. Please log in again.");
  }

  const response = await fetch(`${requestBaseUrl}/collab-station/groups/custom`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message ?? "Failed to create group");
  }

  return response.json();
}