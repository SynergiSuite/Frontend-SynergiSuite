import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export interface EditEmployeePayload {
  salary?: number | string;
  roleId?: number;
}

export async function editEmployeeApi(
  employeeId: number,
  payload: EditEmployeePayload
) {
  const token = await CookieManager("get", "access-token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  // Build clean request body with numeric salary and roleId
  const body: Record<string, any> = {};

  if (payload.salary !== undefined && payload.salary !== null && String(payload.salary).trim() !== "") {
    const numSalary = Number(payload.salary);
    if (isNaN(numSalary)) {
      throw new Error("Salary must be a valid number");
    }
    if (numSalary < 0 || numSalary > 1000000) {
      throw new Error("Salary must be between 0 and 1,000,000");
    }
    body.salary = numSalary;
  }

  if (payload.roleId !== undefined && payload.roleId !== null && !isNaN(Number(payload.roleId))) {
    body.roleId = Number(payload.roleId);
  }

  const response = await fetch(
    `${requestBaseUrl}/business/employees/${employeeId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const msg = Array.isArray(errorData?.message)
      ? errorData.message.join(", ")
      : errorData?.message || response.statusText || "Failed to update employee";
    throw new Error(msg);
  }

  const data = await response.json();
  return data;
}
