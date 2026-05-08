import { CookieManager } from "@/lib/cookieManager";
import { Team } from "@/app/projects/schemas/team";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getProjectTeams(projectId?: string): Promise<Team[]> {
  try {
    const token = CookieManager("get", "access-token");
    const resolvedProjectId = projectId ?? CookieManager("get", "project-id");

    if (!resolvedProjectId) {
      throw new Error("Missing project id.");
    }

    const response = await fetch(`${requestBaseUrl}/projects/get-all-project-teams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: resolvedProjectId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch project teams");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch project teams"
    );
  }
}
