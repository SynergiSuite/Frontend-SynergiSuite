"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit3, Trash2, Users, ShieldCheck, UserCheck, Sparkles, UserMinus, AlertTriangle, Info, LogOut, UserPlus, Search } from "lucide-react";
import { ChatChannel } from "./types";
import { toast } from "sonner";
import { editCustomGroupApi } from "./apis/DirectChats/CustomGroups/editCustomGroupApi";
import { deleteCustomGroupApi } from "./apis/DirectChats/CustomGroups/deleteCustomGroupApi";
import { removeGroupMemberApi } from "./apis/DirectChats/CustomGroups/removeGroupMemberApi";
import { addGroupMembersApi } from "./apis/DirectChats/CustomGroups/addGroupMembersApi";
import { getAllEmployeesApi } from "@/app/employees/apis/getAllEmployeeApi";
import { readTokenUser } from "./helpers/mainHelper";
import { CookieManager } from "@/lib/cookieManager";

export interface GroupMemberItem {
  id?: string;
  userId: number | string;
  role: "admin" | "member" | string;
  name?: string;
  email?: string;
}

export interface ChatDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: ChatChannel | null;
  rawGroupData?: any;
  currentUserId?: number | string;
  onOpenEdit: () => void;
  onOpenDelete: () => void;
  onOpenAddMember?: () => void;
  onMemberRemoved?: (userId: number | string) => void;
}

