import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export interface EditCustomGroupPayload {
  name?: string;
  description?: string;
  avatarUrl?: string;
}

export async function editCustomGroupApi(groupId: string, payload: EditCustomGroupPayload) {
  const token = await CookieManager("get", "access-token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  let response = await fetch(`${requestBaseUrl}/collab-station/groups/${groupId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok && response.status === 404) {
    response = await fetch(`${requestBaseUrl}/collab-station/groups/custom/${groupId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = Array.isArray(errorData?.message)
      ? errorData.message.join(", ")
      : errorData?.message || `Failed to update group (HTTP ${response.status})`;
    throw new Error(errorMessage);
  }

  return response.json();
}
