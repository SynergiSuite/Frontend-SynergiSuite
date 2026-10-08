import { CookieManager } from "@/lib/cookieManager";

export const deleteTeamApi = async (teamId: string) => {
  const accessToken = CookieManager("get", "access-token");
  if (!accessToken) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(`/api/teams/${teamId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || response.statusText || "Failed to delete team");
  }

  return response.json().catch(() => ({ message: "Team deleted successfully" }));
};
