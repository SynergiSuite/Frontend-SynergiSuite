"use client";

import React from "react";
import {
  MessageSquarePlus,
  MoreVertical,
  Trash2,
} from "lucide-react";

const chats = [
  {
    id: 1,
    title: "Project Planning Discussion",
    message: "Can you help me create a timeline?",
    time: "10 min ago",
  },
  {
    id: 2,
    title: "Code Review Assistance",
    message: "Thanks for the explanation!",
    time: "2 hours ago",
  },
  {
    id: 3,
    title: "Design System Questions",
    message: "What are the color guidelines?",
    time: "Yesterday",
  },
  {
    id: 4,
    title: "API Integration Help",
    message: "The endpoint is working now",
    time: "2 days ago",
  },
];

const Sidebar = () => {
  return (
    <aside className="w-[320px] h-full border-l border-gray-200 bg-[#f8f8f8] flex flex-col">

      {/* TOP BUTTON */}
      <div className="p-4 shrink-0">
        <button className="w-full h-[52px] bg-black text-white rounded-xl flex items-center justify-center gap-2 font-medium hover:opacity-90 transition-all duration-300">
          <MessageSquarePlus className="w-5 h-5" />
          New Conversation
        </button>
      </div>

      {/* SCROLL AREA */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
        
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Recent Chats
        </h2>

        <div className="flex flex-col gap-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3">
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-black text-[15px] truncate">
                    {chat.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 break-words whitespace-pre-wrap">
                    {chat.message}
                  </p>
                </div>

                <button className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-1 rounded-lg hover:bg-gray-100 shrink-0">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>

              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-400">{chat.time}</span>

                <button className="flex items-center gap-1 text-red-500 text-xs hover:text-red-600 transition-all duration-300">
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

    </aside>
  );
};

export default Sidebar;