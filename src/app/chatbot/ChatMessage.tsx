"use client";

import React from "react";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { MessageType } from "./ChatArea";

interface Props {
  message: MessageType;
}

const ChatMessage = ({ message }: Props) => {
  const isUserMessage = message.sender === "user";

  return (
    <>
      <motion.div
        layout
        initial={{
          opacity: 0,
          x: isUserMessage ? 32 : -32,
          y: 18,
          scale: 0.96,
        }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 26,
          mass: 0.8,
        }}
        className={`w-full flex ${
          isUserMessage
            ? "justify-end"
            : "justify-start"
        }`}
      >
        <div
          className={`max-w-[70%] flex gap-3 ${
            isUserMessage
              ? "flex-row-reverse"
              : "flex-row"
          }`}
        >
          {!isUserMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.05, type: "spring", stiffness: 340, damping: 24 }}
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
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
          )}

          <div>
            <motion.div
              initial={{
                opacity: 0,
                scale: isUserMessage ? 0.94 : 0.98,
                y: 12,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 24,
                delay: isUserMessage ? 0.04 : 0,
              }}
              className={`p-5 rounded-2xl shadow-sm ${
                isUserMessage
                  ? "bg-white text-black border border-gray-200 shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                  : "bg-black text-white shadow-[0_14px_34px_rgba(15,23,42,0.24)]"
              }`}
            >
              {message.isTyping ? (
                <div className="flex items-center gap-1 py-1">
                  <motion.span
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                    className="h-2 w-2 rounded-full bg-white"
                  />
                  <motion.span
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                    className="h-2 w-2 rounded-full bg-white"
                  />
                  <motion.span
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="h-2 w-2 rounded-full bg-white"
                  />
                </div>
              ) : (
                <p className="text-sm leading-6">
                  {message.text}
                </p>
              )}
            </motion.div>

            {!message.isTyping && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.22 }}
                className={`text-xs text-gray-400 mt-2 ${
                  isUserMessage
                    ? "text-right"
                    : "text-left"
                }`}
              >
                {message.time}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ChatMessage;
