import { CookieManager } from "@/lib/cookieManager";

export type SessionHistoryResponse = {
  user_id: string;
  session_id: string;
  history: Array<{
    role: "user" | "assistant";
    content: string;
    ts: string;
  }>;
  count: number;
};

const chatUrl = "http://localhost:8000";

export async function getSessionHistory() {
  try {
    const userId = CookieManager("get", "user-id");
    const sessionId = CookieManager("get", "session-id");

    if (typeof userId !== "string" || !userId.trim()) {
      throw new Error("User id not found in cookie");
    }

    if (typeof sessionId !== "string" || !sessionId.trim()) {
      throw new Error("Session id not found in cookie");
    }

    const response = await fetch(
      `${chatUrl}/api/users/${userId}/sessions/${sessionId}/history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch session history");
    }

    const data: SessionHistoryResponse = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
