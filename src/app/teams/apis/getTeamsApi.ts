import { CookieManager } from "@/lib/cookieManager";

export const getTeamsApi = async () => {
  const accessToken = CookieManager("get", "access-token");
  if (!accessToken) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch("/api/teams/all", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404 || response.status === 204) {
      return [];
    }
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch teams");
  }

  const data = await response.json().catch(() => []);
  const teamsList = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : Array.isArray(data?.teams)
    ? data.teams
    : [];

  return teamsList;
};