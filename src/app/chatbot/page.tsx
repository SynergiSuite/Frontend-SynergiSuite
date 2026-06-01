"use client";

import React, { useEffect, useState } from "react";
import RightBar from "./RightBar";
import ChatArea from "./ChatArea";
import { CookieManager } from "@/lib/cookieManager";
import {
  getUserSessionIds,
  UserSessionIdsResponse,
} from "./apis/getUserSessionIds";
import { deleteSession } from "./apis/deleteSession";
import { ChevronLeft, ChevronRight } from "lucide-react";

const getUniqueSessionIds = (sessionIds: string[]) => [...new Set(sessionIds)];
const getSessionItems = (
  sessionIds: string[],
  items: UserSessionIdsResponse["items"],
) =>
  sessionIds.map((id) => {
    const matchedItem = items.find((item) => item.session_id === id);

    return {
      session_id: id,
      last_bot_message: matchedItem?.last_bot_message || "New conversation",
    };
  });

const Page = () => {
  const [sessionId, setSessionId] = useState("");
  const [sessionItems, setSessionItems] = useState<UserSessionIdsResponse["items"]>([]);
  const [chatResetKey, setChatResetKey] = useState(0);
  const [isMobileRightBarOpen, setIsMobileRightBarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"llama" | "gpt" | "gemma">("llama");

  useEffect(() => {
    const fetchSessionIds = async () => {
      try {
        const response = await getUserSessionIds();
        const fetchedSessionIds = getUniqueSessionIds(response.session_ids);
        const activeSessionId = fetchedSessionIds[0] ?? "";

        setSessionItems(getSessionItems(fetchedSessionIds, response.items || []));
        setSessionId(activeSessionId);

        if (activeSessionId) {
          CookieManager("set", "session-id", activeSessionId);
        } else {
          CookieManager("delete", "session-id");
        }
      } catch (error) {
        console.error("Session ids API error:", error);
        setSessionItems([]);
        setSessionId("");
        CookieManager("delete", "session-id");
      }
    };

    fetchSessionIds();
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("chatbot-rightbar-toggle", {
        detail: { isOpen: isMobileRightBarOpen },
      }),
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent("chatbot-rightbar-toggle", {
          detail: { isOpen: false },
        }),
      );
    };
  }, [isMobileRightBarOpen]);

  const handleNewConversation = () => {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    setSessionItems((prev) => [
      {
        session_id: newSessionId,
        last_bot_message: "New conversation",
      },
      ...prev.filter((item) => item.session_id !== newSessionId),
    ]);
    CookieManager("set", "session-id", newSessionId);
    setChatResetKey((prev) => prev + 1);
    setIsMobileRightBarOpen(false);
  };

  const handleSelectSession = (selectedSessionId: string) => {
    if (!selectedSessionId || selectedSessionId === sessionId) {
      return;
    }

    CookieManager("delete", "session-id");
    CookieManager("set", "session-id", selectedSessionId);
    setSessionId(selectedSessionId);
    setSessionItems((prev) => {
      const selectedItem = prev.find((item) => item.session_id === selectedSessionId);
      const remainingItems = prev.filter((item) => item.session_id !== selectedSessionId);

      return selectedItem ? [selectedItem, ...remainingItems] : remainingItems;
    });
    setChatResetKey((prev) => prev + 1);
    setIsMobileRightBarOpen(false);
  };

  const handleDeleteSession = async (selectedSessionId: string) => {
    try {
      const response = await deleteSession(selectedSessionId);

      if (!response.deleted) {
        throw new Error("Session was not deleted");
      }

      const remainingItems = sessionItems.filter(
        (item) => item.session_id !== selectedSessionId,
      );
      const nextActiveSessionId =
        sessionId === selectedSessionId
          ? (remainingItems[0]?.session_id ?? "")
          : sessionId;

      setSessionItems(remainingItems);
      setSessionId(nextActiveSessionId);

      CookieManager("delete", "session-id");

      if (nextActiveSessionId) {
        CookieManager("set", "session-id", nextActiveSessionId);
      }

      setChatResetKey((prev) => prev + 1);
      setIsMobileRightBarOpen(false);
    } catch (error) {
      console.error("Delete session API error:", error);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="relative flex h-full min-h-0 overflow-hidden bg-[#030114] border border-white/[0.08] shadow-2xl md:rounded-3xl">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#5271ff]/[0.06] blur-[130px]" />
        <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-[#3a4ec4]/[0.06] blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-[#22d3ee]/[0.04] blur-[100px]" />

        <button
          type="button"
          aria-label={isMobileRightBarOpen ? "Close chat history" : "Open chat history"}
          onClick={() => setIsMobileRightBarOpen((prev) => !prev)}
          className="fixed right-4 top-20 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-[#0a0826]/80 text-white/70 shadow-lg shadow-blue-500/5 backdrop-blur-md transition hover:bg-white/[0.04] hover:text-white hover:border-[#5271ff]/30 lg:hidden"
        >
          {isMobileRightBarOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        <ChatArea key={chatResetKey} sessionId={sessionId} model={selectedModel} />

        {isMobileRightBarOpen && (
          <div className="fixed inset-0 z-20 bg-[#030114]/80 backdrop-blur-sm lg:hidden">
            <button
              type="button"
              aria-label="Close chat history overlay"
              onClick={() => setIsMobileRightBarOpen(false)}
              className="h-full w-full"
            />
          </div>
        )}

        <RightBar
          activeSessionId={sessionId}
          isMobileOpen={isMobileRightBarOpen}
          model={selectedModel}
          onModelChange={setSelectedModel}
          onDeleteSession={handleDeleteSession}
          onNewConversation={handleNewConversation}
          onSelectSession={handleSelectSession}
          sessionItems={sessionItems}
        />
      </div>
    </div>
  );
};

export default Page;
