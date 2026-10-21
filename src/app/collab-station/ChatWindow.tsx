"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Video,
  Paperclip,
  Send,
  X,
  File,
  Download,
  ArrowDown,
  Trash2,
  PhoneMissed,
  Info,
  ExternalLink,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Message, Attachment } from "./types";
import { MeetingResponseDto } from "../meetings/types/meetingTypes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatWindowProps {
  activeChannelName: string;
  activeChannelType: "group" | "direct";
  messages: Message[];
  onSendMessage: (text: string, attachment?: Attachment) => void;
  onInitiateCall: (type: "audio" | "video") => void;
  onDeleteMessage?: (messageId: string) => void;
  onOpenDetails?: () => void;
  activeGroupMeeting?: MeetingResponseDto | null;
  onStartGroupMeeting?: () => void;
  onJoinGroupMeeting?: (meeting: MeetingResponseDto) => void;
  onBackToChannels?: () => void;
}

function ImageAttachmentPreview({
  attachment,
  onOpen,
}: {
  attachment: Attachment;
  onOpen: () => void;
}) {
  const [hasError, setHasError] = useState(false);

  if (!attachment.url || hasError) {
    return (
      <div className="flex max-w-[280px] items-center gap-2.5 rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/40 p-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-v2-neutral-500 text-v2-neutral-300">
          <File className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-v2-neutral-100">{attachment.name}</p>
          <p className="text-[10px] text-v2-neutral-400">Preview unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative inline-block overflow-hidden rounded-xl border border-v2-neutral-400 bg-v2-neutral-500/30">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={attachment.url}
        alt={attachment.name}
        className="block h-auto max-w-[280px] rounded-xl object-cover cursor-pointer"
        onError={() => setHasError(true)}
        onClick={onOpen}
      />
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 flex size-full cursor-pointer items-center justify-center bg-v2-neutral-600/50 text-v2-neutral-100 opacity-0 backdrop-blur-xs transition group-hover:opacity-100"
      >
        <span className="flex items-center gap-1.5 rounded-full bg-v2-neutral-600/80 px-3 py-1 text-xs font-semibold backdrop-blur-md">
          <ExternalLink className="size-3" />
          <span>View Image</span>
        </span>
      </button>
    </div>
  );
}

export default function ChatWindow({
  activeChannelName,
  activeChannelType,
  messages,
  onSendMessage,
  onInitiateCall,
  onDeleteMessage,
  onOpenDetails,
  activeGroupMeeting,
  onStartGroupMeeting,
  onJoinGroupMeeting,
  onBackToChannels,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<Attachment | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Track scroll position to toggle "Scroll to bottom" button
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 180);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!inputText.trim() && !selectedFile) return;
    onSendMessage(inputText.trim(), selectedFile || undefined);
    setInputText("");
    setSelectedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const localUrl = URL.createObjectURL(file);

    const formatSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    setSelectedFile({
      name: file.name,
      size: formatSize(file.size),
      type: isImage ? "image" : "file",
      url: localUrl,
      file,
    });

    e.target.value = "";
  };

  const isMeetingLive = activeGroupMeeting?.status === "live";

  return (
    <div className="flex h-full w-full flex-col bg-v2-neutral-600 text-v2-neutral-100">
      {/* Channel Header Bar */}
      <div className="shrink-0 flex items-center justify-between border-b border-v2-neutral-500 bg-v2-neutral-600/90 px-4 sm:px-5 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {onBackToChannels && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBackToChannels}
              className="md:hidden size-8.5 rounded-lg text-v2-neutral-300 hover:bg-v2-neutral-500 hover:text-v2-neutral-100 shrink-0"
              title="Back to channels"
            >
              <ArrowLeft className="size-4" />
            </Button>
          )}

          <Avatar className="size-10 border border-v2-neutral-400 bg-v2-neutral-500 text-xs font-bold text-v2-neutral-100 shrink-0">
            <AvatarFallback>
              {(activeChannelName || "CH")
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold tracking-[-0.02em] text-v2-neutral-100">
                {activeChannelName}
              </h3>
              <span className="rounded-md border border-v2-neutral-500 bg-v2-neutral-500/40 px-1.5 py-0.5 text-[9px] font-medium text-v2-neutral-400 uppercase tracking-wider">
                {activeChannelType === "group" ? "Group" : "Direct"}
              </span>
            </div>

            <p className="truncate text-xs text-v2-neutral-400 mt-0.5">
              {activeChannelType === "group"
                ? "Click details to view participants and manage squad settings"
                : "Encrypted direct discussion channel"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Voice Call Button - Sleek Glass Pill with Emerald Accent */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInitiateCall("audio")}
            title="Start Voice Call"
            className="h-8.5 rounded-xl border border-v2-neutral-400/80 bg-v2-neutral-500/50 px-3 text-xs text-v2-neutral-200 shadow-xs backdrop-blur-sm transition-all hover:border-v2-neutral-300 hover:bg-v2-neutral-500 hover:text-v2-neutral-100 active:scale-[0.98] cursor-pointer gap-1.5"
          >
            <Phone className="size-3.5 text-emerald-400 shrink-0" />
            <span className="hidden font-medium sm:inline">Call</span>
          </Button>

          {/* Video / Meeting Button - High Contrast Prominent Pill */}
          <Button
            type="button"
            size="sm"
            onClick={() => {
              if (isMeetingLive && activeGroupMeeting && onJoinGroupMeeting) {
                onJoinGroupMeeting(activeGroupMeeting);
              } else if (activeChannelType === "group") {
                if (onStartGroupMeeting) {
                  onStartGroupMeeting();
                }
              } else {
                onInitiateCall("video");
              }
            }}
            title={
              isMeetingLive
                ? "Join Live Meeting"
                : activeChannelType === "group"
                ? "Start Meeting"
                : "Start Video Call"
            }
            className="h-8.5 rounded-xl bg-v2-neutral-100 px-3.5 text-xs font-semibold text-v2-neutral-600 shadow-sm transition-all hover:bg-v2-neutral-200 active:scale-[0.98] cursor-pointer gap-1.5"
          >
            <Video className="size-3.5 shrink-0" />
            <span>
              {isMeetingLive
                ? "Join Meeting"
                : activeChannelType === "group"
                ? "Meet"
                : "Video"}
            </span>
          </Button>

          {/* Details / Settings Button */}
          {activeChannelType === "group" && onOpenDetails && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenDetails}
              title="Group Details"
              className="h-8.5 rounded-xl border border-v2-neutral-400/80 bg-v2-neutral-500/40 px-2.5 text-xs text-v2-neutral-200 shadow-xs transition-all hover:border-v2-neutral-300 hover:bg-v2-neutral-500 hover:text-v2-neutral-100 active:scale-[0.98] cursor-pointer"
            >
              <Info className="size-3.5" />
              <span className="sr-only">Details</span>
            </Button>
          )}
        </div>
      </div>

      {/* Live Meeting Banner (if group call is in progress) */}
      {isMeetingLive && (
        <div className="flex items-center justify-between border-b border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-xs text-emerald-400">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="font-semibold text-emerald-300">Live Meeting in Progress</span>
            <span className="text-[11px] text-emerald-400/80">
              ({activeGroupMeeting.participants?.length || 1} participant
              {(activeGroupMeeting.participants?.length || 1) > 1 ? "s" : ""})
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => onJoinGroupMeeting?.(activeGroupMeeting)}
            className="h-7 px-3 text-xs bg-emerald-500 text-v2-neutral-600 hover:bg-emerald-400 font-semibold"
          >
            Join Meeting
          </Button>
        </div>
      )}

      {/* Messages Timeline Feed */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-5 py-6 space-y-4 custom-scrollbar relative"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center opacity-60">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-v2-neutral-500 bg-v2-neutral-500/40 text-v2-neutral-300 mb-3 shadow-inner">
              <Users className="size-6" />
            </div>
            <p className="text-sm font-semibold text-v2-neutral-200">
              No messages in this channel yet
            </p>
            <p className="mt-1 text-xs text-v2-neutral-400 max-w-xs">
              Say hello or share project updates to kick off the thread.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.sender === "me";
            const isMissedCall = message.id.startsWith("missed-call-");

            if (isMissedCall) {
              return (
                <div key={message.id} className="flex justify-center my-3">
                  <div className="inline-flex items-center gap-2.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3.5 py-2 text-xs text-rose-300 shadow-xs">
                    <PhoneMissed className="size-4 text-rose-400 shrink-0" />
                    <div>
                      <span className="font-semibold">{message.text}</span>
                      <span className="text-[10px] text-rose-400/70 ml-2">
                        {message.time}
                      </span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => onInitiateCall("audio")}
                      className="ml-2 h-6 rounded-lg bg-rose-500/20 px-2 text-[10px] font-semibold text-rose-200 hover:bg-rose-500/30 hover:text-rose-100"
                    >
                      Call Back
                    </Button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className={`group flex items-end gap-2.5 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {/* Them Avatar */}
                {!isMe && (
                  <Avatar className="size-7.5 border border-v2-neutral-400 bg-v2-neutral-500 text-[10px] font-bold text-v2-neutral-100 shrink-0 mb-1">
                    <AvatarFallback>{message.avatar || "TH"}</AvatarFallback>
                  </Avatar>
                )}

                {/* Message Bubble Container */}
                <div
                  className={`flex flex-col max-w-[82%] sm:max-w-[70%] ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  {/* Sender Name for Them */}
                  {!isMe && (
                    <span className="text-[11px] font-semibold text-v2-neutral-300 px-1 mb-1">
                      {message.senderName}
                    </span>
                  )}

                  {/* Bubble Content */}
                  <div
                    className={`relative rounded-2xl px-4 py-2.5 shadow-xs transition-colors ${
                      isMe
                        ? "bg-v2-neutral-100 text-v2-neutral-600 rounded-tr-xs font-medium"
                        : "bg-v2-neutral-500/60 border border-v2-neutral-400/80 text-v2-neutral-100 rounded-tl-xs"
                    }`}
                  >
                    {/* Attachment rendering */}
                    {message.attachment && (
                      <div className="mb-2">
                        {message.attachment.type === "image" ? (
                          <ImageAttachmentPreview
                            attachment={message.attachment}
                            onOpen={() => setLightboxImage(message.attachment?.url || null)}
                          />
                        ) : (
                          <a
                            href={message.attachment.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={message.attachment.name}
                            className={`flex items-center gap-2.5 rounded-xl p-2.5 border transition ${
                              isMe
                                ? "border-v2-neutral-300 bg-v2-neutral-200/70 text-v2-neutral-600 hover:bg-v2-neutral-200"
                                : "border-v2-neutral-500 bg-v2-neutral-500/40 text-v2-neutral-100 hover:bg-v2-neutral-500/70"
                            }`}
                          >
                            <File className="size-4 shrink-0 text-v2-neutral-400" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold">
                                {message.attachment.name}
                              </p>
                              {message.attachment.size && (
                                <p className="text-[10px] opacity-70">
                                  {message.attachment.size}
                                </p>
                              )}
                            </div>
                            <Download className="size-3.5 shrink-0 opacity-70 hover:opacity-100" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Text Message */}
                    {message.text && (
                      <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">
                        {message.text}
                      </p>
                    )}

                    {/* Timestamp */}
                    <p
                      className={`text-[9px] font-medium mt-1 select-none ${
                        isMe ? "text-v2-neutral-400 text-right" : "text-v2-neutral-400"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>

                {/* Delete Message Action Button (User's own messages on hover) */}
                {isMe && onDeleteMessage && (
                  <button
                    type="button"
                    onClick={() => onDeleteMessage(message.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-v2-neutral-400 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    title="Delete message"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />

        {/* Floating Scroll to Bottom Button */}
        {showScrollBottom && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={scrollToBottom}
            className="fixed bottom-24 right-8 z-30 size-9 rounded-full border-v2-neutral-400 bg-v2-neutral-600 text-v2-neutral-100 shadow-xl hover:bg-v2-neutral-500 hover:text-v2-neutral-100"
            title="Scroll to latest messages"
          >
            <ArrowDown className="size-4" />
          </Button>
        )}
      </div>

      {/* Message Composer Area */}
      <div className="shrink-0 border-t border-v2-neutral-500 bg-v2-neutral-600/90 p-4">
        {/* Selected Attachment Preview Chip */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 10 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between rounded-xl border border-v2-neutral-400 bg-v2-neutral-500/50 p-2.5 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-v2-neutral-500 text-v2-neutral-200">
                    <File className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-v2-neutral-100 max-w-xs sm:max-w-md">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-v2-neutral-400">{selectedFile.size}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="rounded-lg p-1 text-v2-neutral-400 hover:bg-v2-neutral-500 hover:text-v2-neutral-100 transition cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Dock Frame */}
        <div className="flex items-end gap-2 rounded-2xl border border-v2-neutral-400 bg-v2-neutral-500/30 p-2 focus-within:border-v2-neutral-300 focus-within:ring-2 focus-within:ring-v2-neutral-400/20 transition-all">
          {/* File Attachment Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="size-9 shrink-0 rounded-xl text-v2-neutral-400 hover:bg-v2-neutral-500 hover:text-v2-neutral-100 cursor-pointer"
            title="Attach file or image"
          >
            <Paperclip className="size-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            className="flex-1 resize-none bg-transparent py-2 text-xs leading-5 text-v2-neutral-100 placeholder:text-v2-neutral-400 outline-none max-h-28 overflow-y-auto custom-scrollbar"
          />

          {/* Send Button */}
          <Button
            type="button"
            size="icon"
            disabled={!inputText.trim() && !selectedFile}
            onClick={handleSend}
            className="size-9 shrink-0 rounded-xl shadow-sm cursor-pointer disabled:opacity-30"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>

      {/* Lightbox Image Modal */}
      {lightboxImage &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
            onClick={() => setLightboxImage(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute right-5 top-5 rounded-full bg-v2-neutral-600/80 p-2 text-v2-neutral-100 hover:bg-v2-neutral-500 transition cursor-pointer"
            >
              <X className="size-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage}
              alt="Attachment enlarged"
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
