"use client";

import React, { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";
import { ChatApiResponse, chatWithUser } from "./apis/chatWithUser";
import { getSessionHistory, SessionHistoryResponse } from "./apis/getSessionHistory";

export interface MessageType {
  id: number;
  sender: "user" | "bot";
  text: string;
  time: string;
  isTyping?: boolean;
}

type ChatAreaProps = {
  sessionId: string;
};

const ChatArea = ({ sessionId }: ChatAreaProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);

  const formatTime = (value?: string) =>
    new Date(value ?? Date.now()).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

  const mapApiHistoryToMessages = (history: NonNullable<ChatApiResponse["history"]>) =>
    history.map((item, index) => ({
      id: Date.now() + index,
      sender: item.role === "assistant" ? "bot" : "user",
      text: item.content,
      time: formatTime(),
    })) as MessageType[];

  const mapSessionHistoryToMessages = (
    history: SessionHistoryResponse["history"],
  ) =>
    history.map((item, index) => ({
      id: Date.now() + index,
      sender: item.role === "assistant" ? "bot" : "user",
      text: item.content,
      time: formatTime(item.ts),
    })) as MessageType[];

  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    const fetchSessionHistory = async () => {
      try {
        const response = await getSessionHistory();
        setMessages(mapSessionHistoryToMessages(response.history));
      } catch (error) {
        console.error("Session history API error:", error);
        setMessages([]);
      }
    };

    fetchSessionHistory();
  }, [sessionId]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput) return;

    const typingMessageId = Date.now() + 1;

    const newMessage: MessageType = {
      id: Date.now(),
      sender: "user",
      text: trimmedInput,
      time: formatTime(),
    };

    setMessages((prev) => [
      ...prev,
      newMessage,
      {
        id: typingMessageId,
        sender: "bot",
        text: "",
        time: "",
        isTyping: true,
      },
    ]);
    setInput("");

    try {
      const response = await chatWithUser(trimmedInput, sessionId);
      console.log("Chat API response:", response);

      if (response.history?.length) {
        setMessages(mapApiHistoryToMessages(response.history));
        return;
      }

      const replyText = response.response?.trim();
      if (replyText) {
        setMessages((prev) => [
          ...prev.filter((message) => message.id !== typingMessageId),
          {
            id: Date.now() + 2,
            sender: "bot",
            text: replyText,
            time: formatTime(),
          },
        ]);
      }
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages((prev) => prev.filter((message) => message.id !== typingMessageId));
    }
  };

  return (
    <main className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">

      {/* MESSAGES AREA (FIXED SCROLL) */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-6 space-y-6">
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
