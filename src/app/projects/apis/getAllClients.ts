import { CookieManager } from "@/lib/cookieManager";
import { GetAllClientsResponseDto } from "@/app/clients/dtos/getAllClientsResponse.dto";

export async function getClientsApi(): Promise<GetAllClientsResponseDto[]> {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch("/api/clients/all", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 204) {
        return [];
      }
      return [];
    }

    const data = await response.json().catch(() => null);
    const clientsList = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.clients)
      ? data.clients
      : [];

    return clientsList;
  } catch (error) {
    console.error("Error in getClientsApi:", error);
    return [];
  }
}
