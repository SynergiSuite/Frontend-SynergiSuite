import { CookieManager } from "@/lib/cookieManager";
import { Team } from "../schemas/team";

export async function getTeamsApi(): Promise<Team[]> {
  try {
    const token = await CookieManager("get", "access-token");
    if (!token) return [];

    const response = await fetch("/api/teams/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 204) {
        return [];
      }
      return [];
    }

    const data = await response.json().catch(() => null);

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