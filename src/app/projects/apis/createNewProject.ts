import { CookieManager } from "@/lib/cookieManager";


export type CreateProjectPayload = {
  name: string;
  description?: string;
  client: string;
  teams: string[];
  status: number;
  duration: string;
};

export async function CreateNewProject(payload: CreateProjectPayload) {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch("/api/projects/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      let message = "";
      if (Array.isArray(errorData?.message)) {
        message = errorData.message.join(", ");
      } else if (typeof errorData?.message === "string") {
        message = errorData.message;
      } else {
        message = `Failed to create project (${response.status}: ${response.statusText})`;
      }
      throw new Error(message);
    }

    const data = await response.json().catch(() => null);
    return data ?? true;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}