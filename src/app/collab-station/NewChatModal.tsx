"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Users,
  User,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { ChatChannel } from "./types";
import { getAllEmployeesApi } from "@/app/employees/apis/getAllEmployeeApi";
import { CookieManager } from "@/lib/cookieManager";
import { readTokenUser } from "./helpers/mainHelper";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (
    channel: Omit<ChatChannel, "unreadCount" | "lastMessage" | "time"> & {
      description?: string;
      avatarUrl?: string;
      selectedMemberIds?: string[];
    }
  ) => void;
}

interface Teammate {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
}

export default function NewChatModal({
  isOpen,
  onClose,
  onCreateChannel,
}: NewChatModalProps) {
  const [activeTab, setActiveTab] = useState<"direct" | "group">("direct");
  const [searchQuery, setSearchQuery] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedGroupType, setSelectedGroupType] = useState<"team" | "project" | "custom">("team");
  const [selectedTeammate, setSelectedTeammate] = useState<string | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    const loadEmployees = async () => {
      setIsLoading(true);
      try {
        const allEmployees = await getAllEmployeesApi();
        if (!active) return;

        const token = await CookieManager("get", "access-token");
        const currentUser = token ? readTokenUser(token) : {};
        const myUserId = currentUser.user_id ?? currentUser.sub;

        const mapped: Teammate[] = allEmployees
          .filter((emp) => myUserId === undefined || String(emp.user_id) !== String(myUserId))
          .map((emp) => {
            const displayName =
              emp.name || `${emp.first_name || ""} ${emp.last_name || ""}`.trim() || "Teammate";
            const initials = displayName
              ? displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "TM";

            return {
              id: String(emp.user_id),
              name: displayName,
              role: emp.role?.name || emp.role?.role || "Member",
              avatar: initials,
              online: true,
            };
          });

        setTeammates(mapped);
      } catch (err) {
        console.error("Failed to load teammates for new chat:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadEmployees();
    return () => {
      active = false;
    };
  }, [isOpen]);

  const filteredTeammates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return teammates;
    return teammates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q)
    );
  }, [teammates, searchQuery]);

  const handleToggleMember = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (activeTab === "group") {
      if (!groupName.trim()) return;
      onCreateChannel({
        id: `g-${Date.now()}`,
        name: groupName.trim(),
        type: "group",
        groupType: selectedGroupType,
        description: groupDescription.trim() || undefined,
        selectedMemberIds,
        membersCount: selectedMemberIds.length + 1,
      });
      setGroupName("");
      setGroupDescription("");
      setSelectedMemberIds([]);
    } else {
      if (!selectedTeammate) return;
      const teammate = teammates.find((t) => t.id === selectedTeammate);
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md border-v2-neutral-400 bg-v2-neutral-600 text-v2-neutral-100 p-0 overflow-hidden sm:rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-v2-neutral-500">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-v2-neutral-500 text-v2-neutral-100 border border-v2-neutral-400 shadow-xs">
              <Sparkles className="size-4.5" />
            </span>
            <div>
              <DialogTitle className="text-base font-semibold text-v2-neutral-100">
                Start Conversation
              </DialogTitle>
              <DialogDescription className="text-xs text-v2-neutral-400 mt-0.5">
                Initiate a 1-on-1 direct message or create a squad channel
              </DialogDescription>
            </div>
          </div>

          {/* Segmented Mode Selector */}
          <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl border border-v2-neutral-400 bg-v2-neutral-500/50 p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("direct")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 font-medium transition cursor-pointer ${
                activeTab === "direct"
                  ? "bg-v2-neutral-100 text-v2-neutral-600 font-semibold shadow-xs"
                  : "text-v2-neutral-400 hover:text-v2-neutral-200"
              }`}
            >
              <User className="size-3.5" />
              <span>Direct Chat</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("group")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 font-medium transition cursor-pointer ${
                activeTab === "group"
                  ? "bg-v2-neutral-100 text-v2-neutral-600 font-semibold shadow-xs"
                  : "text-v2-neutral-400 hover:text-v2-neutral-200"
              }`}
            >
              <Users className="size-3.5" />
              <span>Group Channel</span>
            </button>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="p-6 pt-4 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {activeTab === "direct" ? (
            /* Direct Chat View */
            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-v2-neutral-400" />
                <input
                  type="text"
                  placeholder="Search team members by name or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full rounded-xl border border-v2-neutral-400 bg-v2-neutral-500/40 pl-8.5 pr-3 text-xs text-v2-neutral-100 placeholder:text-v2-neutral-400 outline-none transition focus:border-v2-neutral-300 focus:ring-2 focus:ring-v2-neutral-400/25"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                {isLoading ? (
                  <div className="py-8 text-center text-xs text-v2-neutral-400">
                    Loading team members...
                  </div>
                ) : filteredTeammates.length === 0 ? (
                  <div className="py-8 text-center text-xs text-v2-neutral-400">
                    No colleagues match your search.
                  </div>
                ) : (
                  filteredTeammates.map((teammate) => {
                    const isSelected = selectedTeammate === teammate.id;
                    return (
                      <div
                        key={teammate.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedTeammate(teammate.id)}
                        className={`flex items-center justify-between rounded-xl p-2.5 transition border cursor-pointer ${
                          isSelected
                            ? "border-v2-neutral-300 bg-v2-neutral-500 text-v2-neutral-100"
                            : "border-transparent bg-v2-neutral-500/20 hover:border-v2-neutral-500 hover:bg-v2-neutral-500/40 text-v2-neutral-300"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="size-8.5 border border-v2-neutral-400 bg-v2-neutral-500 text-xs font-bold text-v2-neutral-100 shrink-0">
                            <AvatarFallback>{teammate.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-v2-neutral-100">
                              {teammate.name}
                            </p>
                            <p className="truncate text-[11px] text-v2-neutral-400">
                              {teammate.role}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="flex size-5 items-center justify-center rounded-full bg-v2-neutral-100 text-v2-neutral-600">
                            <Check className="size-3" />
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* Group Channel View */
            <div className="space-y-4">
              <Field>
                <FieldLabel className="text-xs font-semibold text-v2-neutral-300">
                  Channel Name <span className="text-rose-400">*</span>
                </FieldLabel>
                <input
                  type="text"
                  placeholder="e.g. Design Systems, Sprint Alpha, QA Lead"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="h-9 w-full rounded-xl border border-v2-neutral-400 bg-v2-neutral-500/40 px-3 text-xs text-v2-neutral-100 placeholder:text-v2-neutral-400 outline-none transition focus:border-v2-neutral-300 focus:ring-2 focus:ring-v2-neutral-400/25"
                />
              </Field>

              <Field>
                <FieldLabel className="text-xs font-semibold text-v2-neutral-300">
                  Channel Classification
                </FieldLabel>
                <Select
                  value={selectedGroupType}
                  onValueChange={(val: "team" | "project" | "custom") => setSelectedGroupType(val)}
                >
                  <SelectTrigger className="h-9 w-full rounded-xl border-v2-neutral-400 bg-v2-neutral-500/40 px-3 text-xs text-v2-neutral-100">
                    <SelectValue placeholder="Select group type" />
                  </SelectTrigger>
                  <SelectContent className="border-v2-neutral-400 bg-v2-neutral-600 text-v2-neutral-100">
                    <SelectItem value="team" className="text-xs cursor-pointer">
                      Team Squad Channel
                    </SelectItem>
                    <SelectItem value="project" className="text-xs cursor-pointer">
                      Project Linked Channel
                    </SelectItem>
                    <SelectItem value="custom" className="text-xs cursor-pointer">
                      Custom Collaboration Channel
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel className="text-xs font-semibold text-v2-neutral-300">
                  Topic / Description (Optional)
                </FieldLabel>
                <textarea
                  placeholder="Brief context regarding channel objectives..."
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-v2-neutral-400 bg-v2-neutral-500/40 p-2.5 text-xs text-v2-neutral-100 placeholder:text-v2-neutral-400 outline-none transition focus:border-v2-neutral-300 focus:ring-2 focus:ring-v2-neutral-400/25 resize-none"
                />
              </Field>

              {/* Members Picker */}
              <div className="space-y-2 pt-1 border-t border-v2-neutral-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-v2-neutral-300">
                    Add Channel Members ({selectedMemberIds.length})
                  </span>
                </div>

                {/* Selected members chips */}
                {selectedMemberIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pb-1">
                    {selectedMemberIds.map((id) => {
                      const member = teammates.find((t) => t.id === id);
                      if (!member) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-v2-neutral-400 bg-v2-neutral-500/70 px-2 py-0.5 text-[11px] text-v2-neutral-100"
                        >
                          <span>{member.name}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleMember(id)}
                            className="hover:text-rose-400 cursor-pointer"
                          >
                            <X className="size-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Search members */}
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-3 -translate-y-1/2 text-v2-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search colleagues to add..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 w-full rounded-lg border border-v2-neutral-400 bg-v2-neutral-500/30 pl-8 pr-3 text-xs text-v2-neutral-100 placeholder:text-v2-neutral-400 outline-none transition focus:border-v2-neutral-300"
                  />
                </div>

                <div className="max-h-36 overflow-y-auto custom-scrollbar space-y-1">
                  {filteredTeammates.map((teammate) => {
                    const isSelected = selectedMemberIds.includes(teammate.id);
                    return (
                      <div
                        key={teammate.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleToggleMember(teammate.id)}
                        className={`flex items-center justify-between rounded-lg p-2 text-xs transition cursor-pointer ${
                          isSelected
                            ? "bg-v2-neutral-500 text-v2-neutral-100 border border-v2-neutral-400"
                            : "hover:bg-v2-neutral-500/30 text-v2-neutral-300 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="size-6 text-[9px] font-bold">
                            <AvatarFallback>{teammate.avatar}</AvatarFallback>
                          </Avatar>
                          <span className="truncate">{teammate.name}</span>
                          <span className="text-[10px] text-v2-neutral-400 truncate">
                            ({teammate.role})
                          </span>
                        </div>
                        <div
                          className={`size-4 rounded flex items-center justify-center border transition ${
                            isSelected
                              ? "bg-v2-neutral-100 border-v2-neutral-100 text-v2-neutral-600"
                              : "border-v2-neutral-400 bg-v2-neutral-500/40"
                          }`}
                        >
                          {isSelected && <Check className="size-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <DialogFooter className="p-4 border-t border-v2-neutral-500 bg-v2-neutral-600/90 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={activeTab === "group" ? !groupName.trim() : !selectedTeammate}
            onClick={handleSubmit}
            className="text-xs"
          >
            {activeTab === "group" ? "Create Channel" : "Start Conversation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
