import { CookieManager } from "@/lib/cookieManager";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function sendMessageApi(chatId: string, text: string, attachment?: any) {
  const token = await CookieManager("get", "access-token");

  const res = await fetch(`${baseUrl}/chat/${chatId}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      text,
      attachment,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json();
}