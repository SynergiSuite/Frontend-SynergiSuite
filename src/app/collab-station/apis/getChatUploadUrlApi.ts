import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export type ChatUploadUrlResponse = {
  uploadUrl: string;
  filePath: string;
};

export async function getChatUploadUrlApi(
  fileName: string,
  mimeType: string
): Promise<ChatUploadUrlResponse> {
  const token = await CookieManager("get", "access-token");
  const response = await fetch(`${requestBaseUrl}/resources/chat/upload-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fileName,
      mimeType: mimeType || "application/octet-stream",
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    const msg = errData?.message || response.statusText;
    throw new Error(`Failed to get chat upload URL: ${msg}`);
  }

  const data: ChatUploadUrlResponse = await response.json();
  return data;
}
