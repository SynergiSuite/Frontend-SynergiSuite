import { CookieManager } from "@/lib/cookieManager";
import { Team } from "@/app/projects/schemas/team";

export async function getProjectTeams(projectId?: string): Promise<Team[]> {
  try {
    const token = await CookieManager("get", "access-token");
    const cookieProjectId = await CookieManager("get", "project-id");
    const resolvedProjectId = projectId || (cookieProjectId ? String(cookieProjectId) : "");

    if (!resolvedProjectId) {
      throw new Error("Missing project id.");
    }

    const response = await fetch(`/api/projects/teams/${encodeURIComponent(resolvedProjectId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? ""}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 204) {
        return [];
      }
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to fetch project teams");
    }

    const data = await response.json();
    return Array.isArray(data?.teams)
      ? data.teams
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch project teams"
    );
  }
}
