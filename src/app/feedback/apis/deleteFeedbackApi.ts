import { CookieManager } from "@/lib/cookieManager";

export async function deleteFeedbackApi(
  feedbackId: string | number
): Promise<{ message: string }> {
  const accessToken = await CookieManager("get", "access-token");
  const response = await fetch(`/api/feedback/${feedbackId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken ?? ""}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to delete feedback ticket");
  }

  return response.json();
}
