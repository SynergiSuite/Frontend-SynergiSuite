import { CookieManager } from "@/lib/cookieManager";

export interface ChatbotReportApiItem {
  id: string;
  businessId: number;
  reportName: string;
  bucket: string;
  objectKey: string;
  contentType: string;
  fileSize: string;
  checksum?: string;
  createdAt: string;
  url: string;
  expiresIn: number;
}

export interface ChatbotReportsApiResponse {
  data: ChatbotReportApiItem[];
  total: number;
}

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getChatbotReportsApi(
  limit = 100,
  expiresIn = 300
): Promise<ChatbotReportsApiResponse> {
  const token = CookieManager("get", "access-token");

  const response = await fetch(
    `${requestBaseUrl}/chatbot/reports?limit=${limit}&expiresIn=${expiresIn}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch chatbot reports (${response.status})`);
  }

  const result = await response.json();
  return result;
}
