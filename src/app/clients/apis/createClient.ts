import { CookieManager } from "@/lib/cookieManager";
import { CreateClientDto } from "../dtos/createClient.dto";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function createClientApi(obj: CreateClientDto) {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`${requestBaseUrl}/clients/add-client`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      throw new Error("Failed to create client");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
}
