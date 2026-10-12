import { CookieManager } from "@/lib/cookieManager";

export async function DeleteMilestone(milestoneId: string) {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`/api/milestones/${encodeURIComponent(milestoneId)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? ""}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to delete milestone.");
    }

    return response.json().catch(() => ({ deleted: true }));
  } catch (error) {
    console.error("Error deleting milestone:", error);
    throw error;
  }
}
