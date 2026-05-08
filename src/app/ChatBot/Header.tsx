"use client";

import React from "react";
import { Bot } from "lucide-react";

const Header = () => {
  return (
    <>
      <header className="w-full h-[70px] border-b border-gray-200 bg-white flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
            <Bot className="text-white w-5 h-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-black">ChatBot</h1>
            <p className="text-sm text-gray-500">
              AI Conversation Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-black">
              Welcome Back
            </span>

            <span className="text-xs text-gray-500">
              Start a new conversation
            </span>
          </div>

          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-gray-200">
            <img
              src="https://i.pravatar.cc/150?img=32"
              alt="user"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;