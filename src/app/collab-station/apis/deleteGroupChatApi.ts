import { CookieManager } from "@/lib/cookieManager";

export async function deleteGroupChatApi(groupId: string): Promise<{ success: boolean; message?: string }> {
  const token = await CookieManager("get", "access-token");

  const res = await fetch(`/api/collab-station/groups/${encodeURIComponent(groupId)}/chat`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.message || "Failed to delete chat history";
    throw new Error(msg);
  }

  return res.json().catch(() => ({ success: true }));
}

