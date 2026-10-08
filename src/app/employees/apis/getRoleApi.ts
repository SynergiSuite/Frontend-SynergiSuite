import { CookieManager } from "@/lib/cookieManager";
import { Role } from "../schemas/roles";

export async function fetchRoles(): Promise<Role[]> {
  const token = await CookieManager("get", "access-token");
  const response = await fetch("/api/roles", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  return Array.isArray(data)
    ? data
        .filter((r: any) => r?.name && !r.name.toLowerCase().includes("client"))
        .map((r: any) => ({
          id: Number(r.id),
          name: String(r.name),
        }))
    : [];
}
