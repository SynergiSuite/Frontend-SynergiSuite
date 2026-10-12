import { CookieManager } from "@/lib/cookieManager";

export async function deleteTaskApi(taskId: string) {
  try {
    const token = CookieManager("get", "access-token");
    const response = await fetch(`/api/tasks/delete/${encodeURIComponent(taskId)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? ""}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to delete task");
    }

    return response.json().catch(() => ({ deleted: true }));
  } catch (error) {
    throw error;
  }
}