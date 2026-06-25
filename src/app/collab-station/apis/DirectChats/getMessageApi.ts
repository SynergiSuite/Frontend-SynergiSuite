import { CookieManager } from "@/lib/cookieManager";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getMessagesApi(chatId: string) {
  const token = await CookieManager("get", "access-token");

  const res = await fetch(`${baseUrl}/chat/${chatId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load messages");
  }

  return res.json();
}