import { CookieManager } from "@/lib/cookieManager";

type ChatPayload = {
  user_id: string;
  message: string;
  session_id: string;
};

export type ChatApiResponse = {
  response?: string;
  history?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  session_id: string;
  user_id: string;
};

const chatUrl = "http://localhost:8000";

export async function chatWithUser(message: string, sessionId: string) {
  try {
    const userId = CookieManager("get", "user-id");

    if (typeof userId !== "string" || !userId.trim()) {
      throw new Error("User id not found in cookie");
    }

    const payload: ChatPayload = {
      user_id: userId,
      message,
      session_id: sessionId,
    };

    const response = await fetch(`${chatUrl}/api/users/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to send chat message");
    }

    const data: ChatApiResponse = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
