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

    const href = notification.data?.href;
    if (typeof href === "string" && href.startsWith("/")) {
      router.push(href);
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
        className="w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0a2f]/95 p-0 text-white shadow-[0_20px_50px_rgba(82,113,255,0.25)] backdrop-blur-2xl"
      >
        <div className="flex h-13 items-center justify-between px-4 py-3 bg-white/[0.02]">
          <DropdownMenuLabel className="p-0 text-xs font-bold uppercase tracking-wider text-white/80">
            Notifications
          </DropdownMenuLabel>
          <button
            type="button"
            title="Mark all as read"
            aria-label="Mark all notifications as read"
            disabled={unreadCount === 0}
            onClick={() => void markAllRead()}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/50 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
          >
            <CheckCheck className="h-3.5 w-3.5" />
          </button>
        </div>
        <DropdownMenuSeparator className="m-0 bg-white/[0.08]" />
        <div className="max-h-[min(65vh,440px)] overflow-y-auto p-1.5 custom-scrollbar">
          {isLoading ? (
            <div className="flex h-28 items-center justify-center text-white/40">
              <Loader2 className="h-5 w-5 animate-spin text-[#5271ff]" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex h-28 flex-col items-center justify-center gap-2 text-white/40">
              <Bell className="h-5 w-5 text-white/20" />
              <p className="text-xs">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onSelect={() => openNotification(notification)}
                className="group relative items-start gap-3 rounded-xl px-3 py-3 pr-10 text-white transition hover:bg-white/[0.04] focus:bg-white/[0.04] focus:text-white cursor-pointer border border-transparent hover:border-white/[0.04]"
              >
                <span
                  className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                    notification.isRead
                      ? "border-white/10 bg-white/[0.03] text-white/40"
                      : "border-[#5271ff]/30 bg-[#5271ff]/15 text-[#5271ff]"
                  }`}
                >
                  <NotificationIcon type={notification.type} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start gap-2">
                    <span className="min-w-0 flex-1 truncate text-xs font-semibold text-white">
                      {notification.title}
                    </span>
                    {!notification.isRead && (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5271ff] shadow-[0_0_6px_#5271ff]" />
                    )}
                  </span>
                  {notification.body && (
                    <span className="mt-0.5 block line-clamp-2 text-[11px] leading-relaxed text-white/60">
                      {notification.body}
                    </span>
                  )}
                  <span className="mt-1 block text-[9px] font-medium text-white/40">
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
                  className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-lg text-white/30 opacity-0 transition hover:bg-rose-500/20 hover:text-rose-400 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
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
              className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-white/10 text-xs font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50 cursor-pointer"
            >
              {isLoadingMore && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#5271ff]" />
              )}
              Load earlier
            </button>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
