import { CookieManager } from "@/lib/cookieManager";
import type { EditClientDto } from "../dtos/editClient.dto";

export async function editClientApi(id: string, obj: EditClientDto) {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`/api/clients/${encodeURIComponent(id)}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to edit client");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error editing client:", error);
    throw error;
  }
}
