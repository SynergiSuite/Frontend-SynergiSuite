"use client";

import React, { useEffect, useState, useRef } from "react";
import { X, Send, Loader2, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Message } from "../types";
import { getSharedItemThreadApi } from "../apis/getSharedItemThreadApi";
import { formatMessage } from "../helpers/chatHelperFunctions";
import { TokenUser } from "../helpers/mainHelper";
import SharedItemCard from "./SharedItemCard";

export interface SharedItemThreadPanelProps {
  open: boolean;
  onClose: () => void;
  parentMessage: Message;
  channelMessages: Message[];
  groupId: string;
  onSendReply: (text: string, replyToId: string) => Promise<void>;
  currentUser: TokenUser;
}

export default function SharedItemThreadPanel({
  open,
  onClose,
  parentMessage,
  channelMessages,
  groupId,
  onSendReply,
  currentUser,
}: SharedItemThreadPanelProps) {
  const [threadReplies, setThreadReplies] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Load thread replies on open or parent message change
  useEffect(() => {
    if (!open || !parentMessage) return;

    let isCancelled = false;
    setIsLoading(true);

    if (parentMessage.sharedEntityType && parentMessage.sharedEntityId) {
      getSharedItemThreadApi(
        groupId,
        parentMessage.sharedEntityType,
        parentMessage.sharedEntityId
      )
        .then((data) => {
          if (isCancelled) return;
          if (Array.isArray(data)) {
            const formatted = data.map((msg) => formatMessage(msg, currentUser));
            setThreadReplies(formatted);
          } else {
            // Fall back gracefully to filtering channel messages by replyToId
            const filtered = channelMessages.filter(
              (m) => m.replyToId === parentMessage.id
            );
            setThreadReplies(filtered);
          }
        })
        .catch(() => {
          if (isCancelled) return;
          const filtered = channelMessages.filter(
            (m) => m.replyToId === parentMessage.id
          );
          setThreadReplies(filtered);
        })
        .finally(() => {
          if (!isCancelled) setIsLoading(false);
        });
    } else {
      const filtered = channelMessages.filter(
        (m) => m.replyToId === parentMessage.id
      );
      setThreadReplies(filtered);
      setIsLoading(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [open, parentMessage, groupId, currentUser, channelMessages]);

  // Keep thread replies synced with channel messages when new incoming replies arrive
  useEffect(() => {
    if (!open) return;
    const localFiltered = channelMessages.filter(
      (m) => m.replyToId === parentMessage.id
    );
    if (localFiltered.length > 0) {
      setThreadReplies((prev) => {
        const idSet = new Set(prev.map((m) => m.id));
        const newOnes = localFiltered.filter((m) => !idSet.has(m.id));
        if (newOnes.length > 0) {
          return [...prev, ...newOnes];
        }
        return prev;
      });
    }
  }, [channelMessages, open, parentMessage.id]);

  useEffect(() => {
    if (open) {
      threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [threadReplies.length, open]);

  if (!open) return null;

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!replyText.trim() || isSending) return;

    try {
      setIsSending(true);
      await onSendReply(replyText.trim(), parentMessage.id);
      setReplyText("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full w-80 sm:w-96 flex-col border-l border-v2-neutral-500 bg-v2-neutral-600 shrink-0 z-20 shadow-xl">
      {/* Thread Header */}
      <div className="flex items-center justify-between border-b border-v2-neutral-500 bg-v2-neutral-600/90 px-4 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-v2-neutral-300" />
          <h3 className="text-sm font-semibold text-v2-neutral-100">
            Discussion Thread
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-v2-neutral-400 hover:bg-v2-neutral-500 hover:text-v2-neutral-100 transition cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Thread Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Parent Shared Item Summary Card */}
        <div className="space-y-2">
          <div className="text-[11px] font-medium text-v2-neutral-400 uppercase tracking-wider">
            Shared Item
          </div>
          <SharedItemCard message={parentMessage} isMe={parentMessage.sender === "me"} />
          {parentMessage.text && (
            <div className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/30 p-2.5 text-xs text-v2-neutral-200">
              <span className="text-[10px] text-v2-neutral-400 block font-medium mb-1">
                Note by {parentMessage.senderName}:
              </span>
              <p className="whitespace-pre-wrap">{parentMessage.text}</p>
            </div>
          )}
        </div>

        <div className="border-t border-v2-neutral-500/80 pt-3">
          <div className="text-[11px] font-semibold text-v2-neutral-300 uppercase tracking-wider mb-3">
            Replies ({threadReplies.length})
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-v2-neutral-400">
              <Loader2 className="size-4 animate-spin" />
              <span>Loading discussion...</span>
            </div>
          ) : threadReplies.length === 0 ? (
            <div className="rounded-xl border border-dashed border-v2-neutral-500 p-6 text-center text-xs text-v2-neutral-400">
              No replies yet. Send a message to start this discussion.
            </div>
          ) : (
            <div className="space-y-3">
              {threadReplies.map((reply) => {
                const isMe = reply.sender === "me";
                return (
                  <div
                    key={reply.id}
                    className={`flex items-start gap-2.5 ${
                      isMe ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {!isMe && (
                      <Avatar className="size-6 border border-v2-neutral-400 bg-v2-neutral-500 text-[9px] font-bold text-v2-neutral-100 shrink-0">
                        <AvatarFallback>{reply.avatar || "U"}</AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`flex flex-col max-w-[85%] ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      {!isMe && (
                        <span className="text-[10px] font-semibold text-v2-neutral-300 mb-0.5">
                          {reply.senderName}
                        </span>
                      )}

                      <div
                        className={`rounded-xl px-3 py-2 text-xs leading-relaxed shadow-xs ${
                          isMe
                            ? "bg-v2-neutral-100 text-v2-neutral-600 rounded-tr-xs font-medium"
                            : "bg-v2-neutral-500/70 border border-v2-neutral-400/70 text-v2-neutral-100 rounded-tl-xs"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{reply.text}</p>
                        <p
                          className={`text-[9px] mt-1 ${
                            isMe ? "text-v2-neutral-400 text-right" : "text-v2-neutral-400"
                          }`}
                        >
                          {reply.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={threadEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Thread Composer Area */}
      <form
        onSubmit={handleSend}
        className="shrink-0 border-t border-v2-neutral-500 bg-v2-neutral-600/95 p-3"
      >
        <div className="flex items-center gap-2 rounded-xl border border-v2-neutral-400 bg-v2-neutral-500/30 p-1.5 focus-within:border-v2-neutral-300">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply to thread..."
            className="flex-1 bg-transparent px-2 py-1 text-xs text-v2-neutral-100 placeholder:text-v2-neutral-400 outline-none"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!replyText.trim() || isSending}
            className="size-7 rounded-lg shadow-xs cursor-pointer disabled:opacity-30"
          >
            {isSending ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Send className="size-3" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
