import { CookieManager } from "@/lib/cookieManager";
import { MilestoneUpdate } from "../schemas/milestone";


const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function UpdateMilestone(payload: MilestoneUpdate) {
  try {
    if (!requestBaseUrl) {
      throw new Error("Missing backend base URL.");
    }

    const token = await CookieManager("get", "access-token");
    const response = await fetch(`${requestBaseUrl}/milestone/update-milestone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to update milestone.");
    }

    const data = await response.json();
    return data.milestone;
  } catch (error) {
    console.error("Error updating milestone:", error);
    throw error;
  }
}
