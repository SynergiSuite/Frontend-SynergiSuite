import { CookieManager } from "@/lib/cookieManager";
import { MilestoneUpdate } from "../schemas/milestone";

export async function UpdateMilestone(payload: MilestoneUpdate) {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`/api/milestones/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? ""}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to update milestone.");
    }

    const data = await response.json();
    return data.milestone || data;
  } catch (error) {
    console.error("Error updating milestone:", error);
    throw error;
  }
}
