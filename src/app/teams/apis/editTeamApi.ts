import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export interface EditTeamPayload {
  name: string;
  description: string;
  members: number[];
  leader_id: number;
}

export const editTeamApi = async (teamId: string, payload: EditTeamPayload) => {
  try {
    const accessToken = CookieManager("get", "access-token");

    const response = await fetch(`${requestBaseUrl}/teams/update-team/${teamId}`, {
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating team:", error);
    throw error;
  }
};
