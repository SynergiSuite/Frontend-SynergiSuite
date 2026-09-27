"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  CheckCheck,
  ListTodo,
  Loader2,
  MessageSquare,
  PhoneMissed,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CookieManager } from "@/lib/cookieManager";
import {
  AppNotification,
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notificationApi";
import { socket } from "@/lib/socket";
import { playNotificationSound } from "@/lib/soundUtils";

const NotificationIcon = ({ type }: { type: AppNotification["type"] }) => {
  const className = "h-4 w-4";
  if (type === "group_member_added") return <UserPlus className={className} />;
  if (type === "message_received")
    return <MessageSquare className={className} />;
  if (type === "missed_call") return <PhoneMissed className={className} />;
  return <ListTodo className={className} />;
};

function getNotificationRedirectUrl(notification: AppNotification): string | null {
  const data = notification.data || {};

  // 1. Direct explicit link parameters
  if (typeof data.href === "string" && data.href.startsWith("/")) {
    return data.href;
  }
  if (typeof data.url === "string" && data.url.startsWith("/")) {
    return data.url;
  }
  if (typeof data.path === "string" && data.path.startsWith("/")) {
    return data.path;
  }

  // 2. Chat / Collab Station notifications
  const channelId =
    data.channelId ||
    data.chatId ||
    data.groupId ||
    data.directChatId ||
    data.channel_id;

  if (
    notification.type === "message_received" ||
    notification.type === "group_member_added" ||
    notification.type === "missed_call" ||
    channelId
  ) {
    if (channelId) {
      return `/collab-station?chatId=${encodeURIComponent(String(channelId))}`;
    }
    return "/collab-station";
  }

  // 3. Task / Project notifications
  const projectName = (data.projectName || data.project_name || data.project) as
    | string
    | undefined;
  const taskId = data.taskId || data.task_id;

  if (
    notification.type === "task_assigned" ||
    notification.type === "task_updated" ||
    taskId ||
    projectName
  ) {
    if (projectName) {
      return `/projects/${encodeURIComponent(String(projectName))}/task`;
    }
    return "/projects";
  }

  // 4. Feedback notifications
  if (String(notification.type).toLowerCase().includes("feedback")) {
    return "/feedback";
  }

  // 5. Fallback heuristics based on title / body keywords
  const fullText = `${notification.title} ${notification.body || ""}`.toLowerCase();
  if (
    fullText.includes("chat") ||
    fullText.includes("message") ||
    fullText.includes("call")
  ) {
    return "/collab-station";
  }
  if (fullText.includes("task") || fullText.includes("project")) {
    return "/projects";
  }
  if (fullText.includes("employee")) {
    return "/employees";
  }
  if (fullText.includes("team")) {
    return "/teams";
  }

  return null;
}

export default function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const seenIdsRef = useRef(new Set<string>());

  const loadNotifications = useCallback(async (cursor?: string) => {
    if (cursor) setIsLoadingMore(true);
    try {
      const page = await getNotifications(20, cursor);
      setNotifications((current) => {
        const items = cursor
          ? [
              ...current,
              ...page.items.filter(
                (item) => !current.some((existing) => existing.id === item.id),
              ),
            ]
          : page.items;
        seenIdsRef.current = new Set(items.map((item) => item.id));
        return items;
      });
      setUnreadCount(page.unreadCount);
      setNextCursor(page.nextCursor);
    } catch {
      if (!cursor) {
        setNotifications([]);
        setUnreadCount(0);
        setNextCursor(null);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
    const interval = setInterval(() => {
      void loadNotifications();
    }, 15000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  useEffect(() => {
    let isSubscribed = true;

    const setupSocket = async () => {
      const rawToken = await CookieManager("get", "access-token");
      const token = typeof rawToken === "string" ? rawToken : String(rawToken || "");
      if (!token || !isSubscribed) return;

      socket.auth = { token };
      if (!socket.connected) socket.connect();

      const handleNotification = (notification: AppNotification) => {
        if (!isSubscribed) return;
        if (seenIdsRef.current.has(notification.id)) return;
        seenIdsRef.current.add(notification.id);
        setNotifications((current) => [notification, ...current]);
        if (!notification.isRead) {
          setUnreadCount((count) => count + 1);
        }
        playNotificationSound();
        toast(notification.title, {
          description: notification.body || undefined,
          action: {
            label: "View",
            onClick: () => openNotification(notification),
          },
        });
      };

      socket.on("notification:new", handleNotification);
    };

    void setupSocket();

    return () => {
      isSubscribed = false;
      socket.off("notification:new");
    };
  }, []);

  const markReadLocally = (selected: AppNotification) => {
    if (selected.isRead) return;
    setNotifications((current) =>
      current.map((notification) => {
        if (notification.id !== selected.id || notification.isRead) {
          return notification;
        }
        return {
          ...notification,
          isRead: true,
          readAt: new Date().toISOString(),
        };
      }),
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  };

  const openNotification = (notification: AppNotification) => {
    markReadLocally(notification);
    void markNotificationRead(notification.id).catch(() => {
      void loadNotifications();
    });

    const targetUrl = getNotificationRedirectUrl(notification);
    if (targetUrl) {
      router.push(targetUrl);
    }
  };

  const markAllRead = async () => {
    const hadUnread = unreadCount > 0;
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        isRead: true,
        readAt: notification.readAt || new Date().toISOString(),
      })),
    );
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    } catch {
      if (hadUnread) toast.error("Unable to mark notifications as read");
      void loadNotifications();
    }
  };

  const removeNotification = async (
    event: React.MouseEvent,
    notification: AppNotification,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setNotifications((current) =>
      current.filter((item) => item.id !== notification.id),
    );
    seenIdsRef.current.delete(notification.id);
    if (!notification.isRead) {
      setUnreadCount((count) => Math.max(0, count - 1));
    }
    try {
      await deleteNotification(notification.id);
    } catch {
      toast.error("Unable to delete notification");
      void loadNotifications();
    }
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && void loadNotifications()}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open notifications"
          className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#0c0a2f]/60 text-white/80 transition hover:border-[#5271ff]/50 hover:bg-[#5271ff]/15 hover:text-white cursor-pointer backdrop-blur-md shadow-sm"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-1 text-[9px] font-extrabold leading-none text-white shadow-[0_0_8px_#5271ff]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[min(92vw,380px)] overflow-hidden p-0"
      >
        <div className="flex h-13 items-center justify-between bg-v2-neutral-200/45 px-4 py-3">
          <DropdownMenuLabel className="p-0 text-v2-neutral-600">
            Notifications
          </DropdownMenuLabel>
          <button
            type="button"
            title="Mark all as read"
            aria-label="Mark all notifications as read"
            disabled={unreadCount === 0}
            onClick={() => void markAllRead()}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-v2-neutral-300 text-v2-neutral-400 transition hover:border-v2-neutral-400 hover:bg-v2-neutral-200 hover:text-v2-neutral-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <CheckCheck className="h-3.5 w-3.5" />
          </button>
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-[min(65vh,440px)] overflow-y-auto p-1.5 custom-scrollbar">
          {isLoading ? (
            <div className="flex h-28 items-center justify-center text-v2-neutral-400">
              <Loader2 className="h-5 w-5 animate-spin text-v2-neutral-600" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex h-28 flex-col items-center justify-center gap-2 text-v2-neutral-400">
              <Bell className="h-5 w-5 text-v2-neutral-300" />
              <p className="text-xs">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onSelect={() => openNotification(notification)}
                className="group relative items-start gap-3 border border-transparent px-3 py-3 pr-10 hover:border-v2-neutral-200"
              >
                <span
                  className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                    notification.isRead
                      ? "border-v2-neutral-200 bg-v2-neutral-200/40 text-v2-neutral-400"
                      : "border-v2-neutral-400 bg-v2-neutral-200 text-v2-neutral-600"
                  }`}
                >
                  <NotificationIcon type={notification.type} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start gap-2">
                    <span className="min-w-0 flex-1 truncate text-xs font-semibold text-v2-neutral-600">
                      {notification.title}
                    </span>
                    {!notification.isRead && (
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-v2-neutral-600" />
                    )}
                  </span>
                  {notification.body && (
                    <span className="mt-0.5 block line-clamp-2 text-[11px] leading-relaxed text-v2-neutral-400">
                      {notification.body}
                    </span>
                  )}
                  <span className="mt-1 block text-[10px] font-medium text-v2-neutral-400">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </span>
                <button
                  type="button"
                  title="Delete notification"
                  aria-label="Delete notification"
                  onClick={(event) =>
                    void removeNotification(event, notification)
                  }
                  className="absolute right-2 top-2 inline-flex size-7 cursor-pointer items-center justify-center rounded-lg text-v2-neutral-300 opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 focus:opacity-100"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </DropdownMenuItem>
            ))
          )}
          {nextCursor && !isLoading && (
            <button
              type="button"
              disabled={isLoadingMore}
              onClick={() => void loadNotifications(nextCursor)}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-v2-neutral-200 text-xs font-medium text-v2-neutral-500 transition hover:border-v2-neutral-300 hover:bg-v2-neutral-200/60 hover:text-v2-neutral-600 disabled:opacity-50"
            >
              {isLoadingMore && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-v2-neutral-600" />
              )}
              Load earlier
            </button>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
