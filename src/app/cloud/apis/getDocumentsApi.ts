import { CookieManager } from "@/lib/cookieManager";


export async function getDocumentsApi() {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch("/api/documents", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token ?? ""}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to get documents list");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching documents list:", error);
    throw error;
  }
}
//  oaoe robx hpzy dwfi