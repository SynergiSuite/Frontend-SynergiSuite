"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  MessageSquarePlus,
  Hash,
  Users,
  FolderKanban,
  PhoneMissed,
  Search,
  MessageCircle,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import { ChatChannel } from "./types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RightSidebarProps {
  activeId: string;
  groups: ChatChannel[];
  recentChats: ChatChannel[];
  onSelectChannel: (id: string) => void;
  onOpenNewChat: () => void;
}

type FilterTab = "all" | "direct" | "team" | "project" | "custom";

export default function RightSidebar({
  activeId,
  groups,
  recentChats,
  onSelectChannel,
  onOpenNewChat,
}: RightSidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const teamGroups = useMemo(
    () => groups.filter((g) => g.groupType === "team"),
    [groups]
  );
  const projectGroups = useMemo(
    () => groups.filter((g) => g.groupType === "project"),
    [groups]
  );
  const customGroups = useMemo(
    () => groups.filter((g) => g.groupType === "custom"),
    [groups]
  );

  // Filtered list based on search and selected category tab
  const filteredChannels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matchesSearch = (item: ChatChannel) => {
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        (item.lastMessage && item.lastMessage.toLowerCase().includes(q))
      );
    };

    let list: ChatChannel[] = [];
    if (activeTab === "all") {
      list = [...recentChats, ...groups];
    } else if (activeTab === "direct") {
      list = recentChats;
    } else if (activeTab === "team") {
      list = teamGroups;
    } else if (activeTab === "project") {
      list = projectGroups;
    } else if (activeTab === "custom") {
      list = customGroups;
    }

    // De-duplicate if any overlap and filter
    const seen = new Set<string>();
    return list.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return matchesSearch(item);
    });
  }, [searchQuery, activeTab, recentChats, groups, teamGroups, projectGroups, customGroups]);

  // Total counts for badges
  const counts = useMemo(
    () => ({
      all: recentChats.length + groups.length,
      direct: recentChats.length,
      team: teamGroups.length,
      project: projectGroups.length,
      custom: customGroups.length,
    }),
    [recentChats, groups, teamGroups, projectGroups, customGroups]
  );

  // GSAP Entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".collab-sidebar-header", {
        opacity: 0,
        y: -10,
        duration: 0.35,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getChannelIcon = (channel: ChatChannel) => {
    if (channel.type === "direct") {
      const initials = (channel.name || "U")
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return (
        <div className="relative shrink-0">
          <Avatar className="size-9 border border-v2-neutral-400 bg-v2-neutral-500 text-xs font-bold text-v2-neutral-100">
            {channel.avatar && <AvatarImage src={channel.avatar} alt={channel.name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {channel.status && (
            <span
              className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-v2-neutral-600 ${
                channel.status === "online" ? "bg-emerald-500" : "bg-v2-neutral-400"
              }`}
              title={channel.status === "online" ? "Online" : "Offline"}
            />
          )}
        </div>
      );
    }

    if (channel.groupType === "team") {
      return (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-400 shadow-xs">
          <Users className="size-4" />
        </div>
      );
    }

    if (channel.groupType === "project") {
      return (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-400 shadow-xs">
          <FolderKanban className="size-4" />
        </div>
      );
    }

    return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-400 shadow-xs">
        <Hash className="size-4" />
      </div>
    );
  };

  const getChannelBadge = (channel: ChatChannel) => {
    if (channel.type === "direct") {
      return (
        <span className="rounded-md border border-v2-neutral-500 bg-v2-neutral-500/40 px-1.5 py-0.5 text-[9px] font-medium text-v2-neutral-400">
          Direct
        </span>
      );
    }
    if (channel.groupType === "team") {
      return (
        <span className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-medium text-indigo-400">
          Team
        </span>
      );
    }
    if (channel.groupType === "project") {
      return (
        <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-400">
          Project
        </span>
      );
    }
    return (
      <span className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-medium text-cyan-400">
        Custom
      </span>
    );
  };

  return (
    <aside
      ref={containerRef}
      className="flex h-full w-full flex-col bg-v2-neutral-600 border-r border-v2-neutral-500"
    >
      {/* Top Header & New Chat Action */}
      <div className="collab-sidebar-header shrink-0 p-4 border-b border-v2-neutral-500 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-[-0.02em] text-v2-neutral-100 flex items-center gap-2">
              <MessageCircle className="size-4.5 text-v2-neutral-300" />
              <span>Channels</span>
            </h2>
            <p className="text-[11px] text-v2-neutral-400 mt-0.5">
              Squads, projects & direct discussions
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={onOpenNewChat}
            className="gap-1.5 shadow-sm text-xs font-semibold h-8.5 px-3 cursor-pointer"
          >
            <MessageSquarePlus className="size-3.5" />
            <span>New Chat</span>
          </Button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-v2-neutral-400" />
          <input
            type="text"
            placeholder="Search channels & people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-xl border border-v2-neutral-400 bg-v2-neutral-500/40 pl-8.5 pr-8 text-xs text-v2-neutral-100 placeholder:text-v2-neutral-400 outline-none transition-[border-color,box-shadow] focus:border-v2-neutral-300 focus:ring-2 focus:ring-v2-neutral-400/25"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-v2-neutral-400 hover:text-v2-neutral-200 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 custom-scrollbar text-[11px]">
          {(
            [
              { key: "all", label: "All", count: counts.all },
              { key: "direct", label: "Direct", count: counts.direct },
              { key: "team", label: "Teams", count: counts.team },
              { key: "project", label: "Projects", count: counts.project },
              { key: "custom", label: "Custom", count: counts.custom },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-v2-neutral-500 text-v2-neutral-100 border border-v2-neutral-400"
                    : "text-v2-neutral-400 hover:bg-v2-neutral-500/30 hover:text-v2-neutral-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1 text-[9px] font-semibold ${
                    isActive
                      ? "bg-v2-neutral-100 text-v2-neutral-600"
                      : "bg-v2-neutral-500/60 text-v2-neutral-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Channel Feed List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
        {filteredChannels.length === 0 ? (
          <div className="py-12 text-center text-xs text-v2-neutral-400 px-4">
            <p className="font-semibold text-v2-neutral-300">No channels found</p>
            <p className="mt-1 text-[11px] text-v2-neutral-400 leading-relaxed">
              {searchQuery
                ? "Try a different search term or clear the filter."
                : "Create a new direct chat or group to get started."}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenNewChat}
              className="mt-4 text-xs gap-1.5"
            >
              <MessageSquarePlus className="size-3.5" />
              <span>Start New Thread</span>
            </Button>
          </div>
        ) : (
          filteredChannels.map((channel) => {
            const isActive = activeId === channel.id;
            const hasMissedCalls = channel.id !== activeId && Boolean(channel.missedCallCount);
            const hasUnread = channel.id !== activeId && channel.unreadCount > 0 && !hasMissedCalls;

            return (
              <div
                key={channel.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectChannel(channel.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectChannel(channel.id);
                  }
                }}
                className={`group relative flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 cursor-pointer border select-none outline-none ${
                  isActive
                    ? "border-v2-neutral-400 bg-v2-neutral-500 text-v2-neutral-100 shadow-sm"
                    : "border-transparent text-v2-neutral-300 hover:border-v2-neutral-500/70 hover:bg-v2-neutral-500/30 hover:text-v2-neutral-100"
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-v2-neutral-100" />
                )}

                {/* Avatar / Icon */}
                {getChannelIcon(channel)}

                {/* Channel Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h4 className="truncate text-xs font-semibold text-v2-neutral-100">
                        {channel.name}
                      </h4>
                      {getChannelBadge(channel)}
                    </div>
                    <span className="text-[10px] text-v2-neutral-400 font-medium shrink-0">
                      {channel.time}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="truncate text-[11px] text-v2-neutral-400 group-hover:text-v2-neutral-300">
                      {hasMissedCalls ? (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                          <PhoneMissed className="size-3" />
                          <span>{channel.lastMessage || "Missed call"}</span>
                        </span>
                      ) : (
                        channel.lastMessage || "No messages yet"
                      )}
                    </p>

                    {/* Unread & Missed Call Badges */}
                    {hasMissedCalls && (
                      <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                        {channel.missedCallCount}
                      </span>
                    )}

                    {hasUnread && (
                      <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-v2-neutral-100 text-[10px] font-bold text-v2-neutral-600 shadow-xs">
                        {channel.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
