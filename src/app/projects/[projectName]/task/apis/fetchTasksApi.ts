import { CookieManager } from "@/lib/cookieManager";
import { Task } from "../schemas/task";
const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function fetchTaskApi(projectId?: string): Promise<Task[]> {
  try {
    const token = CookieManager("get", "access-token");
    const resolvedProjectId = projectId ?? CookieManager("get", "project-id");

    if (!resolvedProjectId) {
      throw new Error("Missing project id.");
    }

    const response = await fetch(
      `${requestBaseUrl}/projects/get-all-tasks-for-projects?projectId=${resolvedProjectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch tasks");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch tasks");
  }
}
