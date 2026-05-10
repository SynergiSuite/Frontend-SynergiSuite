import { CookieManager } from "@/lib/cookieManager";
import { getChatApiHeaders } from "./getChatApiHeaders";

export type DeleteSessionResponse = {
  deleted: boolean;
  user_id: string;
  session_id: string;
  file_cleanup: {
    user_id: string;
    session_id: string;
    removed_from_index: boolean;
    transcript_deleted: boolean;
    log_deleted: boolean;
  };
  facts_cleanup: {
    session_id: string;
    user_id: string;
    deleted_count: number;
  };
  memory_cleared: boolean;
};

const chatUrl = "http://localhost:8000";

export async function deleteSession(sessionId: string) {
  try {
    const userId = CookieManager("get", "user-id");

    if (typeof userId !== "string" || !userId.trim()) {
      throw new Error("User id not found in cookie");
    }

    if (!sessionId.trim()) {
      throw new Error("Session id is required");
    }

    const response = await fetch(
      `${chatUrl}/api/users/${userId}/sessions/${sessionId}`,
      {
        method: "DELETE",
        headers: getChatApiHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete session");
    }

    const data: DeleteSessionResponse = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
