import { CookieManager } from "@/lib/cookieManager";
import { getChatApiHeaders } from "./getChatApiHeaders";

type ChatPayload = {
  user_id: string;
  message: string;
  session_id: string;
  model: "llama" | "gpt" | "gemma";
  selected_id?: string;
};

export type ChatApiResponse = {
  response?: unknown;
  history?: Array<{
    role: "user" | "assistant";
    content: unknown;
  }>;
  session_id: string;
  user_id: string;
};

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_CHATBOT_BASE_URL;

export async function chatWithUser(
  message: string,
  sessionId: string,
  model: "llama" | "gpt" | "gemma",
  selectedId?: string,
) {
  try {
    const userId = CookieManager("get", "user-id");

    if (typeof userId !== "string" || !userId.trim()) {
      throw new Error("User id not found in cookie");
    }

    const payload: ChatPayload = {
      user_id: userId,
      message,
      session_id: sessionId,
      model,
    };

    if (selectedId) {
      payload.selected_id = selectedId;
    }

    const headers = await getChatApiHeaders();

    console.log("[Chat API Request] Sending payload to:", `${requestBaseUrl}/api/users/chat`, payload);

    const response = await fetch(`${requestBaseUrl}/api/users/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    console.log("[Chat API Response] HTTP Status:", response.status, response.statusText);

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error(`[Chat API Error] Status ${response.status}:`, errText);
      throw new Error(`Failed to send chat message (${response.status}): ${errText}`);
    }

    const data: ChatApiResponse = await response.json();
    console.log("[Chat API Response] Full JSON Payload Received:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    throw error;
  }
}
