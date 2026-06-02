"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Users, User, Sparkles } from "lucide-react";
import { ChatChannel } from "./types";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (channel: Omit<ChatChannel, "unreadCount" | "lastMessage" | "time">) => void;
}

const MOCK_TEAMMATES = [
  { id: "1", name: "Sarah Connor", role: "UI Designer", avatar: "SC", online: true },
  { id: "2", name: "Alex Mercer", role: "Backend Architect", avatar: "AM", online: false },
  { id: "3", name: "Elena Rostova", role: "Product Manager", avatar: "ER", online: true },
  { id: "4", name: "David Chen", role: "DevOps Engineer", avatar: "DC", online: true },
  { id: "5", name: "Marcus Aurelius", role: "Project Lead", avatar: "MA", online: false },
  { id: "6", name: "Livia Drusilla", role: "Data Scientist", avatar: "LD", online: true },
];

export default function NewChatModal({ isOpen, onClose, onCreateChannel }: NewChatModalProps) {
  const [activeTab, setActiveTab] = useState<"direct" | "group">("direct");
  const [searchQuery, setSearchQuery] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedGroupType, setSelectedGroupType] = useState<"team" | "project" | "custom">("team");
  const [selectedTeammate, setSelectedTeammate] = useState<string | null>(null);

  const filteredTeammates = MOCK_TEAMMATES.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (activeTab === "group") {
      if (!groupName.trim()) return;
      const formattedName = groupName.trim().startsWith("#") ? groupName.trim() : `#${groupName.trim()}`;
      onCreateChannel({
        id: `g-${Date.now()}`,
        name: formattedName,
        type: "group",
        groupType: selectedGroupType,
        membersCount: Math.floor(Math.random() * 5) + 3,
      });
      setGroupName("");
    } else {
      if (!selectedTeammate) return;
      const teammate = MOCK_TEAMMATES.find((t) => t.id === selectedTeammate);
      if (!teammate) return;
      onCreateChannel({
        id: `d-${teammate.id}-${Date.now()}`,
        name: teammate.name,
        type: "direct",
        status: teammate.online ? "online" : "offline",
        avatar: teammate.avatar,
      });
      setSelectedTeammate(null);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#030114]/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0a2f]/90 p-6 shadow-[0_20px_50px_rgba(82,113,255,0.2)] backdrop-blur-2xl"
          >
            {/* Ambient subtle glow inside the modal */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#5271ff]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-[#3a4ec4]/10 blur-3xl" />

            {/* Header */}
            <div className="relative mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5271ff]/10 border border-[#5271ff]/30 text-[#5271ff]">
                  <Sparkles size={16} />
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Initialize Sync Session
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="relative mb-6 grid grid-cols-2 rounded-xl bg-white/[0.03] p-1 border border-white/[0.05]">
              <button
                type="button"
                onClick={() => setActiveTab("direct")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 ${
                  activeTab === "direct"
                    ? "bg-[#5271ff] text-white shadow-[0_0_15px_rgba(82,113,255,0.3)]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <User size={14} />
                Direct Link
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("group")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 ${
                  activeTab === "group"
                    ? "bg-[#5271ff] text-white shadow-[0_0_15px_rgba(82,113,255,0.3)]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Users size={14} />
                Multiplex Group
              </button>
            </div>

            {/* Form Area */}
            <div className="space-y-4">
              {activeTab === "group" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                      Group Category
                    </label>
                    <div className="grid grid-cols-3 rounded-xl bg-white/[0.02] p-1 border border-white/[0.05] gap-1">
                      {(["team", "project", "custom"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedGroupType(t)}
                          className={`rounded-lg py-2 text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 border ${
                            selectedGroupType === t
                              ? "bg-[#5271ff]/15 text-white border-[#5271ff]/40 shadow-sm"
                              : "text-white/45 hover:text-white/75 border-transparent bg-transparent"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                      Group Channel Identifier
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. #frontend-synergi"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#030114]/60 px-4 text-xs font-medium text-white placeholder:text-white/30 outline-none transition focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Search Teammates
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type name to filter..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#030114]/60 pl-10 pr-4 text-xs font-medium text-white placeholder:text-white/30 outline-none transition focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30"
                    />
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  </div>

                  {/* Teammates List */}
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {filteredTeammates.length > 0 ? (
                      filteredTeammates.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => setSelectedTeammate(member.id)}
                          className={`flex w-full items-center gap-3 rounded-xl p-3 border transition-all duration-300 ${
                            selectedTeammate === member.id
                              ? "border-[#5271ff] bg-[#5271ff]/10 text-white shadow-[inset_0_0_10px_rgba(82,113,255,0.1)]"
                              : "border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.04] text-white/80"
                          }`}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5271ff]/20 text-xs font-bold text-white shadow-[0_0_8px_rgba(82,113,255,0.15)] relative">
                            {member.avatar}
                            {member.online && (
                              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#0c0a2f]" />
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-xs font-semibold">{member.name}</p>
                            <p className="text-[10px] text-white/40">{member.role}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="py-4 text-center text-xs text-white/30">
                        No team nodes matching parameters.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/[0.08] py-3 text-xs font-semibold text-white/70 hover:bg-white/5 hover:text-white transition duration-300"
              >
                Abort
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={activeTab === "group" ? !groupName.trim() : !selectedTeammate}
                className="flex-1 bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] py-3 text-xs font-bold text-white rounded-xl hover:opacity-95 shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:shadow-[0_0_22px_rgba(82,113,255,0.4)] disabled:opacity-40 disabled:pointer-events-none transition duration-300"
              >
                Establish Link
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
