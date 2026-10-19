import { CookieManager } from "@/lib/cookieManager";
import type { TicketReplyItem } from "../types/ticket";

export type FeedbackReply = TicketReplyItem;

export async function getFeedbackRepliesApi(
  feedbackId: string | number
): Promise<FeedbackReply[]> {
  const accessToken = await CookieManager("get", "access-token");
  const response = await fetch(`/api/feedback/${feedbackId}/replies`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken ?? ""}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.warn("Could not fetch feedback replies:", errorData?.message);
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data?.data || data?.replies || [];
}
