import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export type EditProjectPayload = {
  name: string;
  description?: string;
  status: number;
  duration: string;
};

export async function editProjectApi(id: string | number, payload: EditProjectPayload) {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`${requestBaseUrl}/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status >= 200 && response.status < 300) {
      const data = await response.json().catch(() => null);
      return data ?? true;
    }

    const errorData = await response.json().catch(() => null);
    let message = "";
    if (Array.isArray(errorData?.message)) {
      message = errorData.message.join(", ");
    } else if (typeof errorData?.message === "string") {
      message = errorData.message;
    } else {
      if (response.status === 401) message = "Unauthorized: missing or invalid session token";
      else if (response.status === 403) message = "Forbidden: you do not have permission to edit this project";
      else if (response.status === 404) message = "Project not found";
      else message = `Failed to update project (${response.status}: ${response.statusText})`;
    }
    throw new Error(message);
  } catch (error) {
    console.error("Error editing project:", error);
    throw error;
  }
}

export default editProjectApi;
