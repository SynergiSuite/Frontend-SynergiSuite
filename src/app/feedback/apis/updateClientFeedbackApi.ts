import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export type AllowedFeedbackStatus =
  | "open"
  | "in_progress"
  | "in_review"
  | "resolved"
  | "rejected";

export interface UpdateClientFeedbackDto {
  id: string | number;
  status: AllowedFeedbackStatus;
  reply?: string;
}

export async function updateClientFeedbackApi(payload: UpdateClientFeedbackDto) {
  const accessToken = await CookieManager("get", "access-token");
  const hasReply = Boolean(payload.reply && payload.reply.trim().length > 0);

  if (hasReply) {
    // Manager reply + status update in one action: POST /client-feedback/:feedbackId/replies
    const response = await fetch(`${requestBaseUrl}/client-feedback/${payload.id}/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message: payload.reply?.trim(),
        status: payload.status,
      }),
    });

    if (!response.ok) {
      // Fallback: try PATCH /client-feedback/:feedbackId with reply included
      const fallbackResponse = await fetch(`${requestBaseUrl}/client-feedback/${payload.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status: payload.status,
          message: payload.reply?.trim(),
          reply: payload.reply?.trim(),
        }),
      }).catch(() => null);

      if (!fallbackResponse || !fallbackResponse.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to submit reply and update status");
      }

      return await fallbackResponse.json();
    }

    return await response.json();
  } else {
    // Status-only update: PATCH /client-feedback/:feedbackId
    const response = await fetch(`${requestBaseUrl}/client-feedback/${payload.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        status: payload.status,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to update feedback status");
    }

    return await response.json();
  }
}
