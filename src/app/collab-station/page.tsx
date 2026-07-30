"use client";
import { socket } from "@/lib/socket";
import React, { useState, useEffect, useRef } from "react";
import { getMessagesApi } from "./apis/DirectChats/getMessageApi";
import { CreateDirectChatApi } from "./apis/DirectChats/createDirectChatsApi";
import { createCustomGroupApi } from "./apis/DirectChats/CustomGroups/createCustomGroupApi";
import { sendMessageApi } from "./apis/DirectChats/sendMessageApi";
import { deleteMessageApi } from "./apis/DirectChats/deleteMessageApi";
import { getPresignedUrlApi } from "../cloud/apis/getPresignedUrlApi";
import { gsap } from "gsap";
import ChatWindow from "./ChatWindow";
import RightSidebar from "./RightSidebar";
import CallOverlay from "./CallOverlay";
import NewChatModal from "./NewChatModal";
import LoaderCustom from "@/components/ui/loader-custom";
import { ChatChannel, Message, ChatThreadMap, Attachment } from "./types";
import { CallAcknowledgement, CallDto, CallTokenResponse } from "./callTypes";
import { getCallToken, getCurrentCall } from "./apis/callApi";
import { toast } from "sonner";
import { authHeaders, backendBaseUrl, getAccessToken, readTokenUser, TokenUser, UserId } from "./helpers/mainHelper";
import { formatMissedCallMessage, getMissedCallPreview } from "./helpers/callHelperFunctions";
import { formatChatTime, formatMessage, getUploadedFileUrl } from "./helpers/chatHelperFunctions";
import { ChatDetailsModal, EditChatModal, DeleteChatModal, AddMemberModal } from "./popupModels";
import { playNotificationSound as triggerGlobalSound } from "@/lib/soundUtils";
import { getChatUploadUrlApi } from "./apis/getChatUploadUrlApi";




