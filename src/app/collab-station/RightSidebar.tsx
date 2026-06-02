"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus, Hash, Sparkles, Users, FolderKanban, Layers } from "lucide-react";
import { gsap } from "gsap";
import { ChatChannel } from "./types";

interface RightSidebarProps {
  activeId: string;
  groups: ChatChannel[];
  recentChats: ChatChannel[];
  onSelectChannel: (id: string) => void;
  onOpenNewChat: () => void;
}

export default function RightSidebar({
  activeId,
  groups,
  recentChats,
  onSelectChannel,
  onOpenNewChat,
}: RightSidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const teamGroups = groups.filter((g) => g.groupType === "team");
  const projectGroups = groups.filter((g) => g.groupType === "project");
  const customGroups = groups.filter((g) => g.groupType === "custom");

  // GSAP stagger mount animation for sidebar sections and items
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(".new-chat-btn-container", {
        opacity: 0,
        y: -15,
        duration: 0.5,
        ease: "power3.out",
      })
      .from(".sidebar-section-heading", {
        opacity: 0,
        duration: 0.3,
        stagger: 0.1,
      }, "-=0.2");

      const items = containerRef.current?.querySelectorAll(".sidebar-chat-item");
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.04,
            ease: "power2.out",
            clearProps: "all",
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <aside
      ref={containerRef}
      className="flex h-full w-full flex-col border-l border-white/[0.08] bg-[#0c0a2d]/40 backdrop-blur-md"
    >
      {/* New Chat Button Area */}
      <div className="new-chat-btn-container shrink-0 p-4 border-b border-white/[0.05]">
        <button
          type="button"
          onClick={onOpenNewChat}
          className="w-full h-12 bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-95 shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:shadow-[0_0_22px_rgba(82,113,255,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 text-sm tracking-wide cursor-pointer"
        >
          <MessageSquarePlus size={16} />
          Initialize Sync
        </button>
      </div>

      {/* Lists Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        
        {/* Teams Groups List */}
        {teamGroups.length > 0 && (
          <div className="space-y-3">
            <div className="sidebar-section-heading flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                <Users size={10} className="text-[#5271ff]" />
                Teams Groups
              </h3>
              <span className="text-[10px] text-white/35 font-mono">({teamGroups.length})</span>
            </div>

            <div className="flex flex-col gap-2">
              {teamGroups.map((group) => (
                <motion.div
                  key={group.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectChannel(group.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectChannel(group.id);
                    }
                  }}
                  whileHover={{ y: -1, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`sidebar-chat-item relative overflow-hidden rounded-xl p-3 border transition-all duration-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#5271ff]/35 ${
                    activeId === group.id
                      ? "border-[#5271ff] bg-[#0a0826]/70 text-white shadow-[0_4px_20px_rgba(82,113,255,0.12)]"
                      : "border-white/[0.04] bg-[#0a0826]/20 hover:bg-[#0a0826]/40 hover:border-white/[0.08] text-white/70 hover:text-white"
                  }`}
                >
                  {activeId === group.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5271ff] to-[#3a4ec4]" />
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5271ff]/10 border border-[#5271ff]/20 text-[#5271ff] shrink-0">
                      <Hash size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="truncate font-semibold text-xs text-white">
                          {group.name}
                        </h4>
                        <span className="text-[9px] text-white/30 font-medium shrink-0 ml-2">
                          {group.time}
                        </span>
                      </div>
                      <p className="truncate text-[11px] text-white/40 mt-0.5">
                        {group.lastMessage}
                      </p>
                    </div>
                  </div>

                  {group.unreadCount > 0 && (
                    <span className="absolute bottom-3 right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#5271ff] px-1 text-[9px] font-bold text-white shadow-[0_0_8px_#5271ff]">
                      {group.unreadCount}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Groups List */}
        {projectGroups.length > 0 && (
          <div className="space-y-3">
            <div className="sidebar-section-heading flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                <FolderKanban size={10} className="text-[#5271ff]" />
                Projects Groups
              </h3>
              <span className="text-[10px] text-white/35 font-mono">({projectGroups.length})</span>
            </div>

            <div className="flex flex-col gap-2">
              {projectGroups.map((group) => (
                <motion.div
                  key={group.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectChannel(group.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectChannel(group.id);
                    }
                  }}
                  whileHover={{ y: -1, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`sidebar-chat-item relative overflow-hidden rounded-xl p-3 border transition-all duration-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#5271ff]/35 ${
                    activeId === group.id
                      ? "border-[#5271ff] bg-[#0a0826]/70 text-white shadow-[0_4px_20px_rgba(82,113,255,0.12)]"
                      : "border-white/[0.04] bg-[#0a0826]/20 hover:bg-[#0a0826]/40 hover:border-white/[0.08] text-white/70 hover:text-white"
                  }`}
                >
                  {activeId === group.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5271ff] to-[#3a4ec4]" />
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5271ff]/10 border border-[#5271ff]/20 text-[#5271ff] shrink-0">
                      <Hash size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="truncate font-semibold text-xs text-white">
                          {group.name}
                        </h4>
                        <span className="text-[9px] text-white/30 font-medium shrink-0 ml-2">
                          {group.time}
                        </span>
                      </div>
                      <p className="truncate text-[11px] text-white/40 mt-0.5">
                        {group.lastMessage}
                      </p>
                    </div>
                  </div>

                  {group.unreadCount > 0 && (
                    <span className="absolute bottom-3 right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#5271ff] px-1 text-[9px] font-bold text-white shadow-[0_0_8px_#5271ff]">
                      {group.unreadCount}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Groups List */}
        {customGroups.length > 0 && (
          <div className="space-y-3">
            <div className="sidebar-section-heading flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                <Layers size={10} className="text-[#5271ff]" />
                Custom Groups
              </h3>
              <span className="text-[10px] text-white/35 font-mono">({customGroups.length})</span>
            </div>

            <div className="flex flex-col gap-2">
              {customGroups.map((group) => (
                <motion.div
                  key={group.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectChannel(group.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectChannel(group.id);
                    }
                  }}
                  whileHover={{ y: -1, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`sidebar-chat-item relative overflow-hidden rounded-xl p-3 border transition-all duration-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#5271ff]/35 ${
                    activeId === group.id
                      ? "border-[#5271ff] bg-[#0a0826]/70 text-white shadow-[0_4px_20px_rgba(82,113,255,0.12)]"
                      : "border-white/[0.04] bg-[#0a0826]/20 hover:bg-[#0a0826]/40 hover:border-white/[0.08] text-white/70 hover:text-white"
                  }`}
                >
                  {activeId === group.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5271ff] to-[#3a4ec4]" />
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5271ff]/10 border border-[#5271ff]/20 text-[#5271ff] shrink-0">
                      <Hash size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="truncate font-semibold text-xs text-white">
                          {group.name}
                        </h4>
                        <span className="text-[9px] text-white/30 font-medium shrink-0 ml-2">
                          {group.time}
                        </span>
                      </div>
                      <p className="truncate text-[11px] text-white/40 mt-0.5">
                        {group.lastMessage}
                      </p>
                    </div>
                  </div>

                  {group.unreadCount > 0 && (
                    <span className="absolute bottom-3 right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#5271ff] px-1 text-[9px] font-bold text-white shadow-[0_0_8px_#5271ff]">
                      {group.unreadCount}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Chats Section */}
        <div className="space-y-3">
          <div className="sidebar-section-heading flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
              <Sparkles size={10} className="text-[#5271ff]" />
              Recent Chats
            </h3>
            <span className="text-[10px] text-white/35 font-mono">({recentChats.length})</span>
          </div>

          <div className="flex flex-col gap-2">
            {recentChats.map((chat) => (
              <motion.div
                key={chat.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectChannel(chat.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectChannel(chat.id);
                  }
                }}
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`sidebar-chat-item relative overflow-hidden rounded-xl p-3 border transition-all duration-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#5271ff]/35 ${
                  activeId === chat.id
                    ? "border-[#5271ff] bg-[#0a0826]/70 text-white shadow-[0_4px_20px_rgba(82,113,255,0.12)]"
                    : "border-white/[0.04] bg-[#0a0826]/20 hover:bg-[#0a0826]/40 hover:border-white/[0.08] text-white/70 hover:text-white"
                }`}
              >
                {activeId === chat.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5271ff] to-[#3a4ec4]" />
                )}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#5271ff]/20 to-[#3a4ec4]/10 border border-white/10 text-xs font-bold text-white shrink-0 relative">
                    {chat.avatar || chat.name.slice(0, 2).toUpperCase()}
                    {chat.status && (
                      <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#0c0a2f] ${
                        chat.status === "online" ? "bg-emerald-500 shadow-[0_0_6px_#10b981]" : "bg-zinc-500"
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="truncate font-semibold text-xs text-white">
                        {chat.name}
                      </h4>
                      <span className="text-[9px] text-white/30 font-medium shrink-0 ml-2">
                        {chat.time}
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-white/40 mt-0.5">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>

                {chat.unreadCount > 0 && (
                  <span className="absolute bottom-3 right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#5271ff] px-1 text-[9px] font-bold text-white shadow-[0_0_8px_#5271ff]">
                    {chat.unreadCount}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
