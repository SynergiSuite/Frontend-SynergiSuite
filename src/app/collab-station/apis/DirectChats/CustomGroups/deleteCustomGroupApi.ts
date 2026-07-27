import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function deleteCustomGroupApi(groupId: string) {
  const token = await CookieManager("get", "access-token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(`${requestBaseUrl}/collab-station/groups/${groupId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = Array.isArray(errorData?.message)
      ? errorData.message.join(", ")
      : errorData?.message || `Failed to delete group (HTTP ${response.status})`;
    throw new Error(errorMessage);
  }

  return response.json().catch(() => ({ success: true }));
}