export default function CollabStationPage() {
  const [activeChannelId, setActiveChannelId] = useState("");
  const [groups, setGroups] = useState<ChatChannel[]>([]);
  const [recentChats, setRecentChats] = useState<ChatChannel[]>([]);
  const [threads, setThreads] = useState<ChatThreadMap>({});
  const [currentCall, setCurrentCall] = useState<CallDto | null>(null);
  const [callSide, setCallSide] = useState<"caller" | "recipient" | undefined>();
  const [callCredentials, setCallCredentials] = useState<CallTokenResponse | null>(null);
  const [callError, setCallError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  // Popups state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [rawGroupsDataMap, setRawGroupsDataMap] = useState<Record<string, any>>({});
  const [currentUserId, setCurrentUserId] = useState<UserId | undefined>();

  const containerRef = useRef<HTMLDivElement>(null);
  const currentUserRef = useRef<TokenUser>({});
  const currentUserIdRef = useRef<UserId | undefined>(undefined);
  const chatIdsRef = useRef<string[]>([]);
  const tokenRequestCallIdRef = useRef<string | null>(null);
  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);
  const notificationAudioUnlockedRef = useRef(false);

  const setCurrentUserIdentity = (userId?: UserId) => {
    if (userId === undefined || userId === null) return;
    currentUserIdRef.current = userId;
    setCurrentUserId(userId);
  };

  // Reads the token, parses it, and syncs both the ref (for sync access in
  // callbacks/sockets) and state (for renders). Returns the token + parsed user
  // so callers needing the raw token (e.g. for Authorization headers) don't
  // have to re-read the cookie.
  const identifyCurrentUser = () => {
    const token = getAccessToken();
    const user = token ? readTokenUser(token) : {};
    currentUserRef.current = user;
    setCurrentUserIdentity(user.user_id ?? user.sub);
    return { token, user };
  };

  const isCurrentUser = (userId?: UserId) =>
    userId !== undefined &&
    currentUserIdRef.current !== undefined &&
    String(userId) === String(currentUserIdRef.current);

  const getCallSide = (call: CallDto): "caller" | "recipient" | undefined => {
    if (isCurrentUser(call.caller.user_id)) return "caller";
    if (isCurrentUser(call.recipient.user_id)) return "recipient";
    return undefined;
  };

  const playNotificationSound = () => {
    triggerGlobalSound();
  };

  useEffect(() => {
    const audio = new Audio("/sounds/sound.wav");
    audio.preload = "auto";
    audio.volume = 0.65;
    notificationAudioRef.current = audio;

    const unlockAudio = () => {
      audio.muted = true;
      void audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
          notificationAudioUnlockedRef.current = true;
        })
        .catch(() => undefined);
    };

    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      audio.pause();
      notificationAudioRef.current = null;
      notificationAudioUnlockedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const { token } = identifyCurrentUser();
    const joinKnownGroups = () => {
      chatIdsRef.current.forEach((groupId) => {
        socket.emit("group:join", { groupId });
      });
    };

    if (token) {
      socket.auth = { token };
      if (!socket.connected) socket.connect();
      else joinKnownGroups();
    }

    socket.on("connect", joinKnownGroups);

    return () => {
      socket.off("connect", joinKnownGroups);
    };
  }, []);

  useEffect(() => {
    const isCallParticipant = (call: CallDto) =>
      isCurrentUser(call.caller.user_id) || isCurrentUser(call.recipient.user_id);

    const setTerminalCall = (call: CallDto) => {
      if (!isCallParticipant(call)) return;
      setCallSide(getCallSide(call));
      setCurrentCall(call);
      setCallCredentials(null);
      tokenRequestCallIdRef.current = null;
      window.setTimeout(() => {
        setCurrentCall(null);
        setCallSide(undefined);
      }, 1200);
    };

    const onIncoming = (call: CallDto) => {
      if (!isCurrentUser(call.recipient.user_id)) return;
      playNotificationSound();
      setCallSide("recipient");
      setCallError("");
      setCurrentCall(call);
    };
    const onRinging = (call: CallDto) => {
      if (!isCurrentUser(call.caller.user_id)) return;
      setCallSide("caller");
      setCurrentCall(call);
    };
    const onAccepted = (call: CallDto) => {
      if (!isCallParticipant(call)) return;
      setCallSide(getCallSide(call));
      setCallError("");
      setCurrentCall(call);
    };
    const onError = (payload: { message?: string; error?: { message?: string } }) =>
      setCallError(payload.error?.message || payload.message || "Call operation failed");

    socket.on("call:incoming", onIncoming);
    socket.on("call:ringing", onRinging);
    socket.on("call:accepted", onAccepted);
    socket.on("call:rejected", setTerminalCall);
    socket.on("call:cancelled", setTerminalCall);
    socket.on("call:missed", setTerminalCall);
    socket.on("call:ended", setTerminalCall);
    socket.on("call:error", onError);

    getCurrentCall()
      .then(async (call) => {
        if (!call) return;
        const token = getAccessToken();
        const email = token ? readTokenUser(token).email : undefined;
        if (email) {
          const response = await fetch(
            `${backendBaseUrl}/collab-station/groups/${call.groupId}`,
            { headers: authHeaders(token) }
          );
          if (response.ok) {
            const group = await response.json();
            const me = group.members?.find((member: any) => member.user?.email === email);
            setCurrentUserIdentity(me?.userId);
          }
        }
        const restoredSide = getCallSide(call);
        if (!restoredSide) return;
        setCallSide(restoredSide);
        setCurrentCall(call);
      })
      .catch(() => undefined);

    return () => {
      socket.off("call:incoming", onIncoming);
      socket.off("call:ringing", onRinging);
      socket.off("call:accepted", onAccepted);
      socket.off("call:rejected", setTerminalCall);
      socket.off("call:cancelled", setTerminalCall);
      socket.off("call:missed", setTerminalCall);
      socket.off("call:ended", setTerminalCall);
      socket.off("call:error", onError);
    };
  }, []);

  // Centralized so an accept acknowledgement and the `call:accepted` broadcast
  // cannot create two LiveKit room connections.
  useEffect(() => {
    if (!currentCall || currentCall.status !== "active" || callCredentials) return;
    if (tokenRequestCallIdRef.current === currentCall.callId) return;

    let cancelled = false;
    tokenRequestCallIdRef.current = currentCall.callId;
    getCallToken(currentCall.callId)
      .then((credentials) => {
        if (!cancelled) setCallCredentials(credentials);
      })
      .catch((error) => {
        tokenRequestCallIdRef.current = null;
        if (!cancelled) {
          setCallError(error instanceof Error ? error.message : "Unable to join the voice call");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentCall, callCredentials]);

  const emitCallEvent = async (event: string, payload: Record<string, string>) => {
    if (!socket.connected) throw new Error("Call signaling is disconnected");
    const acknowledgement = (await socket
      .timeout(10_000)
      .emitWithAck(event, payload)) as CallAcknowledgement;
    if (!acknowledgement.success || !acknowledgement.call) {
      throw new Error(acknowledgement.error?.message || "Call operation failed");
    }
    return acknowledgement.call;
  };

  const handleStartCall = async () => {
    if (!activeChannel || activeChannel.type !== "direct") {
      setCallError("Voice calls are currently available for direct chats only");
      return;
    }
    try {
      setCallError("");
      setCallSide("caller");
      setCurrentCall(await emitCallEvent("call:invite", { groupId: activeChannel.id }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start call";
      setCallError(message);
      toast.error(message);
    }
  };

  const handleAcceptCall = async () => {
    if (!currentCall) return;
    try {
      const call = await emitCallEvent("call:accept", { callId: currentCall.callId });
      setCallSide("recipient");
      setCurrentCall(call);
    } catch (error) {
      setCallError(error instanceof Error ? error.message : "Unable to accept call");
    }
  };

  const handleCallAction = async (event: "call:reject" | "call:cancel" | "call:end") => {
    if (!currentCall) return;
    try {
      const call = await emitCallEvent(event, { callId: currentCall.callId });
      setCallSide(getCallSide(call));
      setCurrentCall(call);
      setCallCredentials(null);
      tokenRequestCallIdRef.current = null;
      window.setTimeout(() => {
        setCurrentCall(null);
        setCallSide(undefined);
      }, 600);
    } catch (error) {
      setCallError(error instanceof Error ? error.message : "Unable to update call");
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".collab-panel-wrapper",
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "power3.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { token, user: currentUser } = identifyCurrentUser();

        const res = await fetch(`${backendBaseUrl}/collab-station/groups`, {
          headers: authHeaders(token),
        });

        const data = await res.json();

        let loadedGroups: any[] = [];
        let loadedDirects: any[] = [];

        if (Array.isArray(data)) {
          const rawMap: Record<string, any> = {};
          data.forEach((c) => {
            if (c.id) rawMap[c.id] = c;
          });
          setRawGroupsDataMap(rawMap);

          const mappedChats = data.map((c) => {
            const otherMember =
              c.type === "direct"
                ? c.members?.find((member: any) => {
                    const user = member.user || {};
                    const myId = currentUser.user_id ?? currentUser.sub;
                    return myId ? member.userId !== myId : user.email !== currentUser.email;
                  })
                : undefined;
            const displayUser = otherMember?.user;
            const missedCalls = Array.isArray(c.missedCalls) ? c.missedCalls : [];
            const latestMissedCall = missedCalls[0];
            const latestMessageText = c.latestMessage?.m_text;
            const latestMessageTime = c.latestMessage?.m_createdAt;

            return {
              id: c.id,
              name: c.type === "direct" ? displayUser?.name || displayUser?.email || "Unknown user" : c.name,
              type: c.type,
              groupType: c.type === "direct" ? undefined : c.type,
              lastMessage:
                latestMessageText || getMissedCallPreview(latestMissedCall, currentUser) || "No messages yet",
              time: formatChatTime(latestMessageTime || latestMissedCall?.endedAt || latestMissedCall?.createdAt),
              unreadCount: 0,
              status: "online",
              avatar:
                c.avatarUrl ||
                (displayUser?.name
                  ? displayUser.name.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase()
                  : undefined),
              membersCount: c.members?.length || 0,
              missedCalls,
              missedCallCount: c.missedCallCount ?? missedCalls.length,
            };
          });

          loadedGroups = mappedChats.filter((c) => c.type !== "direct");
          loadedDirects = mappedChats.filter((c) => c.type === "direct");
        } else {
          loadedGroups = data.groups || [];
          loadedDirects = data.directChats || [];
        }

          setGroups(loadedGroups);
          setRecentChats(loadedDirects);
          const loadedChats = [...loadedGroups, ...loadedDirects];
          chatIdsRef.current = loadedChats.map((chat) => chat.id);
          
          const targetActiveId = activeChannelId && loadedChats.some((chat) => chat.id === activeChannelId)
            ? activeChannelId
            : loadedChats[0]?.id || "";
            
          setActiveChannelId(targetActiveId);

          if (targetActiveId) {
            setGroups((prev) =>
              prev.map((g) => (g.id === targetActiveId ? { ...g, missedCallCount: 0, unreadCount: 0 } : g))
            );
            setRecentChats((prev) =>
              prev.map((c) => (c.id === targetActiveId ? { ...c, missedCallCount: 0, unreadCount: 0 } : c))
            );
          }

        if (socket.connected) {
          chatIdsRef.current.forEach((groupId) => {
            socket.emit("group:join", { groupId });
          });
        }
      } catch (err) {
        console.log("Failed to load chats", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (!activeChannelId) return;

    // Reset missed call count and unread badge for the currently selected active channel
    setGroups((prev) =>
      prev.map((g) => (g.id === activeChannelId ? { ...g, missedCallCount: 0, unreadCount: 0 } : g))
    );
    setRecentChats((prev) =>
      prev.map((c) => (c.id === activeChannelId ? { ...c, missedCallCount: 0, unreadCount: 0 } : c))
    );

    socket.emit("group:join", { groupId: activeChannelId });

    let cancelled = false;
    getMessagesApi(activeChannelId)
      .then((data) => {
        if (cancelled) return;
        const messages = Array.isArray(data) ? data : data.messages || [];
        setThreads((prev) => ({
          ...prev,
          [activeChannelId]: messages.map((message: any) => formatMessage(message, currentUserRef.current)),
        }));
      })
      .catch((err) => console.log("Failed to load messages", err));

    return () => {
      cancelled = true;
    };
  }, [activeChannelId]);

  useEffect(() => {
    const receiveMessage = (message: any) => {
      const roomId = message.groupId;
      const formatted = formatMessage(message, currentUserRef.current);
      if (formatted.sender !== "me") {
        playNotificationSound();
      }

      setThreads((prev) => {
        const roomThreads = prev[roomId] || [];

        // Find matching temporary message by text or attachment name — if
        // found, this incoming message is actually our own echoing back.
        const tempIndexToRemove = roomThreads.findIndex((m) => {
          if (!m.id.startsWith("temp-")) return false;
          const textMatch = m.text && formatted.text && m.text === formatted.text;
          const attachmentMatch =
            m.attachment?.name && formatted.attachment?.name && m.attachment.name === formatted.attachment.name;
          return textMatch || attachmentMatch;
        });

        if (tempIndexToRemove !== -1) {
          formatted.sender = "me";
        }

        const newThreads = roomThreads.filter((item, idx) => item.id !== formatted.id && idx !== tempIndexToRemove);

        return {
          ...prev,
          [roomId]: [...newThreads, formatted],
        };
      });
    };

    const handleMessageDeleted = (data: { messageId: string; groupId: string }) => {
      setThreads((prev) => ({
        ...prev,
        [data.groupId]: (prev[data.groupId] || []).filter((item) => item.id !== data.messageId),
      }));
    };

    socket.on("message:received", receiveMessage);
    socket.on("message:deleted", handleMessageDeleted);

    return () => {
      socket.off("message:received", receiveMessage);
      socket.off("message:deleted", handleMessageDeleted);
    };
  }, []);

  const activeChannel =
    groups.find((g) => g.id === activeChannelId) || recentChats.find((c) => c.id === activeChannelId);

  const activeMessages = threads[activeChannelId] || [];
  const activeMissedCallMessages =
    activeChannel?.missedCalls?.map((call) => formatMissedCallMessage(call, currentUserRef.current)) || [];
  const visibleMessages = [...activeMissedCallMessages, ...activeMessages];
  
  const handleSelectChannel = (id: string) => {
    setActiveChannelId(id);
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, missedCallCount: 0, unreadCount: 0 } : g))
    );
    setRecentChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, missedCallCount: 0, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = async (text: string, attachment?: Attachment) => {
    if (!activeChannel) return;

    try {
      const timeString = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

      if (!socket.connected) {
        throw new Error("Chat connection is not available");
      }

      const tempId = `temp-${Date.now()}`;
      const previewUrl = attachment?.file ? URL.createObjectURL(attachment.file) : attachment?.url;

      const tempMessage: Message = {
        id: tempId,
        sender: "me",
        senderName: "Me",
        text,
        time: timeString,
        avatar: "",
        attachment: attachment
          ? { name: attachment.name, size: attachment.size, type: attachment.type, url: previewUrl || "" }
          : undefined,
      };

      setThreads((prev) => ({
        ...prev,
        [activeChannel.id]: [...(prev[activeChannel.id] || []), tempMessage],
      }));

      const lastMsgDisplay = attachment ? `Sent a file: ${attachment.name}` : text;

      setGroups((prev) =>
        prev.map((g) => (g.id === activeChannel.id ? { ...g, lastMessage: `Me: ${lastMsgDisplay}`, time: timeString } : g))
      );

      setRecentChats((prev) =>
        prev.map((c) => (c.id === activeChannel.id ? { ...c, lastMessage: `Me: ${lastMsgDisplay}`, time: timeString } : c))
      );

      let finalFilePath = attachment?.url;

      if (attachment?.file) {
        // 1. Get presigned upload URL & relative filePath from /resources/chat/upload-url
        const { uploadUrl, filePath } = await getChatUploadUrlApi(
          attachment.file.name,
          attachment.file.type || "application/octet-stream"
        );

        // 2. Upload file directly to MinIO/S3 via PUT
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": attachment.file.type || "application/octet-stream",
          },
          body: attachment.file,
        });

        if (!uploadRes.ok) {
          // Clean up optimistic temp message on upload failure
          setThreads((prev) => ({
            ...prev,
            [activeChannel.id]: (prev[activeChannel.id] || []).filter((m) => m.id !== tempId),
          }));
          toast.error("Failed to upload attachment file");
          return;
        }

        finalFilePath = filePath;

        // 3. Send socket chat message using filePath (relative path, not full URL)
        const msgType = (attachment.file.type || "").startsWith("image/") ? "image" : "file";
        socket.emit("message:send", {
          groupId: activeChannel.id,
          text: text || "",
          type: msgType,
          fileUrl: filePath,
          fileName: attachment.file.name,
          mimeType: attachment.file.type || "application/octet-stream",
          fileSize: attachment.file.size,
        });
      } else {
        socket.emit("message:send", {
          groupId: activeChannel.id,
          text,
          type: "text",
        });
      }

      const payloadAttachment = attachment
        ? { name: attachment.name, size: attachment.size, type: attachment.type, url: finalFilePath }
        : undefined;

      sendMessageApi(activeChannel.id, text, payloadAttachment).catch((err) =>
        console.log("Fallback message send failed:", err)
      );
    } catch (err) {
      console.log("Send message failed:", err);
      toast.error("Failed to send message");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!activeChannel) return;

    try {
      setThreads((prev) => ({
        ...prev,
        [activeChannel.id]: (prev[activeChannel.id] || []).filter((m) => m.id !== messageId),
      }));

      if (socket.connected) {
        socket.emit("message:delete", { messageId, groupId: activeChannel.id });
      }

      deleteMessageApi(messageId).catch((err) => console.log("Fallback delete message failed:", err));
    } catch (err) {
      console.log("Delete message failed:", err);
    }
  };

  useEffect(() => {
    setGroups((prev) => prev.map((g) => (g.id === activeChannelId ? { ...g, unreadCount: 0 } : g)));
    setRecentChats((prev) => prev.map((c) => (c.id === activeChannelId ? { ...c, unreadCount: 0 } : c)));
  }, [activeChannelId]);

  const handleCreateChannel = async (
    newChan: Omit<ChatChannel, "unreadCount" | "lastMessage" | "time"> & {
      description?: string;
      avatarUrl?: string;
      selectedMemberIds?: string[];
    }
  ) => {
    try {
      const timeString = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

      let data;
      if (newChan.type === "group") {
        // Members are now attached at creation time — no follow-up call needed.
        const memberIds = (newChan.selectedMemberIds || [])
          .map((id) => Number(id))
          .filter((id) => !isNaN(id));

        data = await createCustomGroupApi({
          name: newChan.name,
          description: newChan.description,
          avatarUrl: newChan.avatarUrl,
          members: memberIds,
        });
      } else {
        const targetUserId = newChan.id.split("-")[1] || newChan.id;
        data = await CreateDirectChatApi(targetUserId);
      }

      const chat = data.chat || data;

      const fullChannel: ChatChannel = {
        id: chat.id,
        name: chat.name || newChan.name,
        type: chat.type || newChan.type,
        groupType: chat.groupType || newChan.groupType || "custom",
        lastMessage: "Secure sync session established",
        time: timeString,
        unreadCount: 0,
        status: chat.status || "online",
        avatar: chat.avatarUrl || newChan.avatar || "",
        membersCount: chat.membersCount || chat.members?.length || 1,
      };

      if (fullChannel.type === "group") {
        setGroups((prev) => [fullChannel, ...prev]);
      } else {
        setRecentChats((prev) => [fullChannel, ...prev]);
      }

      setThreads((prev) => ({
        ...prev,
        [fullChannel.id]: [
          {
            id: `sys-${Date.now()}`,
            sender: "them",
            senderName: "System",
            text: `Quantum connection initialized for ${fullChannel.name}. End-to-end cryptographic lock established.`,
            time: timeString,
            avatar: "SY",
          },
        ],
      }));

      setActiveChannelId(fullChannel.id);
      socket.emit("group:join", { groupId: fullChannel.id });
    } catch (err) {
      console.log("Create channel failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to create channel");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#030114]">
        <LoaderCustom text="Establishing Secure Sync..." />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="collab-panel-wrapper relative flex h-full min-h-0 overflow-hidden bg-[#030114] border border-white/[0.08] shadow-2xl md:rounded-3xl">
        <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#5271ff]/[0.06] blur-[130px]" />
        <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-[#3a4ec4]/[0.06] blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-[#22d3ee]/[0.04] blur-[100px]" />

        <div className="flex-1 min-w-0 h-full relative z-10">
          {activeChannel ? (
            <ChatWindow
              activeChannelName={activeChannel.name}
              activeChannelType={activeChannel.type}
              messages={visibleMessages}
              onSendMessage={handleSendMessage}
              onInitiateCall={(type) => {
                if (type === "audio") void handleStartCall();
                else toast.info("Video calls are not enabled yet");
              }}
              onDeleteMessage={handleDeleteMessage}
              onOpenDetails={() => setIsDetailsModalOpen(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center opacity-40 select-none">
              <p className="text-sm text-white/80">No active thread selected.</p>
              <p className="text-xs text-white/40 mt-1">Pick a synchronization link from the right sidebar.</p>
            </div>
          )}
        </div>

        <div className="hidden lg:block w-[320px] shrink-0 border-l border-white/[0.08] relative z-10">
          <RightSidebar
            activeId={activeChannelId}
            groups={groups}
            recentChats={recentChats}
            onSelectChannel={handleSelectChannel}
            onOpenNewChat={() => setIsNewChatOpen(true)}
          />
        </div>
      </div>

      <CallOverlay
        call={currentCall}
        currentUserId={currentUserId}
        callSide={callSide}
        credentials={callCredentials}
        error={callError}
        onAccept={() => void handleAcceptCall()}
        onReject={() => void handleCallAction("call:reject")}
        onCancel={() => void handleCallAction("call:cancel")}
        onEnd={() => void handleCallAction("call:end")}
      />

      <NewChatModal isOpen={isNewChatOpen} onClose={() => setIsNewChatOpen(false)} onCreateChannel={handleCreateChannel} />

      {/* Chat Details Popup */}
      <ChatDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        channel={activeChannel || null}
        rawGroupData={activeChannelId ? rawGroupsDataMap[activeChannelId] : null}
        currentUserId={currentUserId}
        onOpenEdit={() => {
          setIsDetailsModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onOpenDelete={() => {
          setIsDetailsModalOpen(false);
          setIsDeleteModalOpen(true);
        }}
        onOpenAddMember={() => {
          setIsAddMemberModalOpen(true);
        }}
        onMemberRemoved={(removedId) => {
          setRawGroupsDataMap((prev) => {
            const currentRaw = prev[activeChannelId];
            if (!currentRaw) return prev;
            const updatedMembers = (currentRaw.members || []).filter(
              (m: any) => String(m.userId ?? m.user?.user_id) !== String(removedId)
            );
            return {
              ...prev,
              [activeChannelId]: {
                ...currentRaw,
                members: updatedMembers,
              },
            };
          });
          setGroups((prev) =>
            prev.map((g) =>
              g.id === activeChannelId ? { ...g, membersCount: Math.max(1, (g.membersCount || 1) - 1) } : g
            )
          );
        }}
      />

      {/* Edit Chat Popup */}
      <EditChatModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        channel={activeChannel || null}
        rawGroupData={activeChannelId ? rawGroupsDataMap[activeChannelId] : null}
        onSaveSuccess={(updated) => {
          setGroups((prev) =>
            prev.map((g) =>
              g.id === activeChannelId
                ? { ...g, name: updated.name, avatar: updated.avatarUrl || g.avatar }
                : g
            )
          );
          setRawGroupsDataMap((prev) => ({
            ...prev,
            [activeChannelId]: {
              ...prev[activeChannelId],
              name: updated.name,
              description: updated.description,
              avatarUrl: updated.avatarUrl,
            },
          }));
        }}
      />

      {/* Delete Chat Confirmation Popup */}
      <DeleteChatModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        channel={activeChannel || null}
        onDeleteSuccess={(deletedId) => {
          setGroups((prev) => prev.filter((g) => g.id !== deletedId));
          setRecentChats((prev) => prev.filter((c) => c.id !== deletedId));
          const remaining = [
            ...groups.filter((g) => g.id !== deletedId),
            ...recentChats.filter((c) => c.id !== deletedId),
          ];
          setActiveChannelId(remaining[0]?.id || "");
          setIsDetailsModalOpen(false);
          setIsEditModalOpen(false);
          setIsDeleteModalOpen(false);
        }}
      />

      {/* Add Group Member Popup */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        channel={activeChannel || null}
        existingMemberIds={(activeChannelId && rawGroupsDataMap[activeChannelId]?.members || []).map((m: any) => m.userId ?? m.user?.user_id ?? m.id)}
        onMembersAdded={() => {
          // Trigger re-fetch of chats to sync state
          const token = getAccessToken();
          fetch(`${backendBaseUrl}/collab-station/groups`, {
            headers: authHeaders(token),
          })
            .then((res) => res.json())
            .then((data) => {
              if (Array.isArray(data)) {
                const rawMap: Record<string, any> = {};
                data.forEach((c) => {
                  if (c.id) rawMap[c.id] = c;
                });
                setRawGroupsDataMap(rawMap);
              }
            })
            .catch((err) => console.error("Re-fetch failed after adding members:", err));
        }}
      />
    </div>
  );
}
