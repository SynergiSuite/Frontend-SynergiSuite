import { CookieManager } from "@/lib/cookieManager";

export interface CreateTaskPayload {
  projectId: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  due_date?: string;
  milestoneId?: string;
  teamId?: string;
  assigneeId?: number;
}

export async function createTaskApi(obj: CreateTaskPayload) {
  try {
    const token = await CookieManager("get", "access-token");
    const cookieProjectId = await CookieManager("get", "project-id");
    const projectId = obj.projectId || (cookieProjectId ? String(cookieProjectId) : "");

    if (!projectId) {
      throw new Error("Missing project id.");
    }

    const payload = {
      projectId,
      title: obj.title,
      description: obj.description || undefined,
      status: obj.status,
      priority: obj.priority,
      dueDate: obj.dueDate || obj.due_date || undefined,
      milestoneId: obj.milestoneId || undefined,
      teamId: obj.teamId || undefined,
      assigneeId: obj.assigneeId ? Number(obj.assigneeId) : undefined,
    };

    const response = await fetch(`/api/tasks/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (token ?? ""),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to create task");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create task");
  }
}
