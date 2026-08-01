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

export interface FeedbackPaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface GetFeedbackApiResponse {
  data: ClientFeedbackResponse[];
  meta?: FeedbackPaginationMeta;
}

export async function getMyFeedbackApi(
  page?: number
): Promise<GetFeedbackApiResponse> {
  const accessToken = await CookieManager("get", "access-token");
  const url = `${requestBaseUrl}/client-feedback/my-feedback${
    page && page > 0 ? `?page=${page}` : ""
  }`;
  const response = await fetch(url, {
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

export async function getClientFeedbackApi(
  page?: number
): Promise<GetFeedbackApiResponse> {
  const accessToken = await CookieManager("get", "access-token");
  const url = `${requestBaseUrl}/client-feedback${
    page && page > 0 ? `?page=${page}` : ""
  }`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch client feedback");
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
