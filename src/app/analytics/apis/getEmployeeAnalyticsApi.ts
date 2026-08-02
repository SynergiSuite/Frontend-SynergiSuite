import { CookieManager } from "@/lib/cookieManager";
import { EmployeeTelemetryResponse } from "../schemas/analytics";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export interface GetEmployeeAnalyticsParams {
  userId?: number;
  startDate?: string;
  endDate?: string;
}

export async function getEmployeeAnalyticsApi(
  params?: GetEmployeeAnalyticsParams
): Promise<EmployeeTelemetryResponse> {
  const accessToken = await CookieManager("get", "access-token");
  const queryParams = new URLSearchParams();

  if (params?.userId !== undefined) {
    queryParams.set("userId", String(params.userId));
  }
  if (params?.startDate) {
    queryParams.set("startDate", params.startDate);
  }
  if (params?.endDate) {
    queryParams.set("endDate", params.endDate);
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const response = await fetch(`${requestBaseUrl}/analytics/employees${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch employee telemetry analytics");
  }

  const rawData = await response.json();
  // Support wrapper response.data or direct root object
  const body = rawData?.data && Array.isArray(rawData.data.employees) ? rawData.data : rawData;

  return {
    range: body?.range,
    summary: body?.summary,
    employees: Array.isArray(body?.employees) ? body.employees : Array.isArray(rawData) ? rawData : [],
  };
}

export default getEmployeeAnalyticsApi;
