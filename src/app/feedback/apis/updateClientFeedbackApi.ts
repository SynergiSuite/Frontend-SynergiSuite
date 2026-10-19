import { CookieManager } from "@/lib/cookieManager";
import type { ClientFeedbackStatus } from "../types/ticket";

export type AllowedFeedbackStatus = ClientFeedbackStatus;

export interface UpdateClientFeedbackDto {
  id: string | number;
  status: AllowedFeedbackStatus;
  reply?: string;
}

export async function updateClientFeedbackApi(payload: UpdateClientFeedbackDto) {
  const accessToken = await CookieManager("get", "access-token");
  const hasReply = Boolean(payload.reply && payload.reply.trim().length > 0);

  if (hasReply) {
    // If reply is included, send to replies endpoint which records the reply and updates status atomically
    const response = await fetch(`/api/feedback/${payload.id}/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken ?? ""}`,
      },
      body: JSON.stringify({
        message: payload.reply?.trim(),
        status: payload.status,
      }),
    });

    if (!response.ok) {
      // Fallback: try direct PATCH /api/feedback/:id
      const fallbackResponse = await fetch(`/api/feedback/${payload.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken ?? ""}`,
        },
        body: JSON.stringify({
          status: payload.status,
          message: payload.reply?.trim(),
          feedback: payload.reply?.trim(),
        }),
      }).catch(() => null);

      if (!fallbackResponse || !fallbackResponse.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to submit reply and update status");
      }

      return await fallbackResponse.json();
    }

    return await response.json();
  }

  // Pure status update: PATCH /api/feedback/:id
  const response = await fetch(`/api/feedback/${payload.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken ?? ""}`,
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
