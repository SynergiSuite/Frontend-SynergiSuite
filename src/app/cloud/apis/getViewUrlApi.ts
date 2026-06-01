import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export type ViewUrlResponse = {
  viewUrl: string;
};

export async function getViewUrlApi(documentId: string): Promise<ViewUrlResponse> {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`${requestBaseUrl}/resources/${documentId}/view-url`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get document view URL");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching document view URL:", error);
    throw error;
  }
}
