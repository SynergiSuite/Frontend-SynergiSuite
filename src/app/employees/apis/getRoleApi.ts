import { CookieManager } from "@/lib/cookieManager";
import { Role } from "../schemas/roles";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function fetchRoles(): Promise<Role[]> {
  const token = await CookieManager("get", "access-token");
  const response = await fetch(`${requestBaseUrl}/roles/get-all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data: Role[] = await response.json();
  return data;
}