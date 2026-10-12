import { CookieManager } from "@/lib/cookieManager";

export interface UpdateTaskPayload {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  due_date?: string;
  teamId?: string;
  assigneeId?: number;
}

export async function updateTaskApi(data: UpdateTaskPayload) {
  try {
    const token = await CookieManager("get", "access-token");
    const payload = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate || data.due_date || undefined,
      teamId: data.teamId || undefined,
      assigneeId: data.assigneeId ? Number(data.assigneeId) : undefined,
    };

    const response = await fetch(`/api/tasks/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? ""}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to update task");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}