"use client";

import React, { useState, useEffect } from "react";
import {
  Edit3,
  Trash2,
  AlertTriangle,
  LogOut,
  UserPlus,
  Search,
  Check,
  Copy,
  FolderKanban,
  Shield,
  Users,
} from "lucide-react";
import { ChatChannel } from "./types";
import { toast } from "sonner";
import { editCustomGroupApi } from "./apis/DirectChats/CustomGroups/editCustomGroupApi";
import { deleteCustomGroupApi } from "./apis/DirectChats/CustomGroups/deleteCustomGroupApi";
import { removeGroupMemberApi } from "./apis/DirectChats/CustomGroups/removeGroupMemberApi";
import { addGroupMembersApi } from "./apis/DirectChats/CustomGroups/addGroupMembersApi";
import { getAllEmployeesApi, AllEmployeeRecord } from "@/app/employees/apis/getAllEmployeeApi";
import { readTokenUser } from "./helpers/mainHelper";
import { CookieManager } from "@/lib/cookieManager";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field, FieldLabel } from "@/components/ui/field";

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
  rawGroupData?: Record<string, unknown> | null;
  currentUserId?: number | string;
  onOpenEdit: () => void;
  onOpenDelete: () => void;
  onOpenAddMember?: () => void;
  onMemberRemoved?: (userId: number | string) => void;
  onOpenDeleteChatForMe?: () => void;
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
  onOpenDeleteChatForMe,
}: ChatDetailsModalProps) {
  const [removingUserId, setRemovingUserId] = useState<number | string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen || !channel) return null;

  const isGroup = channel.type !== "direct";
  const groupDetails = rawGroupData as Record<string, unknown> | undefined;
  const rawMembers = Array.isArray(groupDetails?.members)
    ? (groupDetails?.members as Array<Record<string, unknown>>)
    : [];

  const members: GroupMemberItem[] = rawMembers.map((m) => {
    const userObj = (m.user as Record<string, unknown> | undefined) || m;
    const userIdVal =
      (m.userId as number | string | undefined) ??
      (userObj?.user_id as number | string | undefined) ??
      (userObj?.id as number | string | undefined) ??
      (m.id as number | string | undefined) ??
      "";
    return {
      id: typeof m.id === "string" ? m.id : undefined,
      userId: userIdVal,
      role: typeof m.role === "string" ? m.role : "member",
      name: typeof userObj?.name === "string" ? userObj.name : "Member",
      email: typeof userObj?.email === "string" ? userObj.email : "",
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
      const match = rawMembers.find((m) => {
        const userObj = (m.user as Record<string, unknown> | undefined) || m;
        const email = (userObj?.email as string) || (m.email as string);
        return email && email.toLowerCase() === tokenUser.email?.toLowerCase();
      });
      if (match) {
        const userObj = (match.user as Record<string, unknown> | undefined) || match;
        return (
          (match.userId as number | string | undefined) ??
          (userObj?.user_id as number | string | undefined) ??
          (userObj?.id as number | string | undefined) ??
          (match.id as number | string | undefined)
        );
      }
    }
    return undefined;
  };

  const effectiveUserId = getEffectiveUserId();
  const myMembership = members.find(
    (m) => effectiveUserId !== undefined && String(m.userId) === String(effectiveUserId)
  );

  const isAdmin =
    myMembership?.role === "admin" ||
    (rawGroupData?.created_by !== undefined &&
      rawGroupData?.created_by !== null &&
      effectiveUserId !== undefined &&
      String(rawGroupData.created_by) === String(effectiveUserId));

  const isCustomGroup = channel.groupType === "custom" || !channel.groupType;

  // Fallback if direct chat has no members array loaded
  const displayMembers: GroupMemberItem[] =
    members.length > 0
      ? members
      : [
          {
            userId: "peer",
            role: "member",
            name: channel.name,
            email: "",
          },
        ];

  const handleCopyId = () => {
    if (!channel?.id) return;
    navigator.clipboard.writeText(channel.id);
    setCopiedId(true);
    toast.success("Channel ID copied to clipboard");
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleRemoveMember = async (targetUserId: number | string) => {
    if (!channel?.id) return;
    try {
      setRemovingUserId(targetUserId);
      await removeGroupMemberApi(channel.id, targetUserId);
      toast.success("Member removed from channel");
      onMemberRemoved?.(targetUserId);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to remove member");
    } finally {
      setRemovingUserId(null);
    }
  };

  const handleLeaveGroup = async () => {
    if (!channel?.id || effectiveUserId === undefined) return;
    try {
      setIsLeaving(true);
      await removeGroupMemberApi(channel.id, effectiveUserId);
      toast.success("You left the channel");
      onClose();
      onOpenDelete();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to leave channel");
    } finally {
      setIsLeaving(false);
    }
  };

  const projectName = (groupDetails?.projectName || channel.projectName) as string | undefined;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md border-v2-neutral-400 bg-v2-neutral-600 text-v2-neutral-100 p-0 overflow-hidden sm:rounded-2xl">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-v2-neutral-500">
          <div className="flex items-center gap-3.5">
            <Avatar className="size-12 border border-v2-neutral-400 bg-v2-neutral-500 text-sm font-bold text-v2-neutral-100 shrink-0">
              <AvatarFallback>
                {(channel.name || "CH")
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <DialogTitle className="truncate text-base font-semibold text-v2-neutral-100">
                  {channel.name}
                </DialogTitle>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider border ${
                    isGroup
                      ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                      : "bg-sky-500/15 text-sky-300 border-sky-500/30"
                  }`}
                >
                  {isGroup ? channel.groupType || "Group" : "Direct"}
                </span>
              </div>
              <DialogDescription className="text-xs text-v2-neutral-400 mt-0.5">
                {isGroup
                  ? `${members.length} participating members`
                  : "Direct 1-on-1 discussion channel"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="p-6 pt-4 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {/* Linked Project (if applicable) */}
          {projectName && (
            <div className="rounded-xl border border-v2-neutral-500/60 bg-v2-neutral-500/30 p-3 flex items-center gap-2.5">
              <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-v2-neutral-500 text-sky-400 border border-v2-neutral-400/30">
                <FolderKanban className="size-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-semibold text-v2-neutral-400 block tracking-wider">
                  Linked Project
                </span>
                <p className="text-xs font-semibold text-v2-neutral-100 truncate">
                  {projectName}
                </p>
              </div>
            </div>
          )}

          {/* Description / Purpose */}
          {typeof groupDetails?.description === "string" && groupDetails.description.trim() ? (
            <div className="rounded-xl border border-v2-neutral-400 bg-v2-neutral-500/40 p-3 text-xs leading-relaxed text-v2-neutral-300">
              <span className="font-semibold text-v2-neutral-200 block mb-0.5">
                Channel Purpose
              </span>
              {groupDetails.description}
            </div>
          ) : !isGroup ? (
            <div className="rounded-xl border border-v2-neutral-500/60 bg-v2-neutral-500/25 p-3 text-xs text-v2-neutral-300 leading-relaxed">
              <span className="font-semibold text-v2-neutral-200 block mb-0.5">
                Direct Discussion
              </span>
              End-to-end direct communication with audio/video calls and real-time document sharing.
            </div>
          ) : null}

          {/* Channel ID & Security Info */}
          <div className="rounded-xl border border-v2-neutral-500/60 bg-v2-neutral-500/20 p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Shield className="size-3.5 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-v2-neutral-400 block">Channel ID</span>
                <span className="font-mono text-[11px] text-v2-neutral-300 truncate block max-w-[190px] sm:max-w-[240px]">
                  {channel.id}
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopyId}
              className="h-7 px-2 text-[11px] gap-1 text-v2-neutral-300 hover:text-v2-neutral-100 hover:bg-v2-neutral-500/50 cursor-pointer"
              title="Copy Channel ID"
            >
              {copiedId ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>

          {/* Participants List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Users className="size-3.5 text-v2-neutral-400" />
                <h4 className="text-xs font-semibold text-v2-neutral-300">
                  Participants ({displayMembers.length})
                </h4>
              </div>
              {isGroup && isAdmin && isCustomGroup && onOpenAddMember && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onOpenAddMember}
                  className="h-7 text-xs gap-1 border-v2-neutral-400 text-v2-neutral-200 hover:bg-v2-neutral-500 cursor-pointer"
                >
                  <UserPlus className="size-3" />
                  <span>Add Member</span>
                </Button>
              )}
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
              {displayMembers.map((member) => {
                const isMemberAdmin = member.role === "admin";
                const isThisMe =
                  effectiveUserId !== undefined && String(member.userId) === String(effectiveUserId);

                return (
                  <div
                    key={String(member.userId || member.id || member.name)}
                    className="flex items-center justify-between rounded-xl border border-v2-neutral-500/50 bg-v2-neutral-500/20 p-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="size-7.5 border border-v2-neutral-400 bg-v2-neutral-500 text-[10px] font-bold">
                        <AvatarFallback>
                          {(member.name || "U")
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-v2-neutral-100">
                          {member.name} {isThisMe && <span className="text-v2-neutral-400">(You)</span>}
                        </p>
                        {member.email && (
                          <p className="truncate text-[10px] text-v2-neutral-400">
                            {member.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold border ${
                          isMemberAdmin
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-v2-neutral-500 text-v2-neutral-300 border-v2-neutral-400"
                        }`}
                      >
                        {isGroup
                          ? isMemberAdmin
                            ? "Admin"
                            : "Member"
                          : isThisMe
                          ? "You"
                          : "Direct Contact"}
                      </span>

                      {isGroup && isAdmin && !isThisMe && isCustomGroup && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(member.userId)}
                          disabled={removingUserId === member.userId}
                          className="size-7 rounded-lg text-v2-neutral-400 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                          title="Remove member"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-4 border-t border-v2-neutral-500 bg-v2-neutral-600/90 flex items-center justify-between sm:justify-between">
          <div className="flex items-center gap-2">
            {isGroup && isAdmin && isCustomGroup && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onOpenEdit}
                  className="text-xs gap-1 border-v2-neutral-400 cursor-pointer"
                >
                  <Edit3 className="size-3.5" />
                  <span>Edit</span>
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={onOpenDelete}
                  className="text-xs gap-1 cursor-pointer"
                  title="Permanently delete group for everyone"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete Group</span>
                </Button>
              </>
            )}

            {isGroup && !isAdmin && isCustomGroup && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLeaveGroup}
                disabled={isLeaving}
                className="text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
              >
                <LogOut className="size-3.5 mr-1" />
                <span>Leave Channel</span>
              </Button>
            )}

            {onOpenDeleteChatForMe && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenDeleteChatForMe();
                }}
                className="text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer gap-1"
                title="Delete chat history for you only"
              >
                <Trash2 className="size-3.5" />
                <span>Delete Chat for Me</span>
              </Button>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs cursor-pointer"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export interface EditChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: ChatChannel | null;
  rawGroupData?: Record<string, unknown> | null;
  onSaveSuccess: (updated: { name: string; description?: string; avatarUrl?: string }) => void;
}

