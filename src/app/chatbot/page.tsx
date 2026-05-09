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
    } catch (error) {
      console.error("Delete session API error:", error);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex h-full min-h-0 overflow-hidden rounded-3xl bg-white shadow-sm">
        <ChatArea key={chatResetKey} sessionId={sessionId} />
        <RightBar
          activeSessionId={sessionId}
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
