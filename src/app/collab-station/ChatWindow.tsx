"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, Paperclip, Send, X, File, Download, ArrowDown } from "lucide-react";
import { Message, Attachment } from "./types";

interface ChatWindowProps {
  activeChannelName: string;
  activeChannelType: "group" | "direct";
  messages: Message[];
  onSendMessage: (text: string, attachment?: Attachment) => void;
  onInitiateCall: (type: "audio" | "video") => void;
}

export default function ChatWindow({
  activeChannelName,
  activeChannelType,
  messages,
  onSendMessage,
  onInitiateCall,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<Attachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Dynamic composer box auto-sizing
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [inputText]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed && !selectedFile) return;

    onSendMessage(trimmed, selectedFile || undefined);
    setInputText("");
    setSelectedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const sizeKB = Math.round(file.size / 1024);
    const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

    setSelectedFile({
      name: file.name,
      size: sizeStr,
      type: file.type || "application/octet-stream",
    });

    // Reset input
    e.target.value = "";
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-transparent">
      
      {/* Header Panel */}
      <div className="shrink-0 border-b border-white/[0.08] bg-[#0c0a2d]/25 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5271ff]/10 border border-[#5271ff]/20 text-[#5271ff] shadow-[inset_0_0_10px_rgba(82,113,255,0.2)] font-bold text-sm relative">
            {activeChannelName.startsWith("#") ? activeChannelName.slice(1, 3).toUpperCase() : activeChannelName.slice(0, 2).toUpperCase()}
            {activeChannelType === "direct" && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#030114] shadow-[0_0_8px_#10b981]" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">{activeChannelName}</h2>
            <p className="text-[10px] text-white/40 flex items-center gap-1">
              {activeChannelType === "group" ? (
                <>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Workspace Connection
                </>
              ) : (
                <>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Secure Line Enabled
                </>
              )}
            </p>
          </div>
        </div>

        {/* Call Controls Area */}
        <div className="flex items-center gap-3">
          {/* Audio Call Button */}
          <motion.button
            type="button"
            onClick={() => onInitiateCall("audio")}
            whileHover={{ scale: 1.08, backgroundColor: "rgba(82, 113, 255, 0.15)" }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:text-white hover:border-[#5271ff]/30 shadow-sm cursor-pointer"
            aria-label="Audio call button"
          >
            <Phone size={16} />
          </motion.button>

          {/* Video Call Button */}
          <motion.button
            type="button"
            onClick={() => onInitiateCall("video")}
            whileHover={{ scale: 1.08, backgroundColor: "rgba(82, 113, 255, 0.15)" }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:text-white hover:border-[#5271ff]/30 shadow-sm cursor-pointer"
            aria-label="Video call button"
          >
            <Video size={16} />
          </motion.button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin select-text">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center opacity-40">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-white/30 text-white/50">
              <ArrowDown className="animate-bounce" size={24} />
            </div>
            <p className="text-sm font-medium text-white/80">Transmission stream empty.</p>
            <p className="text-xs text-white/40 mt-1">Initiate typing to transmit new messages.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {messages.map((message) => {
              const isMe = message.sender === "me";
              return (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex max-w-[80%] gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    
                    {/* User Avatar */}
                    {!isMe && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#5271ff]/20 to-[#3a4ec4]/10 border border-white/10 text-xs font-bold text-white shadow-sm">
                        {message.avatar || message.senderName.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="space-y-1">
                      {/* Sender Name (Only in Group chats from others) */}
                      {!isMe && activeChannelType === "group" && (
                        <p className="text-[10px] font-bold text-white/35 ml-1">
                          {message.senderName}
                        </p>
                      )}

                      {/* Bubble Text Body */}
                      <div
                        className={`p-4 rounded-2xl border ${
                          isMe
                            ? "bg-[#5271ff]/15 text-white border-[#5271ff]/30 shadow-[0_4px_16px_rgba(82,113,255,0.15)]"
                            : "bg-[#0a0826]/60 text-white/95 border-white/[0.08] shadow-[0_6px_20px_rgba(0,0,0,0.3)]"
                        }`}
                      >
                        {/* Render Attached Files inside Message if any */}
                        {message.attachment && (
                          <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5271ff]/20 text-[#5271ff]">
                              <File size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-xs font-semibold text-white">
                                {message.attachment.name}
                              </p>
                              <p className="text-[10px] text-white/40">
                                {message.attachment.size}
                              </p>
                            </div>
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition cursor-pointer"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        )}

                        {message.text && (
                          <p className="text-xs leading-5 break-words whitespace-pre-wrap">
                            {message.text}
                          </p>
                        )}
                      </div>

                      {/* Message Time stamp */}
                      <p className={`text-[9px] uppercase tracking-wider font-semibold text-white/20 mt-1 ${
                        isMe ? "text-right mr-1" : "text-left ml-1"
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer Input Bar */}
      <div className="shrink-0 border-t border-white/[0.08] bg-[#0c0a2d]/10 px-5 py-4">
        
        {/* Attachment preview banner */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 12 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between rounded-xl border border-[#5271ff]/30 bg-[#5271ff]/5 p-3 shadow-md backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5271ff]/20 text-[#5271ff] shadow-[0_0_8px_rgba(82,113,255,0.2)]">
                    <File size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white truncate max-w-xs sm:max-w-sm">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-white/40">{selectedFile.size}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Dock frame */}
        <div className="w-full border border-white/[0.08] rounded-2xl px-4 py-2.5 flex items-end justify-between gap-3 bg-white/[0.02] focus-within:border-[#5271ff]/50 transition-all duration-300">
          
          <div className="flex items-center gap-3 w-full">
            {/* Attachment Button */}
            <motion.button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-[#5271ff]/10 hover:border-[#5271ff]/30 flex items-center justify-center transition-all duration-300 shrink-0 text-white/60 hover:text-white cursor-pointer"
              aria-label="Attach documents"
            >
              <Paperclip size={16} />
            </motion.button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Main Textarea input */}
            <textarea
              ref={textareaRef}
              placeholder="Write a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full resize-none outline-none bg-transparent text-xs text-white placeholder:text-white/30 leading-5 min-h-[24px] max-h-[120px] overflow-y-auto pt-1.5 focus:outline-none"
            />
          </div>

          {/* Send Button */}
          <motion.button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim() && !selectedFile}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] shadow-[0_0_12px_rgba(82,113,255,0.3)] hover:shadow-[0_0_18px_rgba(82,113,255,0.5)] flex items-center justify-center shrink-0 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
            aria-label="Send message"
          >
            <Send size={14} className="text-white" />
          </motion.button>

        </div>
      </div>

    </div>
  );
}