export function EditChatModal({
  isOpen,
  onClose,
  channel,
  rawGroupData,
  onSaveSuccess,
}: EditChatModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (channel) {
      setName(channel.name || "");
      setDescription(
        typeof rawGroupData?.description === "string" ? rawGroupData.description : ""
      );
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
      });

      toast.success("Channel settings updated");
      onSaveSuccess({ name: name.trim(), description: description.trim() });
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update channel");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md border-v2-neutral-400 bg-v2-neutral-600 text-v2-neutral-100 p-0 overflow-hidden sm:rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-v2-neutral-500">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-v2-neutral-500 text-v2-neutral-100 border border-v2-neutral-400 shadow-xs">
              <Edit3 className="size-4.5" />
            </span>
            <div>
              <DialogTitle className="text-base font-semibold text-v2-neutral-100">
                Edit Channel Settings
              </DialogTitle>
              <DialogDescription className="text-xs text-v2-neutral-400 mt-0.5">
                Update channel display name and objectives
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <Field>
              <FieldLabel className="text-xs font-semibold text-v2-neutral-300">
                Channel Name <span className="text-rose-400">*</span>
              </FieldLabel>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 w-full rounded-xl border border-v2-neutral-400 bg-v2-neutral-500/40 px-3 text-xs text-v2-neutral-100 placeholder:text-v2-neutral-400 outline-none transition focus:border-v2-neutral-300 focus:ring-2 focus:ring-v2-neutral-400/25"
                required
              />
            </Field>

            <Field>
              <FieldLabel className="text-xs font-semibold text-v2-neutral-300">
                Topic / Purpose
              </FieldLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-v2-neutral-400 bg-v2-neutral-500/40 p-2.5 text-xs text-v2-neutral-100 placeholder:text-v2-neutral-400 outline-none transition focus:border-v2-neutral-300 focus:ring-2 focus:ring-v2-neutral-400/25 resize-none"
              />
            </Field>
          </div>

          <DialogFooter className="p-4 border-t border-v2-neutral-500 bg-v2-neutral-600/90 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !name.trim()}
              className="text-xs"
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export interface DeleteChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: ChatChannel | null;
  onDeleteSuccess: (deletedId: string) => void;
}

