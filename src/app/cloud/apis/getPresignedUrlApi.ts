import { CookieManager } from "@/lib/cookieManager";

export type PresignedUrlResponse = {
  uploadUrl: string;
  filePath: string;
  fileUrl?: string;
  publicUrl?: string;
  viewUrl?: string;
  downloadUrl?: string;
  url?: string;
};

export async function getPresignedUrlApi(fileName: string, mimeType: string, bucket: string): Promise<PresignedUrlResponse> {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch("/api/resources/upload-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? ""}`,
      },
      body: JSON.stringify({
        fileName,
        mimeType,
        bucket,
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
