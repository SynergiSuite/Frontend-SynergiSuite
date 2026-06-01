import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export type CreateDocumentDto = {
  name: string;
  reference_type: string;
  reference_id: string;
  file_path: string;
  label?: string | null;
};

export async function createDocumentApi(payload: CreateDocumentDto) {
  try {
    const token = await CookieManager("get", "access-token");
    const response = await fetch(`${requestBaseUrl}/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to save document record");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving document record:", error);
    throw error;
  }
}
