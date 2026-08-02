import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export interface AllEmployeeRecord {
  user_id: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role?: {
    id: number;
    name?: string;
    role?: string;
  };
}

export interface GetAllEmployeesResponse {
  data: AllEmployeeRecord[];
}

export async function getAllEmployeesApi(): Promise<AllEmployeeRecord[]> {
  const token = await CookieManager("get", "access-token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(`${requestBaseUrl}/business/get-employees-all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Failed to fetch all employees: ${response.statusText}`);
  }

  const resJson: GetAllEmployeesResponse = await response.json();
  return resJson.data || [];
}
