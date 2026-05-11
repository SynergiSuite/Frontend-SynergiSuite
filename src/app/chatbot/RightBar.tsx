"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageSquarePlus, Sparkles, Trash2 } from "lucide-react";

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
  return (
    <aside
      className={`fixed inset-y-0 right-0 z-30 flex h-full w-[calc(100vw-1rem)] max-w-[360px] flex-col rounded-l-3xl border-l border-gray-200 bg-gray-100 shadow-2xl transition-transform duration-300 lg:static lg:w-[320px] lg:max-w-none lg:rounded-none lg:shadow-none ${
        isMobileOpen ? "translate-x-0" : "translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="border-b border-gray-200 px-4 py-4 lg:hidden">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Recent Chats
        </h2>
      </div>

      <div className="shrink-0 px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Model
              </p>
              <p className="text-sm font-medium text-black">
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
              className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 pr-11 text-sm font-medium text-black outline-none transition focus:border-black"
            >
              <option value="llama">Llama 7b</option>
              <option value="gpt">GPT 20b</option>
              <option value="gemma">Gemma</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      {/* TOP BUTTON */}
      <div className="shrink-0 p-3 sm:p-4">
        <button
          type="button"
          onClick={onNewConversation}
          className="w-full h-[52px] bg-black text-white rounded-xl flex items-center justify-center gap-2 font-medium hover:opacity-90 transition-all duration-300"
        >
          <MessageSquarePlus className="w-5 h-5" />
          New Conversation
        </button>
      </div>

      <div className="hidden shrink-0 px-3 sm:px-4 lg:block">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              className={`relative overflow-hidden rounded-2xl p-4 border bg-white transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/10 ${
                activeSessionId === item.session_id
                  ? "border-black shadow-[0_16px_36px_rgba(15,23,42,0.12)]"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
              } w-full text-left`}
            >
              <AnimatePresence>
                {activeSessionId === item.session_id && (
                  <motion.span
                    className="absolute inset-0 rounded-2xl border-2 border-black pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                )}
              </AnimatePresence>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="truncate whitespace-nowrap overflow-hidden text-ellipsis font-semibold text-black text-[15px]">
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
                  className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4">
                <motion.span
                  key={activeSessionId === item.session_id ? "open" : "previous"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`text-xs ${
                    activeSessionId === item.session_id
                      ? "text-black font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {activeSessionId === item.session_id ? "Open" : "Previous session"}
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

    </aside>
  );
};

export default Sidebar;
