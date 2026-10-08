import { CookieManager } from "@/lib/cookieManager";

export interface CreateTeamPayload {
  name: string;
  description?: string;
  leader_id: number;
  members: number[];
}

export async function createTeamApi(payload: CreateTeamPayload) {
  const token = CookieManager("get", "access-token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch("/api/teams/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    let errorMessage = "";
    if (Array.isArray(errorData?.message)) {
      errorMessage = errorData.message.join(", ");
    } else if (typeof errorData?.message === "string") {
      errorMessage = errorData.message;
    } else {
      errorMessage = `Failed to create team (${response.status}: ${response.statusText})`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
