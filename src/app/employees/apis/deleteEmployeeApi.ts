import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function deleteEmployeeApi(employeeId: number) {
  const token = await CookieManager("get", "access-token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(
    `${requestBaseUrl}/business/employees/${employeeId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || response.statusText || "Failed to remove employee"
    );
  }

  const data = await response.json().catch(() => ({
    message: "Employee removed from business successfully.",
  }));
  return data;
}
