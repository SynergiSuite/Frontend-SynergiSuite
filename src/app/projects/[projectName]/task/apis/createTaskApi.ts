import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function createTaskApi(obj: any) {
  try {
    const token = CookieManager("get", "access-token");
    const projectId = obj?.projectId ?? CookieManager("get", "project-id");

    if (!projectId) {
      throw new Error("Missing project id.");
    }

    const response = await fetch(`${requestBaseUrl}/projects/create-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ ...obj, projectId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to create task");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create task");
  }
}
