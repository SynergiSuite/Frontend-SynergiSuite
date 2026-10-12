import { CookieManager } from "@/lib/cookieManager";

export interface UpdateTaskPayload {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
  dueDate?: string;
  milestoneId?: string;
  teamId?: string;
  assigneeId?: number;
}

export async function updateTaskApi(data: UpdateTaskPayload) {
  try {
    const token = await CookieManager("get", "access-token");

    // Strictly build payload with ONLY defined properties matching the backend DTO
    const payload: Record<string, unknown> = {
      id: data.id,
    };

    if (data.title !== undefined) {
      payload.title = data.title;
    }

    if (data.description !== undefined) {
      payload.description = data.description;
    }

    if (data.status !== undefined) {
      payload.status = data.status;
    }

    if (data.priority !== undefined) {
      payload.priority = data.priority;
    }

    // Backend strictly requires "due_date" (ISO format) and forbids "dueDate"
    const rawDate = data.due_date ?? data.dueDate;
    if (rawDate !== undefined && rawDate !== "") {
      try {
        const parsed = new Date(rawDate);
        payload.due_date = !isNaN(parsed.getTime()) ? parsed.toISOString() : rawDate;
      } catch {
        payload.due_date = rawDate;
      }
    }

    if (data.milestoneId !== undefined) {
      payload.milestoneId =
        data.milestoneId && data.milestoneId !== "none" ? data.milestoneId : undefined;
    }

    if (data.teamId !== undefined) {
      payload.teamId = data.teamId || undefined;
    }

    if (data.assigneeId !== undefined) {
      payload.assigneeId = data.assigneeId ? Number(data.assigneeId) : undefined;
    }

    // Sanitize any undefined properties before sending
    const sanitizedPayload: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(payload)) {
      if (value !== undefined) {
        sanitizedPayload[key] = value;
      }
    }

    const response = await fetch(`/api/tasks/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? ""}`,
      },
      body: JSON.stringify(sanitizedPayload),
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