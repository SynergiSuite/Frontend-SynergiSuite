import { CookieManager } from "@/lib/cookieManager";
import { EditClientDto } from "../dtos/editClient.dto";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function editClientApi(id: string, obj: EditClientDto) {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`${requestBaseUrl}/clients/edit-client/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      throw new Error("Failed to edit client");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error editing client:", error);
    throw error;
  }
}
