import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export type PresignedUrlResponse = {
  uploadUrl: string;
  filePath: string;
};

export async function getPresignedUrlApi(fileName: string, mimeType: string): Promise<PresignedUrlResponse> {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`${requestBaseUrl}/resources/upload-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileName,
        mimeType,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get presigned upload URL");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching presigned upload URL:", error);
    throw error;
  }
}
