import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export type FeedbackCategory =
  | "request"
  | "review"
  | "issue"
  | "question"
  | "approval"
  | "general";

export interface SubmitClientFeedbackDto {
  feedbackTitle: string;
  category: FeedbackCategory;
  projectId?: string;
  feedback: string;
  rating?: number;
}

export async function submitClientFeedbackApi(payload: SubmitClientFeedbackDto) {
  const accessToken = await CookieManager("get", "access-token");
  const response = await fetch(`${requestBaseUrl}/client-feedback/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
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
