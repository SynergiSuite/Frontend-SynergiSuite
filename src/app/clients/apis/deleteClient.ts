import { CookieManager } from "@/lib/cookieManager";

export async function deleteClientApi(id: string) {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`/api/clients/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to delete client");
    }

    const data = await response.json().catch(() => ({}));
    return data;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
}
