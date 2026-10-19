import { CookieManager } from "@/lib/cookieManager";
import type {
  ClientFeedbackStatus,
  ClientFeedbackTargetType,
  ClientFeedbackType,
} from "../types/ticket";

export interface CreateClientFeedbackDto {
  clientId: string;
  titleOfFeedback: string;
  feedback: string;
  starRating?: number;
  feedbackType: ClientFeedbackType;
  targetType: ClientFeedbackTargetType;
  typeId: string;
  status?: ClientFeedbackStatus;
}

export async function createTicketApi(payload: CreateClientFeedbackDto) {
  const accessToken = await CookieManager("get", "access-token");
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken ?? ""}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to create client ticket");
  }

  return response.json();
}
