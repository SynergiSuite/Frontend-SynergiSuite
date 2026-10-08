import { CookieManager } from "@/lib/cookieManager";

export interface PrimaryRole {
  id: number;
  name: string;
  description?: string;
}

export interface CustomRole {
  id: number;
  name: string;
  primary_role?: PrimaryRole;
  primary_role_id?: number;
  created_at?: string;
}

export async function fetchPrimaryRoles(): Promise<PrimaryRole[]> {
  try {
    const token = await CookieManager("get", "access-token");
    const res = await fetch("/api/roles/primary", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch primary roles");
    }

    const data = await res.json();
    const list: PrimaryRole[] = Array.isArray(data) ? data : [];
    return list.filter((r) => r?.name && !r.name.toLowerCase().includes("client"));
  } catch (error) {
    console.error("fetchPrimaryRoles error:", error);
    // Return fallback list (excluding Client)
    return [
      { id: 1, name: "Founder" },
      { id: 2, name: "Manager" },
      { id: 3, name: "Senior Employee" },
      { id: 4, name: "Junior Employee" },
    ];
  }
}

export async function createCustomRole(
  name: string,
  primary_role_id: number
): Promise<CustomRole> {
  const token = await CookieManager("get", "access-token");
  const res = await fetch("/api/roles/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      primary_role_id,
    }),
  });

  const responseData = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      responseData.message || responseData.error || "Failed to create role"
    );
  }

  return responseData;
}
