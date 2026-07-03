import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function CreateDirectChatApi(targetUserId: string) {
  try {
    const token = await CookieManager("get", "access-token");

    const response = await fetch(
      `${requestBaseUrl}/collab-station/groups/direct/${targetUserId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create direct chat");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating direct chat:", error);
    throw error;
  }
}