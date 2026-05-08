"use client";

import React from "react";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

import { MessageType } from "./ChatArea";

interface Props {
  message: MessageType;
}

const ChatMessage = ({ message }: Props) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full flex ${
          message.sender === "user"
            ? "justify-end"
            : "justify-start"
        }`}
      >
        <div
          className={`max-w-[70%] flex gap-3 ${
            message.sender === "user"
              ? "flex-row-reverse"
              : "flex-row"
          }`}
        >
          {message.sender === "bot" && (
            <div
              className="
                w-10
                h-10
                rounded-full
                bg-black
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}

          <div>
            <div
              className={`px-5 py-4 rounded-2xl shadow-sm ${
                message.sender === "user"
                  ? "bg-white text-black border border-gray-200"
                  : "bg-black text-white"
              }`}
            >
              <p className="text-sm leading-6">
                {message.text}
              </p>
            </div>

            <p
              className={`text-xs text-gray-400 mt-2 ${
                message.sender === "user"
                  ? "text-right"
                  : "text-left"
              }`}
            >
              {message.time}
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ChatMessage;