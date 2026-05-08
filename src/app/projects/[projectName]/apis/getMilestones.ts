import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getMilestone(id: string) {
  try {
    if (!requestBaseUrl) {
      throw new Error("Missing backend base URL.");
    }

    const token = await CookieManager("get", "access-token");
    const req = await fetch(`${requestBaseUrl}/milestone/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? ""}`,
      },
    });

    if (!req.ok) {
      const errorText = await req.text();
      throw new Error(errorText || "Failed to fetch milestones.");
    }

    const data = await req.json();
    return data;
  } catch (error) {
    console.error("Error fetching milestones:", error);
    throw error;
  }
}
