import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getDocumentsApi() {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`${requestBaseUrl}/documents`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get documents list");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching documents list:", error);
    throw error;
  }
}
