import { CookieManager } from "@/lib/cookieManager";
import type { CreateClientDto } from "../dtos/createClient.dto";

export async function createClientApi(obj: CreateClientDto) {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch("/api/clients/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to create client");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
}
