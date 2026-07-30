import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export interface ClientFeedbackResponse {
  id: string | number;
  titleOfFeedback?: string;
  feedbackTitle?: string;
  title?: string;
  feedbackType?: string;
  category?: string;
  targetType?: string;
  typeId?: string;
  projectId?: string;
  project_id?: string;
  project?: {
    id?: string;
    name?: string;
  };
  projectName?: string;
  feedback?: string;
  message?: string;
  status?: string;
  starRating?: number;
  rating?: number;
  client?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  reply?: string;
  response?: string;
  replyAt?: string;
  createdAt?: string;
  created_at?: string;
}

export async function getMyFeedbackApi(): Promise<ClientFeedbackResponse[]> {
  const accessToken = await CookieManager("get", "access-token");
  const response = await fetch(`${requestBaseUrl}/client-feedback/my-feedback`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch feedback history");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data?.data || [];
}
