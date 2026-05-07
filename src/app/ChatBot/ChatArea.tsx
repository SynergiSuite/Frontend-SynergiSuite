"use client";

import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";

export interface MessageType {
  id: number;
  sender: "user" | "bot";
  text: string;
  time: string;
}

const ChatArea = () => {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hello! How can I assist you today?",
      time: "9:30 AM",
    },
    {
      id: 2,
      sender: "user",
      text: "I need help planning a new project timeline.",
      time: "9:31 AM",
    },
    {
      id: 3,
      sender: "bot",
      text: "I would be happy to help you with project planning.",
      time: "9:32 AM",
    },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: MessageType = {
      id: Date.now(),
      sender: "user",
      text: input,
      time: "Now",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    setTimeout(() => {
      const botReply: MessageType = {
        id: Date.now() + 1,
        sender: "bot",
        text: "This is a sample AI response.",
        time: "Now",
      };

      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  return (
    <main className="flex flex-col flex-1 h-full bg-[#f5f5f5]">

      {/* MESSAGES AREA (FIXED SCROLL) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-8 space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      {/* INPUT AREA (FIXED - NO OVERLAP) */}
      <div className="shrink-0 border-t bg-white">
        <MessageInput
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </div>

    </main>
  );
};

export default ChatArea;