import { CookieManager } from "@/lib/cookieManager";
import { Team } from "../schemas/team";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getTeamsApi(): Promise<Team[]> {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`${requestBaseUrl}/teams/get-all-teams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "ngrok-skip-browser-warning": "1",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch teams");
    }

    const data = await response.json();

    const teamsList: Team[] = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : Array.isArray(data?.teams)
      ? data.teams
      : Array.isArray(data?.data?.teams)
      ? data.data.teams
      : [];

    return teamsList;
  } catch (error) {
    console.error("Error in getTeamsApi:", error);
    return [];
  }
}