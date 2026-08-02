import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export interface FeedbackReply {
  id?: string | number;
  message?: string;
  reply?: string;
  response?: string;
  status?: string;
  replier?: {
    userId?: number | string;
    name?: string;
    email?: string;
  };
  sender?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
  };
  createdBy?: {
    name?: string;
    email?: string;
  };
  createdAt?: string;
  created_at?: string;
}

export async function getFeedbackRepliesApi(feedbackId: string | number): Promise<FeedbackReply[]> {
  const accessToken = await CookieManager("get", "access-token");
  const response = await fetch(`${requestBaseUrl}/client-feedback/${feedbackId}/replies`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.warn("Could not fetch feedback replies:", errorData?.message);
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data?.data || data?.replies || [];
}
