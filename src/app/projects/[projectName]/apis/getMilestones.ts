import { CookieManager } from "@/lib/cookieManager";

export async function getMilestone(id: string) {
  try {
    const token = await CookieManager("get", "access-token");
    const req = await fetch(`/api/milestones/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? ""}`,
      },
    });

    if (!req.ok) {
      if (req.status === 404 || req.status === 204) {
        return [];
      }
      const errorData = await req.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to fetch milestones.");
    }

    const data = await req.json();
    return data;
  } catch (error) {
    console.error("Error fetching milestones:", error);
    throw error;
  }
}
