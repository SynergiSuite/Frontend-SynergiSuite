import { CookieManager } from "@/lib/cookieManager";
import { Task } from "../schemas/task";

export async function fetchTaskApi(projectId?: string): Promise<Task[]> {
  try {
    const token = await CookieManager("get", "access-token");
    const cookieProjectId = await CookieManager("get", "project-id");
    const resolvedProjectId = projectId || (cookieProjectId ? String(cookieProjectId) : "");

    if (!resolvedProjectId) {
      throw new Error("Missing project id.");
    }

    const response = await fetch(`/api/tasks/${encodeURIComponent(resolvedProjectId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (token ?? ""),
      },
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 204) {
        return [];
      }
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to fetch tasks");
    }

    const data = await response.json();
    return Array.isArray(data?.tasks) ? data.tasks : Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch tasks");
  }
}