export function ChatDetailsModal({
  isOpen,
  onClose,
  channel,
  rawGroupData,
  currentUserId,
  onOpenEdit,
  onOpenDelete,
  onOpenAddMember,
  onMemberRemoved,
}: ChatDetailsModalProps) {
  const [removingUserId, setRemovingUserId] = useState<number | string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  if (!isOpen || !channel) return null;

  const isGroup = channel.type !== "direct";
  const groupDetails = rawGroupData;
  const rawMembers = groupDetails?.members || [];

  const members: GroupMemberItem[] = rawMembers.map((m: any) => {
    const userObj = m.user || m;
    return {
      id: m.id,
      userId: m.userId ?? userObj?.user_id ?? userObj?.id ?? m.id,
      role: m.role || "member",
      name: userObj?.name || "Member",
      email: userObj?.email || "",
    };
  });

  const getEffectiveUserId = (): number | string | undefined => {
    if (currentUserId !== undefined && currentUserId !== null) return currentUserId;
    const token = CookieManager("get", "access-token") as string | undefined;
    if (!token) return undefined;
    const tokenUser = readTokenUser(token);
    if (tokenUser.user_id !== undefined) return tokenUser.user_id;
    if (tokenUser.sub !== undefined) return tokenUser.sub;
    if (tokenUser.email && Array.isArray(rawMembers)) {
      const match = rawMembers.find((m: any) => {
        const email = m.user?.email || m.email;
        return email && email.toLowerCase() === tokenUser.email?.toLowerCase();
      });
      if (match) return match.userId ?? match.user?.user_id ?? match.user?.id ?? match.id;
    }
    return undefined;
  };

  const effectiveUserId = getEffectiveUserId();
  const myRole = groupDetails?.myRole || (groupDetails?.createdById && String(groupDetails.createdById) === String(effectiveUserId) ? "admin" : "member");
  const isAdmin = myRole === "admin";

  const handleRemoveMember = async (userId: number | string, name?: string) => {
    if (!channel.id) return;
    try {
      setRemovingUserId(userId);
      await removeGroupMemberApi(channel.id, userId);
      toast.success(`Removed ${name || "member"} from group`);
      if (onMemberRemoved) onMemberRemoved(userId);
    } catch (err) {
      console.error("Remove member failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to remove member");
    } finally {
      setRemovingUserId(null);
    }
  };

  const handleLeaveGroup = async () => {
    const uid = getEffectiveUserId();
    if (!channel.id || uid === undefined) {
      toast.error("User session not found");
      return;
    }
    try {
      setIsLeaving(true);
      await removeGroupMemberApi(channel.id, uid);
      toast.success(`You left ${channel.name}`);
      if (onMemberRemoved) onMemberRemoved(uid);
      onClose();
    } catch (err) {
      console.error("Leave group failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to leave group");
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <AnimatePresence>
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
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0a2f]/95 p-6 shadow-[0_20px_50px_rgba(82,113,255,0.25)] backdrop-blur-2xl"
        >
          {/* Ambient Glow Effects */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#5271ff]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-[#3a4ec4]/10 blur-3xl" />

          {/* Header */}
          <div className="relative mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5271ff]/15 border border-[#5271ff]/30 text-[#5271ff] font-bold text-sm">
                {channel.name.startsWith("#") ? channel.name.slice(1, 3).toUpperCase() : channel.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  {channel.name}
                  {isGroup && (
                    <span className="rounded-full bg-[#5271ff]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[#5271ff] border border-[#5271ff]/30 uppercase">
                      {channel.groupType || "Group"}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-white/50">{isGroup ? "Group Workspace" : "Direct Connection"}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-white/50 transition hover:bg-white/5 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Description Section */}
          {groupDetails?.description && (
            <div className="mb-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">Description</p>
              <p className="text-xs text-white/80 leading-relaxed">{groupDetails.description}</p>
            </div>
          )}

          {/* Group Members Section */}
          {isGroup && (
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                  <Users size={12} className="text-[#5271ff]" />
                  Members ({members.length || channel.membersCount || 1})
                </p>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    {onOpenAddMember && (
                      <button
                        type="button"
                        onClick={onOpenAddMember}
                        className="flex items-center gap-1 text-[10px] font-semibold text-[#5271ff] bg-[#5271ff]/15 px-2.5 py-1 rounded-lg border border-[#5271ff]/30 hover:bg-[#5271ff]/25 transition cursor-pointer"
                      >
                        <UserPlus size={12} />
                        Add Member
                      </button>
                    )}
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      You are Admin
                    </span>
                  </div>
                )}
              </div>

              <div className="max-h-44 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {members.length > 0 ? (
                  members.map((member) => {
                    const isMemberAdmin = member.role === "admin";
                    const isSelf = String(member.userId) === String(currentUserId);
                    return (
                      <div
                        key={String(member.userId)}
                        className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] p-2.5 transition hover:bg-white/[0.03]"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5271ff]/20 text-[10px] font-bold text-white">
                            {member.name ? member.name.slice(0, 2).toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                              {member.name} {isSelf && <span className="text-[10px] text-white/40">(You)</span>}
                            </p>
                            {member.email && <p className="text-[9px] text-white/40">{member.email}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-semibold uppercase ${
                              isMemberAdmin
                                ? "bg-[#5271ff]/20 text-[#5271ff] border border-[#5271ff]/30"
                                : "bg-white/5 text-white/50 border border-white/10"
                            }`}
                          >
                            {isMemberAdmin ? <ShieldCheck size={10} /> : <UserCheck size={10} />}
                            {member.role}
                          </span>

                          {isAdmin && !isSelf && (
                            <button
                              type="button"
                              disabled={removingUserId === member.userId}
                              onClick={() => handleRemoveMember(member.userId, member.name)}
                              className="rounded-lg p-1 text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer disabled:opacity-30"
                              title="Remove Member"
                            >
                              <UserMinus size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-3 text-center text-xs text-white/40">No member list available.</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {isGroup && isAdmin && (
              <>
                <button
                  type="button"
                  onClick={onOpenEdit}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#5271ff]/40 bg-[#5271ff]/15 py-2.5 text-xs font-semibold text-white hover:bg-[#5271ff]/25 transition duration-200 cursor-pointer"
                >
                  <Edit3 size={14} />
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={onOpenDelete}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition duration-200 cursor-pointer"
                >
                  <Trash2 size={14} />
                  Delete Group
                </button>
              </>
            )}

            {isGroup && !isAdmin && (
              <button
                type="button"
                disabled={isLeaving}
                onClick={handleLeaveGroup}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition duration-200 cursor-pointer disabled:opacity-40"
              >
                <LogOut size={14} />
                {isLeaving ? "Leaving Group..." : "Leave Group"}
              </button>
            )}

            {!isGroup && (
              <button
                type="button"
                onClick={onOpenDelete}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition duration-200 cursor-pointer"
              >
                <Trash2 size={14} />
                Delete Chat
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export interface EditChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: ChatChannel | null;
  rawGroupData?: any;
  onSaveSuccess: (updated: { name: string; description?: string; avatarUrl?: string }) => void;
}

export function EditChatModal({ isOpen, onClose, channel, rawGroupData, onSaveSuccess }: EditChatModalProps) {
  const [name, setName] = useState(channel?.name || "");
  const [description, setDescription] = useState(rawGroupData?.description || "");
  const [avatarUrl, setAvatarUrl] = useState(rawGroupData?.avatarUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (channel) {
      setName(channel.name);
      setDescription(rawGroupData?.description || "");
      setAvatarUrl(rawGroupData?.avatarUrl || "");
    }
  }, [channel, rawGroupData]);

  if (!isOpen || !channel) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await editCustomGroupApi(channel.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
      });

      toast.success("Group updated successfully");
      onSaveSuccess({
        name: name.trim(),
        description: description.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
      });
      onClose();
    } catch (err) {
      console.error("Edit group failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update group");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#030114]/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0a2f]/95 p-6 shadow-[0_20px_50px_rgba(82,113,255,0.25)] backdrop-blur-2xl"
        >
          <div className="relative mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5271ff]/15 border border-[#5271ff]/30 text-[#5271ff]">
                <Sparkles size={16} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">Edit Group</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-white/50 transition hover:bg-white/5 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Group Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#030114]/60 px-4 text-xs font-medium text-white outline-none transition focus:border-[#5271ff]/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#030114]/60 px-4 text-xs font-medium text-white outline-none transition focus:border-[#5271ff]/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Avatar URL (Optional)</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#030114]/60 px-4 text-xs font-medium text-white outline-none transition focus:border-[#5271ff]/50"
              />
            </div>

            <div className="mt-6 flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/[0.08] py-2.5 text-xs font-semibold text-white/70 hover:bg-white/5 transition duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="flex-1 bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] py-2.5 text-xs font-bold text-white rounded-xl hover:opacity-95 shadow-[0_0_15px_rgba(82,113,255,0.25)] disabled:opacity-40 transition duration-200 cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export interface DeleteChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: ChatChannel | null;
  onDeleteSuccess: (channelId: string) => void;
}

export function DeleteChatModal({ isOpen, onClose, channel, onDeleteSuccess }: DeleteChatModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !channel) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCustomGroupApi(channel.id);
      toast.success(`Deleted ${channel.name}`);
      onDeleteSuccess(channel.id);
      onClose();
    } catch (err) {
      console.error("Delete chat failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete chat");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#030114]/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-rose-500/20 bg-[#0c0a2f]/95 p-6 shadow-[0_20px_50px_rgba(244,63,94,0.2)] backdrop-blur-2xl"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">Delete {channel.name}?</h3>
              <p className="text-xs text-rose-300/70">This action cannot be undone.</p>
            </div>
          </div>

          <p className="mb-6 text-xs text-white/70 leading-relaxed">
            Are you sure you want to permanently delete <strong className="text-white">{channel.name}</strong>? All associated messages and data will be removed.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/[0.08] py-2.5 text-xs font-semibold text-white/70 hover:bg-white/5 transition duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-gradient-to-r from-rose-600 to-rose-700 py-2.5 text-xs font-bold text-white rounded-xl hover:opacity-95 shadow-[0_0_15px_rgba(244,63,94,0.3)] disabled:opacity-40 transition duration-200 cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: ChatChannel | null;
  existingMemberIds?: (number | string)[];
  onMembersAdded: () => void;
}

export function AddMemberModal({
  isOpen,
  onClose,
  channel,
  existingMemberIds = [],
  onMembersAdded,
}: AddMemberModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [teammates, setTeammates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;

    let active = true;
    const loadEmployees = async () => {
      setIsLoading(true);
      try {
        const allEmployees = await getAllEmployeesApi();
        if (!active) return;

        const existingSet = new Set(existingMemberIds.map(String));

        const available = allEmployees
          .filter((emp) => !existingSet.has(String(emp.user_id)))
          .map((emp) => {
            const displayName = emp.name || `${emp.first_name || ""} ${emp.last_name || ""}`.trim() || "Member";
            return {
              id: String(emp.user_id),
              name: displayName,
              role: emp.role?.name || emp.role?.role || "Member",
              avatar: displayName
                ? displayName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "??",
            };
          });

        setTeammates(available);
      } catch (err) {
        console.error("Failed to load employees for add member modal:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadEmployees();

    return () => {
      active = false;
    };
  }, [isOpen, existingMemberIds]);

  if (!isOpen || !channel) return null;

  const filtered = teammates.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  const handleAdd = async () => {
    if (selectedIds.length === 0) return;
    try {
      setIsSubmitting(true);
      await addGroupMembersApi(channel.id, selectedIds);
      toast.success(`Added ${selectedIds.length} member(s) to ${channel.name}`);
      setSelectedIds([]);
      onMembersAdded();
      onClose();
    } catch (err) {
      console.error("Add group members failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to add members");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#030114]/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0a2f]/95 p-6 shadow-[0_20px_50px_rgba(82,113,255,0.25)] backdrop-blur-2xl"
        >
          <div className="relative mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5271ff]/15 border border-[#5271ff]/30 text-[#5271ff]">
                <UserPlus size={16} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">Add Members</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-white/50 transition hover:bg-white/5 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-white/50 mb-4">Select teammates to add to <strong className="text-white">{channel.name}</strong></p>

          <div className="relative mb-4">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search teammates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#030114]/60 pl-9 pr-4 text-xs font-medium text-white outline-none transition focus:border-[#5271ff]/50"
            />
          </div>

          <div className="max-h-52 overflow-y-auto space-y-2 pr-1 mb-6 custom-scrollbar">
            {isLoading ? (
              <p className="py-6 text-center text-xs text-white/40">Loading teammates...</p>
            ) : filtered.length > 0 ? (
              filtered.map((teammate) => {
                const isSelected = selectedIds.includes(teammate.id);
                return (
                  <div
                    key={teammate.id}
                    onClick={() => toggleSelect(teammate.id)}
                    className={`flex items-center justify-between rounded-xl border p-2.5 cursor-pointer transition ${
                      isSelected
                        ? "border-[#5271ff]/50 bg-[#5271ff]/15"
                        : "border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5271ff]/20 text-[10px] font-bold text-white">
                        {teammate.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{teammate.name}</p>
                        <p className="text-[9px] text-white/40">{teammate.role}</p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="h-4 w-4 rounded accent-[#5271ff] cursor-pointer"
                    />
                  </div>
                );
              })
            ) : (
              <p className="py-6 text-center text-xs text-white/40">No available teammates found.</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/[0.08] py-2.5 text-xs font-semibold text-white/70 hover:bg-white/5 transition duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={isSubmitting || selectedIds.length === 0}
              className="flex-1 bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] py-2.5 text-xs font-bold text-white rounded-xl hover:opacity-95 shadow-[0_0_15px_rgba(82,113,255,0.25)] disabled:opacity-40 transition duration-200 cursor-pointer"
            >
              {isSubmitting ? "Adding..." : `Add Selected (${selectedIds.length})`}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
