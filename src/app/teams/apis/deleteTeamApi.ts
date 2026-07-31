import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const deleteTeamApi = async (teamId: string) => {
  try {
    const accessToken = CookieManager("get", "access-token");

    let res = await fetch(`${requestBaseUrl}/teams/remove-team/${teamId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Fallback to DELETE method if POST is not allowed on backend
    if (!res.ok && (res.status === 404 || res.status === 405)) {
      res = await fetch(`${requestBaseUrl}/teams/remove-team/${teamId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || res.statusText || "Failed to delete team");
    }

    const data = await res.json().catch(() => ({ message: "Team deleted successfully" }));
    return data;
  } catch (error) {
    console.error("Error deleting team:", error);
    throw error;
  }
};
