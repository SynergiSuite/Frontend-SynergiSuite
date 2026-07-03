import { CookieManager } from "@/lib/cookieManager";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function deleteMessageApi(messageId: string) {
  const token = await CookieManager("get", "access-token");

  const res = await fetch(`${baseUrl}/chat/messages/${messageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete message");
  }

  return res.json();
}
