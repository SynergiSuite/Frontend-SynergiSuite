import { CookieManager } from "@/lib/cookieManager";
import type { ClientDetailsResponseDto } from "../dtos/clientDetailsResponse.dto";

export async function getClientDetailsApi(
  id: string
): Promise<ClientDetailsResponseDto> {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`/api/clients/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Failed to fetch client details (HTTP ${response.status})`
      );
    }

    const data = await response.json();
    return data as ClientDetailsResponseDto;
  } catch (error) {
    console.error("Error in getClientDetailsApi:", error);
    throw error;
  }
}
