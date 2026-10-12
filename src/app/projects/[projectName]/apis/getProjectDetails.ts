import { CookieManager } from "@/lib/cookieManager";

export async function GetProjectDetails(projectName: string) {
  try {
    const token = await CookieManager("get", "access-token");
    const cleanProjectName = decodeURIComponent(projectName || "").trim();
    const response = await fetch(
      `/api/projects/details?projectName=${encodeURIComponent(cleanProjectName)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to get project details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting project details:", error);
    throw error;
  }
}