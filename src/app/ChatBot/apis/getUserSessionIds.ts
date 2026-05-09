import { CookieManager } from "@/lib/cookieManager";

export type UserSessionIdsResponse = {
  user_id: string;
  session_ids: string[];
  items: Array<{
    session_id: string;
    last_bot_message: string;
  }>;
  count: number;
};

const chatUrl = "http://localhost:8000";

export async function getUserSessionIds() {
  try {
    const userId = CookieManager("get", "user-id");

    if (typeof userId !== "string" || !userId.trim()) {
      throw new Error("User id not found in cookie");
    }

    const response = await fetch(`${chatUrl}/api/users/${userId}/session-ids`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch session ids");
    }

    const data: UserSessionIdsResponse = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
