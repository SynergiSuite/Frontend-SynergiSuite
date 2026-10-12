import { CookieManager } from "@/lib/cookieManager";

export async function CreateNewMilestone(payload: unknown) {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`/api/milestones/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? ""}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to create new milestone");
    }

    const data = await response.json();
    return data.milestone || data;
  } catch (error) {
    console.error("Error creating new milestone:", error);
    throw error;
  }
}