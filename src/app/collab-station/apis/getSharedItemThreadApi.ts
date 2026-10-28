import { CookieManager } from "@/lib/cookieManager";
import { SharedEntityType } from "../types";
import { RawChatMessage } from "../helpers/chatHelperFunctions";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";

export async function getSharedItemThreadApi(
  groupId: string,
  sharedEntityType: SharedEntityType,
  sharedEntityId: string
): Promise<RawChatMessage[] | null> {
  const token = await CookieManager("get", "access-token");

  try {
    const query = new URLSearchParams({
      sharedEntityType,
      sharedEntityId,
    });

    const res = await fetch(
      `${baseUrl}/collab-station/groups/${encodeURIComponent(groupId)}/messages?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      // Endpoint may not be deployed yet on backend; return null to signal fallback to local filter
      return null;
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data?.messages || [];
  } catch (error) {
    console.warn("Thread endpoint not available yet, falling back to local thread filtering", error);
    return null;
  }
}
