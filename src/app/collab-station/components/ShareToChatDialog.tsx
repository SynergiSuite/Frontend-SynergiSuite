"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  FolderKanban,
  MessageSquare,
  Search,
  Send,
  Users,
  AlertCircle,
  Loader2,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CollabGroup, SharedEntityType } from "../types";
import { getProjectGroupApi } from "../apis/getProjectGroupApi";
import { getCollabGroupsApi } from "../apis/getCollabGroupsApi";
import { emitShareMessage } from "../apis/shareToChatSocket";
import { isClientRole } from "../helpers/mainHelper";

export interface ShareToChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: SharedEntityType;
  entityId: string;
  projectId?: string;
  itemTitle?: string;
}

type DestinationTab = "project" | "other";

export default function ShareToChatDialog({
  open,
  onOpenChange,
  entityType,
  entityId,
  projectId,
  itemTitle,
}: ShareToChatDialogProps) {
  const router = useRouter();

  // Role check: Hide completely for client roles
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(isClientRole());
  }, []);

  const [activeTab, setActiveTab] = useState<DestinationTab>(projectId ? "project" : "other");
  const [note, setNote] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  // Project group state
  const [projectGroup, setProjectGroup] = useState<CollabGroup | null>(null);
  const [isLoadingProjectGroup, setIsLoadingProjectGroup] = useState(false);
  const [projectGroupError, setProjectGroupError] = useState<string | null>(null);

  // Other groups state
  const [allGroups, setAllGroups] = useState<CollabGroup[]>([]);
  const [isLoadingAllGroups, setIsLoadingAllGroups] = useState(false);
  const [allGroupsError, setAllGroupsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Submission & Error handling
  const [isSending, setIsSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load project group when dialog opens and projectId is available
  useEffect(() => {
    if (!open || !projectId) {
      setProjectGroup(null);
      return;
    }

    let isCancelled = false;
    setIsLoadingProjectGroup(true);
    setProjectGroupError(null);

    getProjectGroupApi(projectId)
      .then((group) => {
        if (isCancelled) return;
        setProjectGroup(group);
        if (group?.id) {
          setSelectedGroupId(group.id);
        }
      })
      .catch((err) => {
        if (isCancelled) return;
        setProjectGroupError(err instanceof Error ? err.message : "Failed to load project group");
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingProjectGroup(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [open, projectId]);

  // Load all groups when "other" tab is selected
  useEffect(() => {
    if (!open || activeTab !== "other" || allGroups.length > 0) return;

    let isCancelled = false;
    setIsLoadingAllGroups(true);
    setAllGroupsError(null);

    getCollabGroupsApi()
      .then((groups) => {
        if (isCancelled) return;
        setAllGroups(groups);
      })
      .catch((err) => {
        if (isCancelled) return;
        setAllGroupsError(err instanceof Error ? err.message : "Failed to load groups");
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingAllGroups(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [open, activeTab, allGroups.length]);

  // Filter groups
  const filteredGroups = useMemo(() => {
    if (!debouncedQuery) return allGroups;
    return allGroups.filter((g) =>
      g.name.toLowerCase().includes(debouncedQuery)
    );
  }, [allGroups, debouncedQuery]);

  // Reset dialog state when opening/closing
  useEffect(() => {
    if (open) {
      setServerError(null);
      setNote("");
      if (projectId) {
        setActiveTab("project");
      } else {
        setActiveTab("other");
      }
    }
  }, [open, projectId]);

  if (isClient) {
    return null;
  }

  const handleSelectTab = (tab: DestinationTab) => {
    setActiveTab(tab);
    setServerError(null);
    if (tab === "project") {
      if (projectGroup?.id) {
        setSelectedGroupId(projectGroup.id);
      }
    } else {
      if (selectedGroupId === projectGroup?.id) {
        setSelectedGroupId("");
      }
    }
  };

  const entityTypeLabel =
    entityType === "client_feedback"
      ? "Client Feedback"
      : entityType === "milestone"
      ? "Milestone"
      : "Task";

  const handleShare = async () => {
    if (!selectedGroupId) {
      setServerError("Please select a chat group to share with.");
      return;
    }

    try {
      setIsSending(true);
      setServerError(null);

      // Strictly according to contract: groupId, entityType, entityId, text (optional)
      const res = await emitShareMessage({
        groupId: selectedGroupId,
        entityType,
        entityId,
        text: note.trim() || undefined,
      });

      toast.success(`${entityTypeLabel} shared successfully!`);
      onOpenChange(false);

      const targetUrl = `/collab-station?chatId=${encodeURIComponent(
        selectedGroupId
      )}${res.messageId ? `&highlightMessageId=${encodeURIComponent(res.messageId)}` : ""}`;

      router.push(targetUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to share item";
      // Keep dialog open so user can pick another destination, no automatic retry
      setServerError(msg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[92vh] max-w-lg overflow-y-auto border border-v2-neutral-400 bg-v2-neutral-600 p-0 text-v2-neutral-100 shadow-2xl rounded-2xl custom-scrollbar"
      >
        {/* Header */}
        <DialogHeader className="border-b border-v2-neutral-500 bg-v2-neutral-600/95 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-xl border border-v2-neutral-400 bg-v2-neutral-500/50 text-v2-neutral-200 shadow-xs">
              <Share2 className="size-4" />
            </span>
            <div>
              <DialogTitle className="text-base font-semibold tracking-tight text-v2-neutral-100">
                Share {entityTypeLabel} to Collab Station
              </DialogTitle>
              {itemTitle && (
                <p className="text-xs text-v2-neutral-400 truncate max-w-xs sm:max-w-md mt-0.5">
                  &ldquo;{itemTitle}&rdquo;
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="space-y-4 px-6 py-5">
          {/* Destination Selector Tabs */}
          <div className="flex rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/30 p-1 text-xs">
            {projectId && (
              <button
                type="button"
                onClick={() => handleSelectTab("project")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-medium transition-all cursor-pointer ${
                  activeTab === "project"
                    ? "bg-v2-neutral-100 text-v2-neutral-600 font-semibold shadow-xs"
                    : "text-v2-neutral-300 hover:text-v2-neutral-100"
                }`}
              >
                <FolderKanban className="size-3.5 shrink-0" />
                <span>Project Group</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSelectTab("other")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-medium transition-all cursor-pointer ${
                activeTab === "other"
                  ? "bg-v2-neutral-100 text-v2-neutral-600 font-semibold shadow-xs"
                  : "text-v2-neutral-300 hover:text-v2-neutral-100"
              }`}
            >
              <Users className="size-3.5 shrink-0" />
              <span>Choose Another Chat</span>
            </button>
          </div>

          {/* Tab 1: Project Group Destination */}
          {activeTab === "project" && projectId && (
            <div className="space-y-3">
              {isLoadingProjectGroup ? (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/20 py-8 text-xs text-v2-neutral-300">
                  <Loader2 className="size-4 animate-spin text-v2-neutral-400" />
                  <span>Locating project channel...</span>
                </div>
              ) : projectGroup ? (
                <div
                  onClick={() => {
                    setSelectedGroupId(projectGroup.id);
                    setServerError(null);
                  }}
                  className={`flex items-center justify-between rounded-xl border p-3.5 transition-all cursor-pointer ${
                    selectedGroupId === projectGroup.id
                      ? "border-v2-neutral-200 bg-v2-neutral-500/70 text-v2-neutral-100 shadow-xs"
                      : "border-v2-neutral-500 bg-v2-neutral-500/30 text-v2-neutral-300 hover:border-v2-neutral-400 hover:bg-v2-neutral-500/50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-v2-neutral-400 bg-v2-neutral-500 text-xs font-bold text-v2-neutral-100">
                      <FolderKanban className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate text-v2-neutral-100">
                        {projectGroup.name}
                      </p>
                      <p className="text-xs text-v2-neutral-400 flex items-center gap-1.5 mt-0.5">
                        <span className="rounded-md border border-v2-neutral-500 bg-v2-neutral-500/50 px-1.5 py-0.2 text-[10px] font-medium uppercase tracking-wider text-v2-neutral-300">
                          Project Group
                        </span>
                        {projectGroup.membersCount !== undefined && (
                          <span>• {projectGroup.membersCount} participants</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                      selectedGroupId === projectGroup.id
                        ? "border-v2-neutral-100 bg-v2-neutral-100 text-v2-neutral-600"
                        : "border-v2-neutral-400 bg-transparent"
                    }`}
                  >
                    {selectedGroupId === projectGroup.id && <Check className="size-3" />}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/20 p-4 text-xs text-v2-neutral-300 space-y-2">
                  <p className="font-medium text-v2-neutral-200">
                    {projectGroupError || "No dedicated chat group found for this project."}
                  </p>
                  <p className="text-v2-neutral-400">
                    You can pick any active squad or channel from your groups list.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectTab("other")}
                    className="border-v2-neutral-400 text-xs text-v2-neutral-200 hover:bg-v2-neutral-500 hover:text-v2-neutral-100"
                  >
                    Browse Other Groups
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Choose Another Chat or Group */}
          {activeTab === "other" && (
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-v2-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats by title or group name..."
                  className="w-full rounded-xl border border-v2-neutral-400 bg-v2-neutral-500/30 pl-9 pr-3 py-2 text-xs text-v2-neutral-100 placeholder:text-v2-neutral-400 outline-none focus:border-v2-neutral-200 transition-colors"
                />
              </div>

              {/* Group List Container */}
              <div className="max-h-56 overflow-y-auto space-y-1.5 rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/20 p-2 custom-scrollbar">
                {isLoadingAllGroups ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-xs text-v2-neutral-300">
                    <Loader2 className="size-4 animate-spin text-v2-neutral-400" />
                    <span>Loading channels...</span>
                  </div>
                ) : allGroupsError ? (
                  <div className="p-4 text-center text-xs text-rose-300">
                    {allGroupsError}
                  </div>
                ) : filteredGroups.length === 0 ? (
                  <div className="p-6 text-center text-xs text-v2-neutral-400">
                    No matching groups found.
                  </div>
                ) : (
                  filteredGroups.map((group) => {
                    const isSelected = selectedGroupId === group.id;
                    const badgeLabel =
                      group.groupType === "project"
                        ? "Project"
                        : group.groupType === "team"
                        ? "Team"
                        : group.type === "direct"
                        ? "Direct"
                        : "Custom";

                    return (
                      <div
                        key={group.id}
                        onClick={() => {
                          setSelectedGroupId(group.id);
                          setServerError(null);
                        }}
                        className={`flex items-center justify-between rounded-lg p-2.5 transition-all cursor-pointer border ${
                          isSelected
                            ? "border-v2-neutral-200 bg-v2-neutral-500/70 text-v2-neutral-100"
                            : "border-transparent hover:bg-v2-neutral-500/40 text-v2-neutral-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="grid size-7.5 shrink-0 place-items-center rounded-lg border border-v2-neutral-400 bg-v2-neutral-500 text-[10px] font-bold text-v2-neutral-100">
                            {group.type === "direct" ? (
                              <MessageSquare className="size-3.5" />
                            ) : (
                              <Users className="size-3.5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate text-v2-neutral-100">
                              {group.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="rounded-md border border-v2-neutral-500 bg-v2-neutral-500/60 px-1.5 py-0.2 text-[9px] font-medium uppercase tracking-wider text-v2-neutral-300">
                                {badgeLabel}
                              </span>
                              {group.membersCount !== undefined && (
                                <span className="text-[10px] text-v2-neutral-400">
                                  {group.membersCount} members
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`grid size-4.5 shrink-0 place-items-center rounded-full border ${
                            isSelected
                              ? "border-v2-neutral-100 bg-v2-neutral-100 text-v2-neutral-600"
                              : "border-v2-neutral-400 bg-transparent"
                          }`}
                        >
                          {isSelected && <Check className="size-2.5" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Optional Note Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-v2-neutral-300">
              Optional Note
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add context or questions for the group (e.g., Please review priority blocker)..."
              className="w-full resize-none rounded-xl border border-v2-neutral-400 bg-v2-neutral-500/30 p-2.5 text-xs text-v2-neutral-100 placeholder:text-v2-neutral-400 outline-none focus:border-v2-neutral-200 transition-colors"
            />
          </div>

          {/* Server Error Message */}
          {serverError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="size-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-rose-200">Unable to share item</p>
                <p className="mt-0.5 leading-relaxed">{serverError}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="border-t border-v2-neutral-500 bg-v2-neutral-600/90 px-6 py-4 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
            className="border-v2-neutral-400 text-v2-neutral-200 hover:bg-v2-neutral-500 hover:text-v2-neutral-100 text-xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleShare}
            disabled={isSending || !selectedGroupId}
            className="gap-2 bg-v2-neutral-100 text-v2-neutral-600 hover:bg-v2-neutral-200 font-semibold text-xs shadow-sm cursor-pointer disabled:opacity-40"
          >
            {isSending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Send className="size-3.5" />
            )}
            <span>{isSending ? "Sharing..." : "Send to Group"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
