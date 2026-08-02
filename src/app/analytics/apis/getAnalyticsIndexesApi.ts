import { CookieManager } from "@/lib/cookieManager";
import { AnalyticsIndexesResponse } from "../schemas/analytics";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getAnalyticsIndexesApi(
  startDate?: string,
  endDate?: string
): Promise<AnalyticsIndexesResponse> {
  try {
    const accessToken = await CookieManager("get", "access-token");
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await fetch(`${requestBaseUrl}/analytics/indexes${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch analytics indexes");
    }

    const data: AnalyticsIndexesResponse = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error("Error fetching analytics indexes:", error);
    throw error;
  }
}

export default getAnalyticsIndexesApi;
