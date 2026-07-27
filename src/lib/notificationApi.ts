import { CookieManager } from "@/lib/cookieManager";

export type NotificationType =
  | "group_member_added"
  | "message_received"
  | "missed_call"
  | "task_assigned"
  | "task_updated";

export type AppNotification = {
  id: string;
  recipientId: number;
  actorId: number | null;
  type: NotificationType;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
};

export type NotificationPage = {
  items: AppNotification[];
  unreadCount: number;
  nextCursor: string | null;
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const token = CookieManager("get", "access-token");
  if (!baseUrl || typeof token !== "string") {
    throw new Error("Notification service is unavailable");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Notification request failed");
  }
  return payload as T;
};

export const getNotifications = (
  limit: number = 20,
  cursor?: string,
): Promise<NotificationPage> => {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  return request<NotificationPage>(`/notifications?${params.toString()}`);
};

export const markNotificationRead = (id: string): Promise<AppNotification> =>
  request<AppNotification>(`/notifications/${id}/read`, {
    method: "PATCH",
  });

export const markAllNotificationsRead = (): Promise<{ updated: number }> =>
  request<{ updated: number }>("/notifications/read-all", {
    method: "PATCH",
  });

export const deleteNotification = (id: string): Promise<{ id: string }> =>
  request<{ id: string }>(`/notifications/${id}`, {
    method: "DELETE",
  });
