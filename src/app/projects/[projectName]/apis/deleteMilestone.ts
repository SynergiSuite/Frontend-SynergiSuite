import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function DeleteMilestone(milestoneId: string) {
  try {
    if (!requestBaseUrl) {
      throw new Error("Missing backend base URL.");
    }

    const token = await CookieManager("get", "access-token");
    const response = await fetch(`${requestBaseUrl}/milestone/${milestoneId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to delete milestone.");
    }

    return response.json().catch(() => ({ deleted: true }));
  } catch (error) {
    console.error("Error deleting milestone:", error);
    throw error;
  }
}
