import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function deleteProjectApi(id: string | number) {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`${requestBaseUrl}/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      else if (response.status === 403) message = "Forbidden: you do not have permission to delete this project";
      else if (response.status === 404) message = "Project not found";
      else message = `Failed to delete project (${response.status}: ${response.statusText})`;
    }
    throw new Error(message);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

export default deleteProjectApi;
