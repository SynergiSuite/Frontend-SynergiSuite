import { CookieManager } from "@/lib/cookieManager";
import type { FeedbackPaginationMeta } from "../types/ticket";
export type { FeedbackPaginationMeta };

export interface ClientFeedbackResponse {
  id: string | number;
  titleOfFeedback?: string;
  feedbackTitle?: string;
  title?: string;
  feedbackType?: string;
  category?: string;
  targetType?: string;
  target_type?: string;
  typeId?: string;
  type_id?: string;
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
    company?: string;
  };
  createdBy?: {
    user_id?: number | string;
    name?: string;
    email?: string;
  };
  reply?: string;
  response?: string;
  replyAt?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface GetFeedbackApiResponse {
  data: ClientFeedbackResponse[];
  meta?: FeedbackPaginationMeta;
}

export interface GetFeedbackQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  feedbackType?: string;
  targetType?: string;
  typeId?: string;
  clientId?: string;
}

function buildQueryString(params?: GetFeedbackQueryParams): string {
  if (!params) return "";
  const query = new URLSearchParams();
  if (params.page && params.page > 0) query.set("page", String(params.page));
  if (params.limit && params.limit > 0) query.set("limit", String(params.limit));
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.feedbackType && params.feedbackType !== "all") query.set("feedbackType", params.feedbackType);
  if (params.targetType) query.set("targetType", params.targetType);
  if (params.typeId) query.set("typeId", params.typeId);
  if (params.clientId) query.set("clientId", params.clientId);

  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Fetch all tickets (Employee/Manager view) through Next.js proxy
 */
export async function getClientFeedbackApi(
  params?: GetFeedbackQueryParams | number
): Promise<GetFeedbackApiResponse> {
  const queryParams = typeof params === "number" ? { page: params } : params;
  const accessToken = await CookieManager("get", "access-token");
  const qs = buildQueryString(queryParams);
  const url = `/api/feedback${qs}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken ?? ""}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch client tickets");
  }

  const resData = await response.json();
  if (Array.isArray(resData?.data)) {
    return {
      data: resData.data,
      meta: resData.meta,
    };
  }
  if (Array.isArray(resData)) {
    return {
      data: resData,
    };
  }
  return {
    data: resData?.data || [],
    meta: resData?.meta,
  };
}

/**
 * Fetch tickets belonging specifically to the logged-in client through Next.js proxy
 */
export async function getMyFeedbackApi(
  params?: GetFeedbackQueryParams | number
): Promise<GetFeedbackApiResponse> {
  const queryParams = typeof params === "number" ? { page: params } : params;
  const accessToken = await CookieManager("get", "access-token");
  const qs = buildQueryString(queryParams);
  const url = `/api/feedback/my-feedback${qs}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken ?? ""}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch client feedback history");
  }

  const resData = await response.json();
  if (Array.isArray(resData?.data)) {
    return {
      data: resData.data,
      meta: resData.meta,
    };
  }
  if (Array.isArray(resData)) {
    return {
      data: resData,
    };
  }
  return {
    data: resData?.data || [],
    meta: resData?.meta,
  };
}

/**
 * Fetch single ticket details by ID through Next.js proxy
 */
export async function getFeedbackByIdApi(
  id: string | number
): Promise<ClientFeedbackResponse> {
  const accessToken = await CookieManager("get", "access-token");
  const response = await fetch(`/api/feedback/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken ?? ""}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch ticket details");
  }

  return response.json();
}
