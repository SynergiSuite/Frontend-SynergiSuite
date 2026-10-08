import { CookieManager } from "@/lib/cookieManager";

export interface EditTeamPayload {
  name: string;
  description: string;
  members: number[];
  leader_id: number;
}

export const editTeamApi = async (teamId: string, payload: EditTeamPayload) => {
  const accessToken = CookieManager("get", "access-token");
  if (!accessToken) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(`/api/teams/${teamId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || response.statusText || "Failed to update team");
  }

  return response.json();
};
