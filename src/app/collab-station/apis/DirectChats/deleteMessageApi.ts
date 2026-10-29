import { CookieManager } from "@/lib/cookieManager";

export async function deleteMessageApi(messageId: string) {
  const token = await CookieManager("get", "access-token");

  const res = await fetch(`/api/chat/messages/${encodeURIComponent(messageId)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.message || "Failed to delete message";
    throw new Error(msg);
  }

  return res.json().catch(() => ({ success: true }));
}