export function DeleteChatModal({
  isOpen,
  onClose,
  channel,
  onDeleteSuccess,
}: DeleteChatModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !channel) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCustomGroupApi(channel.id);
      toast.success("Channel deleted successfully");
      onDeleteSuccess(channel.id);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete channel");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
      <AlertDialogContent className="max-w-md border-v2-neutral-400 bg-v2-neutral-600 text-v2-neutral-100">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <AlertDialogTitle className="text-base font-semibold text-v2-neutral-100">
                Delete &ldquo;{channel.name}&rdquo;?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-v2-neutral-400 mt-1">
                Are you sure you want to permanently delete this channel? All chat records, shared deliverables, and membership allocations will be erased.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel
            disabled={isDeleting}
            onClick={onClose}
            className="text-xs border-v2-neutral-400 text-v2-neutral-200 hover:bg-v2-neutral-500"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={handleDelete}
            className="text-xs bg-rose-600 text-white hover:bg-rose-500"
          >
            {isDeleting ? "Deleting Channel..." : "Delete Permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export interface DeleteChatForMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: ChatChannel | null;
  onConfirm: (groupId: string) => Promise<void>;
}

export function DeleteChatForMeModal({
  isOpen,
  onClose,
  channel,
  onConfirm,
}: DeleteChatForMeModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !channel) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm(channel.id);
      onClose();
    } catch {
      // toast is already handled by caller
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
      <AlertDialogContent className="max-w-md border-v2-neutral-400 bg-v2-neutral-600 text-v2-neutral-100">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <AlertDialogTitle className="text-base font-semibold text-v2-neutral-100">
                Delete chat history for &ldquo;{channel.name}&rdquo;?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-v2-neutral-400 mt-1 leading-relaxed">
                This will delete and hide previous message history in this chat for your account. It will not remove your membership or affect other participants. The chat will reappear if a newer message is sent or received.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel
            disabled={isDeleting}
            onClick={onClose}
            className="text-xs border-v2-neutral-400 text-v2-neutral-200 hover:bg-v2-neutral-500 cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={handleDelete}
            className="text-xs bg-rose-600 text-white hover:bg-rose-500 cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete Chat for Me"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: ChatChannel | null;
  existingMemberIds?: Array<number | string>;
  onMembersAdded?: () => void;
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
  const [employees, setEmployees] = useState<AllEmployeeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    const loadCandidates = async () => {
      try {
        setIsLoading(true);
        const data = await getAllEmployeesApi();
        if (!active) return;

        const stringExisting = new Set(existingMemberIds.map((id) => String(id)));
        const available = data.filter((e) => !stringExisting.has(String(e.user_id)));
        setEmployees(available);
      } catch (err) {
        console.error("Failed to load candidate members:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadCandidates();
    return () => {
      active = false;
    };
  }, [isOpen, existingMemberIds]);

  if (!isOpen || !channel) return null;

  const filteredEmployees = employees.filter((emp) => {
    const name = emp.name || `${emp.first_name || ""} ${emp.last_name || ""}`;
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || (emp.email && emp.email.toLowerCase().includes(q));
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddMembers = async () => {
    if (selectedIds.length === 0) return;
    try {
      setIsSubmitting(true);
      await addGroupMembersApi(channel.id, selectedIds);
      toast.success(`${selectedIds.length} member(s) added to channel`);
      setSelectedIds([]);
      onMembersAdded?.();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add members");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md border-v2-neutral-400 bg-v2-neutral-600 text-v2-neutral-100 p-0 overflow-hidden sm:rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-v2-neutral-500">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-v2-neutral-500 text-v2-neutral-100 border border-v2-neutral-400 shadow-xs">
              <UserPlus className="size-4.5" />
            </span>
            <div>
              <DialogTitle className="text-base font-semibold text-v2-neutral-100">
                Add Participants
              </DialogTitle>
              <DialogDescription className="text-xs text-v2-neutral-400 mt-0.5">
                Invite team members into {channel.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-v2-neutral-400" />
            <input
              type="text"
              placeholder="Search colleagues by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-xl border border-v2-neutral-400 bg-v2-neutral-500/40 pl-8.5 pr-3 text-xs text-v2-neutral-100 placeholder:text-v2-neutral-400 outline-none transition focus:border-v2-neutral-300 focus:ring-2 focus:ring-v2-neutral-400/25"
            />
          </div>

          {/* Candidates list */}
          <div className="max-h-56 overflow-y-auto custom-scrollbar space-y-1">
            {isLoading ? (
              <p className="py-6 text-center text-xs text-v2-neutral-400">Loading colleagues...</p>
            ) : filteredEmployees.length === 0 ? (
              <p className="py-6 text-center text-xs text-v2-neutral-400">
                No eligible colleagues found.
              </p>
            ) : (
              filteredEmployees.map((emp) => {
                const empId = String(emp.user_id);
                const isSelected = selectedIds.includes(empId);
                const name = emp.name || `${emp.first_name || ""} ${emp.last_name || ""}`.trim() || "Teammate";
                const initials = name
                  .split(" ")
                  .map((p: string) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={empId}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSelect(empId)}
                    className={`flex items-center justify-between rounded-xl p-2.5 text-xs transition border cursor-pointer ${
                      isSelected
                        ? "bg-v2-neutral-500 text-v2-neutral-100 border-v2-neutral-400"
                        : "hover:bg-v2-neutral-500/30 text-v2-neutral-300 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="size-7 text-[10px] font-bold">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-v2-neutral-100">{name}</p>
                        {emp.email && (
                          <p className="truncate text-[10px] text-v2-neutral-400">{emp.email}</p>
                        )}
                      </div>
                    </div>

                    <div
                      className={`flex size-4.5 items-center justify-center rounded border transition ${
                        isSelected
                          ? "bg-v2-neutral-100 border-v2-neutral-100 text-v2-neutral-600"
                          : "border-v2-neutral-400 bg-v2-neutral-500/40"
                      }`}
                    >
                      {isSelected && <Check className="size-3" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

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
            disabled={isSubmitting || selectedIds.length === 0}
            onClick={handleAddMembers}
            className="text-xs"
          >
            {isSubmitting
              ? "Adding..."
              : `Add ${selectedIds.length > 0 ? `(${selectedIds.length})` : ""} Members`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
