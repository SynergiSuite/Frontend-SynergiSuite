import { CookieManager } from "@/lib/cookieManager";
import type { ClientFeedbackType } from "../types/ticket";

export type FeedbackCategory = ClientFeedbackType;

export interface SubmitClientFeedbackDto {
  feedbackTitle: string;
  category: FeedbackCategory;
  projectId?: string;
  feedback: string;
  rating?: number;
}

export async function submitClientFeedbackApi(payload: SubmitClientFeedbackDto) {
  const accessToken = await CookieManager("get", "access-token");
  const response = await fetch("/api/feedback/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken ?? ""}`,
    },
    body: JSON.stringify({
      feedbackTitle: payload.feedbackTitle,
      titleOfFeedback: payload.feedbackTitle,
      category: payload.category,
      feedbackType: payload.category,
      projectId: payload.projectId,
      typeId: payload.projectId,
      targetType: payload.projectId ? "project" : "general",
      feedback: payload.feedback,
      rating: payload.rating,
      starRating: payload.rating,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to submit feedback");
  }

  return response.json();
}
