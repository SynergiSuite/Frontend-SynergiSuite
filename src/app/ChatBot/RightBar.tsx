"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquarePlus } from "lucide-react";

type SessionItem = {
  session_id: string;
  last_bot_message?: string;
};

type SidebarProps = {
  activeSessionId: string;
  onNewConversation: () => void;
  onSelectSession: (sessionId: string) => void;
  sessionItems: SessionItem[];
};

const Sidebar = ({
  activeSessionId,
  onNewConversation,
  onSelectSession,
  sessionItems,
}: SidebarProps) => {
  return (
    <aside className="w-[320px] h-full border-l border-gray-200 bg-gray-100 flex flex-col">

      {/* TOP BUTTON */}
      <div className="p-4 shrink-0">
        <button
          type="button"
          onClick={onNewConversation}
          className="w-full h-[52px] bg-black text-white rounded-xl flex items-center justify-center gap-2 font-medium hover:opacity-90 transition-all duration-300"
        >
          <MessageSquarePlus className="w-5 h-5" />
          New Conversation
        </button>
      </div>

      <div className="px-4 shrink-0">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Recent Chats
        </h2>
      </div>

      {/* SCROLL AREA */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
        <motion.div layout className="flex flex-col gap-4">
          {sessionItems.map((item) => (
            <motion.button
              layout
              key={item.session_id}
              type="button"
              onClick={() => onSelectSession(item.session_id)}
              initial={{ opacity: 0, x: 18, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className={`relative overflow-hidden rounded-2xl p-4 border bg-white transition-all duration-300 cursor-pointer ${
                activeSessionId === item.session_id
                  ? "border-black shadow-[0_16px_36px_rgba(15,23,42,0.12)]"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
              } w-full text-left`}
            >
              <AnimatePresence>
                {activeSessionId === item.session_id && (
                  <motion.span
                    layoutId="active-session-card"
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
                  <motion.h3
                    layout="position"
                    className="font-semibold text-black text-[15px] break-words whitespace-pre-wrap"
                  >
                    {item.last_bot_message || "New conversation"}
                  </motion.h3>
                </div>
              </div>
              <motion.div layout="position" className="mt-4">
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
              </motion.div>
            </motion.button>
          ))}
        </motion.div>

      </div>

    </aside>
  );
};

export default Sidebar;
