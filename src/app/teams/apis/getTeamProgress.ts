import { CookieManager } from "@/lib/cookieManager";

export const getTeamProgress = async (teamId: string) => {
  if (!teamId) {
    throw new Error("Missing team id.");
  }

  const accessToken = CookieManager("get", "access-token");
  if (!accessToken) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(`/api/teams/progress/${teamId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch team progress.");
  }

  return await response.json();
};
