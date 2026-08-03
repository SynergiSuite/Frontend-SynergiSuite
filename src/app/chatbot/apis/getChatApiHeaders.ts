import { CookieManager } from "@/lib/cookieManager";

const chatApiAuthKey = process.env.NEXT_PUBLIC_SECRET_KEY;

export async function getChatApiHeaders(): Promise<Record<string, string>> {
  const accessToken = await CookieManager("get", "access-token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "1",
  };

  if (chatApiAuthKey) {
    headers["auth_key"] = chatApiAuthKey;
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return headers;
}
