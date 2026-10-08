import { CookieManager } from "@/lib/cookieManager";

export async function deleteEmployeeApi(employeeId: number) {
  const token = await CookieManager("get", "access-token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(
    `/api/employees/${employeeId}`,
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
