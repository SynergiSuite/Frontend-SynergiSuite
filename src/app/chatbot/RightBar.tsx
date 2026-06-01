"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MessageSquarePlus, Sparkles, Trash2 } from "lucide-react";
import { gsap } from "gsap";

type SessionItem = {
  session_id: string;
  last_bot_message?: string;
};

type SidebarProps = {
  activeSessionId: string;
  isMobileOpen: boolean;
  model: "llama" | "gpt" | "gemma";
  onModelChange: (model: "llama" | "gpt" | "gemma") => void;
  onDeleteSession: (sessionId: string) => void;
  onNewConversation: () => void;
  onSelectSession: (sessionId: string) => void;
  sessionItems: SessionItem[];
};

const Sidebar = ({
  activeSessionId,
  isMobileOpen,
  model,
  onModelChange,
  onDeleteSession,
  onNewConversation,
  onSelectSession,
  sessionItems,
}: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(".select-widget", {
        opacity: 0,
        y: -15,
        duration: 0.45,
        ease: "power2.out"
      })
      .from(".action-btn-container", {
        opacity: 0,
        y: -10,
        duration: 0.35,
        ease: "power2.out"
      }, "-=0.2")
      .from(".heading-container", {
        opacity: 0,
        duration: 0.25
      }, "-=0.1");

      const items = sidebarRef.current?.querySelectorAll(".chat-history-item");
      if (items && items.length > 0) {
        gsap.fromTo(items, 
          { opacity: 0, y: 15 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.45, 
            stagger: 0.05, 
            ease: "power2.out", 
            delay: 0.1,
            clearProps: "all"
          }
        );
      }
    }, sidebarRef);

    return () => ctx.revert();
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className={`fixed inset-y-0 right-0 z-30 flex h-full w-[calc(100vw-1rem)] max-w-[360px] flex-col border-l border-white/[0.08] bg-[#0c0a2d]/40 backdrop-blur-md shadow-2xl transition-transform duration-300 lg:static lg:w-[320px] lg:max-w-none lg:shadow-none ${
        isMobileOpen ? "translate-x-0" : "translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="border-b border-white/[0.08] px-4 py-4 lg:hidden">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Recent Chats
        </h2>
      </div>

      <div className="shrink-0 px-3 pt-3 sm:px-4 sm:pt-4 select-widget">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 p-3 shadow-sm backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#5271ff]/10 border border-[#5271ff]/20 text-[#5271ff]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">
                Model
              </p>
              <p className="text-xs font-medium text-white/80">
                Select assistant engine
              </p>
            </div>
          </div>

          <div className="relative">
            <select
              value={model}
              onChange={(event) =>
                onModelChange(event.target.value as "llama" | "gpt" | "gemma")
              }
              className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#030114]/60 px-4 pr-11 text-xs font-semibold text-white/90 outline-none transition focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 cursor-pointer"
            >
              <option value="llama" className="bg-[#0c0a2d] text-white">Llama 7b</option>
              <option value="gpt" className="bg-[#0c0a2d] text-white">GPT 20b</option>
              <option value="gemma" className="bg-[#0c0a2d] text-white">Gemma</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
          </div>
        </div>
      </div>

      {/* TOP BUTTON */}
      <div className="shrink-0 p-3 sm:p-4 action-btn-container">
        <button
          type="button"
          onClick={onNewConversation}
          className="w-full h-[48px] bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-95 shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:shadow-[0_0_22px_rgba(82,113,255,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 text-sm tracking-wide"
        >
          <MessageSquarePlus className="w-4 h-4" />
          New Conversation
        </button>
      </div>

      <div className="hidden shrink-0 px-3 sm:px-4 lg:block heading-container">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-4">
          Recent Chats
        </h2>
      </div>

      {/* SCROLL AREA */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="flex flex-col gap-4">
          {sessionItems.map((item) => (
            <motion.div
              key={item.session_id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectSession(item.session_id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectSession(item.session_id);
                }
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              className={`chat-history-item relative overflow-hidden rounded-2xl p-4 border transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5271ff]/35 ${
                activeSessionId === item.session_id
                  ? "border-[#5271ff] bg-[#0a0826]/60 text-white shadow-[0_8px_32px_rgba(82,113,255,0.12)]"
                  : "border-white/[0.06] bg-[#0a0826]/20 hover:bg-[#0a0826]/40 hover:border-white/[0.12] text-white/70 hover:text-white hover:shadow-[0_10px_24px_rgba(82,113,255,0.04)]"
              } w-full text-left`}
            >
              {activeSessionId === item.session_id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5271ff] to-[#3a4ec4]" />
              )}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="truncate whitespace-nowrap overflow-hidden text-ellipsis font-semibold text-[14px]">
                    {item.last_bot_message || "New conversation"}
                  </h3>
                </div>
                <button
                  type="button"
                  aria-label="Delete session"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteSession(item.session_id);
                  }}
                  className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/30 transition hover:bg-rose-500/20 hover:text-rose-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`text-[10px] uppercase font-semibold tracking-wider ${
                    activeSessionId === item.session_id
                      ? "text-[#5271ff]"
                      : "text-white/35"
                  }`}
                >
                  {activeSessionId === item.session_id ? "Active" : "Previous"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
