import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function deleteDocumentApi(id: string | number) {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`${requestBaseUrl}/documents/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return true;
    }

    const errorData = await response.json().catch(() => null);
    let message = "";
    if (Array.isArray(errorData?.message)) {
      message = errorData.message.join(", ");
    } else if (typeof errorData?.message === "string") {
      message = errorData.message;
    } else {
      if (response.status === 401) message = "Unauthorized: missing or invalid session token";
      else if (response.status === 403) message = "Forbidden: you do not have permission to delete this document";
      else if (response.status === 404) message = "Document not found";
      else if (response.status === 500) message = "Storage error: failed to delete file from MinIO";
      else message = `Failed to delete document (${response.status}: ${response.statusText})`;
    }
    throw new Error(message);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}
