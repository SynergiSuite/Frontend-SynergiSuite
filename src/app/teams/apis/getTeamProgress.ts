import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const getTeamProgress = async (teamId: string) => {
  try {
    const accessToken = CookieManager("get", "access-token");

    if (!teamId) {
      throw new Error("Missing team id.");
    }

    const response = await fetch(
      `${requestBaseUrl}/teams/team-progress/${teamId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch team progress.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching team progress:", error);
    throw error;
  }
};
