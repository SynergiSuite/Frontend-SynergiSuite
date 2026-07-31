import { CookieManager } from "@/lib/cookieManager";
import { InviteEmployeePayload } from "../schemas/addEmployee";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function inviteEmployee(payload: InviteEmployeePayload): Promise<boolean> {
  const token = await CookieManager("get", "access-token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const numSalary = Number(payload.salary);
  if (isNaN(numSalary)) {
    throw new Error("Salary must be a valid number");
  }
  if (numSalary < 0 || numSalary > 1000000) {
    throw new Error("Salary must be between 0 and 1,000,000");
  }

  const body = {
    email: payload.email,
    role_id: Number(payload.role_id),
    salary: numSalary,
  };

  const res = await fetch(`${requestBaseUrl}/business/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const text = Array.isArray(errorData?.message)
      ? errorData.message.join(", ")
      : errorData?.message || "Failed to invite employee";
    throw new Error(text);
  }

  return true;
}