import { CookieManager } from "@/lib/cookieManager";
import { CollabGroup } from "../types";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";

export async function getProjectGroupApi(projectId: string): Promise<CollabGroup | null> {
  if (!projectId) return null;
  const token = await CookieManager("get", "access-token");

  const res = await fetch(`${baseUrl}/collab-station/groups/project/${encodeURIComponent(projectId)}`, {
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    const errData = await res.json().catch(() => null);
    throw new Error(errData?.message || "Failed to load project chat group");
  }

  const data = await res.json();
  return data?.group || data;
}
