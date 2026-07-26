"use client";

import { CookieManager } from "@/lib/cookieManager";
import { socket } from "@/lib/socket";

import React, { useState, useEffect, useRef } from "react";
import { getMessagesApi } from "./apis/DirectChats/getMessageApi";
import { CreateDirectChatApi } from "./apis/DirectChats/createDirectChatsApi";
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


// Setup Initial Mock Channels
const INITIAL_GROUPS: ChatChannel[] = [
  {
    id: "g-1",
    name: "#development-team",
    type: "group",
    groupType: "team",
    lastMessage: "Alex Mercer: All features are locked for testing",
    time: "2 days ago",
    unreadCount: 1,
    membersCount: 8,
  },
  {
    id: "g-2",
    name: "#marketing-team",
    type: "group",
    groupType: "team",
    lastMessage: "Elena Rostova: The video presentation is ready",
    time: "Yesterday",
    unreadCount: 0,
    membersCount: 4,
  },
  {
    id: "g-3",
    name: "#synergy-portal",
    type: "group",
    groupType: "project",
    lastMessage: "Sarah Connor: We updated the primary color shades",
    time: "10:30 AM",
    unreadCount: 2,
    membersCount: 5,
  },
  {
    id: "g-4",
    name: "#ideas-lounge",
    type: "group",
    groupType: "custom",
    lastMessage: "Sarah Connor: Love it. Let's dump all feature ideas here.",
    time: "11:20 AM",
    unreadCount: 0,
    membersCount: 12,
  },
];

const INITIAL_RECENT_CHATS: ChatChannel[] = [
  {
    id: "d-1",
    name: "Sarah Connor",
    type: "direct",
    lastMessage: "Can we hop on a quick call?",
    time: "11:15 AM",
    unreadCount: 0,
    status: "online",
    avatar: "SC",
  },
  {
    id: "d-2",
    name: "Alex Mercer",
    type: "direct",
    lastMessage: "Code reviewed, looking clean!",
    time: "9:45 AM",
    unreadCount: 0,
    status: "offline",
    avatar: "AM",
  },
  {
    id: "d-3",
    name: "Elena Rostova",
    type: "direct",
    lastMessage: "Let's sync up on the dashboard design",
    time: "Yesterday",
    unreadCount: 0,
    status: "online",
    avatar: "ER",
  },
];

// Setup Initial Mock Messages mapped by Channel ID
const INITIAL_THREADS: ChatThreadMap = {
  "g-1": [
    {
      id: "m1",
      sender: "them",
      senderName: "Alex Mercer",
      text: "Staging build is deployed and ready for security scanner audit.",
      time: "2 days ago",
      avatar: "AM",
    },
    {
      id: "m2",
      sender: "me",
      senderName: "Me",
      text: "I'll execute the cypress integration scripts right away.",
      time: "2 days ago",
    },
    {
      id: "m3",
      sender: "them",
      senderName: "Alex Mercer",
      text: "Sounds like a plan. All features are locked for testing, let's keep the pipeline green.",
      time: "2 days ago",
      avatar: "AM",
    },
  ],
  "g-2": [
    {
      id: "m4",
      sender: "them",
      senderName: "Elena Rostova",
      text: "Working on the teaser for our June release.",
      time: "Yesterday",
      avatar: "ER",
    },
    {
      id: "m5",
      sender: "me",
      senderName: "Me",
      text: "Excellent. Let me review the draft assets in the Cloud sync drive.",
      time: "Yesterday",
    },
    {
      id: "m6",
      sender: "them",
      senderName: "Elena Rostova",
      text: "Perfect, the video presentation is ready for founder review in cloud storage.",
      time: "Yesterday",
      avatar: "ER",
    },
  ],
  "g-3": [
    {
      id: "m7",
      sender: "them",
      senderName: "Sarah Connor",
      text: "Hey team! Pushed the updated styling specifications to Figma.",
      time: "10:15 AM",
      avatar: "SC",
    },
    {
      id: "m8",
      sender: "me",
      senderName: "Me",
      text: "Prone to verify. Do we have the updated branding guidelines in the project?",
      time: "10:20 AM",
    },
    {
      id: "m9",
      sender: "them",
      senderName: "Alex Mercer",
      text: "Pristine. I synchronised the next.js and tailwind variables with the Figma styling variables.",
      time: "10:25 AM",
      avatar: "AM",
    },
    {
      id: "m10",
      sender: "them",
      senderName: "Sarah Connor",
      text: "Indeed. We updated the primary color shades to match our futuristic dark premium palette.",
      time: "10:30 AM",
      avatar: "SC",
    },
  ],
  "g-4": [
    {
      id: "m11_c",
      sender: "me",
      senderName: "Me",
      text: "Hey team, this lounge is for raw ideation and brainstorming! Let's build something epic.",
      time: "11:10 AM",
    },
    {
      id: "m12_c",
      sender: "them",
      senderName: "Sarah Connor",
      text: "Love it. Let's dump all feature ideas here. I'm already drafting a glassmorphic sidebar layout concept.",
      time: "11:20 AM",
      avatar: "SC",
    },
  ],
  "d-1": [
    {
      id: "m11",
      sender: "them",
      senderName: "Sarah Connor",
      text: "Hello! Did you get a chance to check the custom glassmorphism panels?",
      time: "11:00 AM",
      avatar: "SC",
    },
    {
      id: "m12",
      sender: "me",
      senderName: "Me",
      text: "Yes, they look gorgeous! The transitions are super clean and professional.",
      time: "11:10 AM",
    },
    {
      id: "m13",
      sender: "them",
      senderName: "Sarah Connor",
      text: "Awesome! Can we hop on a quick call to map out the dashboard graphs?",
      time: "11:15 AM",
      avatar: "SC",
    },
  ],
  "d-2": [
    {
      id: "m14",
      sender: "me",
      senderName: "Me",
      text: "Hey Alex, are we good to approve the TypeORM delete guard pull request?",
      time: "9:30 AM",
    },
    {
      id: "m15",
      sender: "them",
      senderName: "Alex Mercer",
      text: "Yes, just ran the test suites against local docker services. Code reviewed, looking clean!",
      time: "9:45 AM",
      avatar: "AM",
    },
  ],
  "d-3": [
    {
      id: "m16",
      sender: "them",
      senderName: "Elena Rostova",
      text: "Hey! Let's sync up on the dashboard design changes when you have a slot.",
      time: "Yesterday",
      avatar: "ER",
    },
    {
      id: "m17",
      sender: "me",
      senderName: "Me",
      text: "Definitely. Let's schedule an Orbit link tomorrow afternoon.",
      time: "Yesterday",
    },
  ],
};

type UserId = number | string;
type TokenUser = { user_id?: UserId; sub?: UserId; email?: string };

const readTokenUser = (token: string): TokenUser => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
};

const formatMessage = (message: any, currentUser: TokenUser): Message => {
  const sender = message.sender || {};
  const isMe =
    (currentUser.user_id ?? currentUser.sub) === message.senderId ||
    (!!currentUser.email && currentUser.email === sender.email);

  return {
    id: message.id,
    sender: isMe ? "me" : "them",
    senderName: isMe ? "Me" : sender.name || sender.email || "Unknown user",
    text: message.text || "",
    time: message.createdAt
      ? new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : "",
    avatar: sender.name
      ? sender.name.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase()
      : undefined,
    attachment: message.fileUrl
      ? { 
          name: decodeURIComponent(message.fileUrl.split("/").pop()?.split("?")[0] || "Attachment"), 
          size: "", 
          type: message.fileUrl.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) ? "image" : "file", 
          url: message.fileUrl 
        }
      : undefined,
  };
};

export default function CollabStationPage() {
  // Wait for the API to provide a real UUID before loading message history.
  const [activeChannelId, setActiveChannelId] = useState("");
  const [groups, setGroups] = useState<ChatChannel[]>(INITIAL_GROUPS);
  const [recentChats, setRecentChats] = useState<ChatChannel[]>(INITIAL_RECENT_CHATS);
  const [threads, setThreads] = useState<ChatThreadMap>({});
  const [currentCall, setCurrentCall] = useState<CallDto | null>(null);
  const [callSide, setCallSide] = useState<"caller" | "recipient" | undefined>();
  const [callCredentials, setCallCredentials] = useState<CallTokenResponse | null>(null);
  const [callError, setCallError] = useState("");
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<UserId | undefined>();

  const containerRef = useRef<HTMLDivElement>(null);
  const currentUserRef = useRef<TokenUser>({});
  const currentUserIdRef = useRef<UserId | undefined>(undefined);
  const chatIdsRef = useRef<string[]>([]);
  const tokenRequestCallIdRef = useRef<string | null>(null);

  const setCurrentUserIdentity = (userId?: UserId) => {
    if (userId === undefined || userId === null) return;
    currentUserIdRef.current = userId;
    setCurrentUserId(userId);
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

  useEffect(() => {
    let cancelled = false;

    const connectSocket = async () => {
      const token = await CookieManager("get", "access-token");
      if (cancelled || !token) return;
      currentUserRef.current = readTokenUser(token);
      setCurrentUserIdentity(currentUserRef.current.user_id ?? currentUserRef.current.sub);
      socket.auth = { token };
      socket.connect();
    };

    connectSocket();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      chatIdsRef.current.forEach((groupId) => {
        socket.emit("group:join", { groupId });
      });
    });

    return () => {
      cancelled = true;
      socket.off("connect");
      socket.disconnect();
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
        const token = await CookieManager("get", "access-token");
        const email = token ? readTokenUser(token).email : undefined;
        if (email) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/collab-station/groups/${call.groupId}`,
            { headers: { Authorization: `Bearer ${token}` } }
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

  // Token acquisition is centralized here so an accept acknowledgement and the
  // `call:accepted` broadcast cannot create two LiveKit room connections.
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

  // GSAP Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".collab-panel-wrapper",
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: "power3.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

useEffect(() => {
  const fetchChats = async () => {
    try {
      const token = await CookieManager("get", "access-token");
      const currentUser = token ? readTokenUser(token) : {};
      currentUserRef.current = currentUser;
      setCurrentUserIdentity(currentUser.user_id ?? currentUser.sub);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/collab-station/groups`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      let loadedGroups: any[] = [];
      let loadedDirects: any[] = [];

      if (Array.isArray(data)) {
        const mappedChats = data.map((c) => {
          const otherMember = c.type === "direct"
            ? c.members?.find((member: any) => {
                const user = member.user || {};
                const myId = currentUser.user_id ?? currentUser.sub;
                return myId ? member.userId !== myId : user.email !== currentUser.email;
              })
            : undefined;
          const displayUser = otherMember?.user;

          return {
          id: c.id,
          name: c.type === "direct"
            ? displayUser?.name || displayUser?.email || "Unknown user"
            : c.name,
          type: c.type,
          groupType: c.type === "direct" ? undefined : c.type,
          lastMessage: c.latestMessage ? c.latestMessage.m_text : "No messages yet",
          time: c.latestMessage ? new Date(c.latestMessage.m_createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
          unreadCount: 0,
          status: "online",
          avatar: c.avatarUrl || (displayUser?.name
            ? displayUser.name.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase()
            : undefined),
          membersCount: c.members?.length || 0,
        };});

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
      setActiveChannelId((currentId) =>
        loadedChats.some((chat) => chat.id === currentId)
          ? currentId
          : loadedChats[0]?.id || ""
      );

      // Join all chat rooms so we can receive messages in real-time
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

  socket.emit("group:join", { groupId: activeChannelId });

  let cancelled = false;
  getMessagesApi(activeChannelId)
    .then((data) => {
      if (cancelled) return;
      const messages = Array.isArray(data) ? data : data.messages || [];
      setThreads((prev) => ({
        ...prev,
        [activeChannelId]: messages.map((message: any) =>
          formatMessage(message, currentUserRef.current)
        ),
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

    setThreads((prev) => {
      const roomThreads = prev[roomId] || [];
      
      // Find matching temporary message by text or attachment name
      let tempIndexToRemove = roomThreads.findIndex((m) => {
        if (!m.id.startsWith("temp-")) return false;
        const textMatch = m.text && formatted.text && m.text === formatted.text;
        const attachmentMatch = m.attachment?.name && formatted.attachment?.name && m.attachment.name === formatted.attachment.name;
        return textMatch || attachmentMatch;
      });

      // If we found a matching temp message, it means this incoming message is actually ours echoing back!
      if (tempIndexToRemove !== -1) {
        formatted.sender = "me";
      }

      const newThreads = roomThreads.filter(
        (item, idx) => item.id !== formatted.id && idx !== tempIndexToRemove
      );

      return {
        ...prev,
        [roomId]: [...newThreads, formatted],
      };
    });
  };

  const handleMessageDeleted = (data: { messageId: string, groupId: string }) => {
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

  // Find active channel metadata
  const activeChannel =
    groups.find((g) => g.id === activeChannelId) ||
    recentChats.find((c) => c.id === activeChannelId);

  const activeMessages = threads[activeChannelId] || [];
  const handleSelectChannel = (id: string) => setActiveChannelId(id);
  // Handle message dispatching
 const handleSendMessage = async (text: string, attachment?: Attachment) => {
  if (!activeChannel) return;

  try {
    const timeString = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    if (!socket.connected) {
      throw new Error("Chat connection is not available");
    }

    // 1. Optimistic UI Update immediately!
    const tempId = `temp-${Date.now()}`;
    const previewUrl = attachment?.file ? URL.createObjectURL(attachment.file) : attachment?.url;
    
    const tempMessage: Message = {
      id: tempId,
      sender: "me",
      senderName: "Me",
      text,
      time: timeString,
      avatar: "",
      attachment: attachment ? {
        name: attachment.name,
        size: attachment.size,
        type: attachment.type,
        url: previewUrl || ""
      } : undefined
    };

    setThreads((prev) => ({
      ...prev,
      [activeChannel.id]: [...(prev[activeChannel.id] || []), tempMessage],
    }));

    const lastMsgDisplay = attachment ? `Sent a file: ${attachment.name}` : text;
    
    setGroups((prev) => prev.map((g) =>
      g.id === activeChannel.id ? { ...g, lastMessage: `Me: ${lastMsgDisplay}`, time: timeString } : g
    ));

    setRecentChats((prev) => prev.map((c) =>
      c.id === activeChannel.id ? { ...c, lastMessage: `Me: ${lastMsgDisplay}`, time: timeString } : c
    ));

    // 2. Perform the slow network operations silently in the background
    let fileUrl = attachment?.url;

    if (attachment?.file) {
      const presignedData = await getPresignedUrlApi(
        attachment.file.name,
        attachment.file.type || "application/octet-stream",
        process.env.NEXT_PUBLIC_CHAT_BUCKET || "synergi-chat-attachments"
      );
      
      const uploadRes = await fetch(presignedData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": attachment.file.type || "application/octet-stream",
        },
        body: attachment.file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload attachment");
      }
      
      fileUrl = presignedData.filePath;
    }

    const payloadAttachment = attachment 
      ? { name: attachment.name, size: attachment.size, type: attachment.type, url: fileUrl } 
      : undefined;

    // 3. Emit to backend 
    socket.emit("message:send", {
      groupId: activeChannel.id,
      text,
      type: attachment ? "file" : "text",
      fileUrl: fileUrl,
    });

    sendMessageApi(activeChannel.id, text, payloadAttachment).catch((err) =>
      console.log("Fallback message send failed:", err)
    );

  } catch (err) {
    console.log("Send message failed:", err);
  }
 };

 const handleDeleteMessage = async (messageId: string) => {
   if (!activeChannel) return;
   
   try {
     // 1. Optimistic UI update
     setThreads((prev) => ({
       ...prev,
       [activeChannel.id]: (prev[activeChannel.id] || []).filter(m => m.id !== messageId),
     }));

     // 2. Broadcast deletion
     if (socket.connected) {
       socket.emit("message:delete", { messageId, groupId: activeChannel.id });
     }

     // 3. Fallback backend save
     deleteMessageApi(messageId).catch((err) =>
       console.log("Fallback delete message failed:", err)
     );
   } catch (err) {
     console.log("Delete message failed:", err);
   }
 };

  // Clear unread counts upon channel activation
  useEffect(() => {
    setGroups((prev) =>
      prev.map((g) => (g.id === activeChannelId ? { ...g, unreadCount: 0 } : g))
    );
    setRecentChats((prev) =>
      prev.map((c) => (c.id === activeChannelId ? { ...c, unreadCount: 0 } : c))
    );
  }, [activeChannelId]);

  // Handle channel creation
  const handleCreateChannel = async (
  newChan: Omit<ChatChannel, "unreadCount" | "lastMessage" | "time">
 ) => {
  try {
    const timeString = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    // 👇 CALL BACKEND API HERE
    const targetUserId = newChan.type === "direct" ? newChan.id.split('-')[1] : newChan.id;
    const data = await CreateDirectChatApi(targetUserId);

    const chat = data.chat || data;

    const fullChannel: ChatChannel = {
      id: chat.id,
      name: chat.type === "direct" ? newChan.name : chat.name,
      type: chat.type,
      groupType: chat.groupType,
      lastMessage: "Secure sync session established",
      time: timeString,
      unreadCount: 0,
      status: chat.status || "online",
      avatar: chat.avatarUrl || newChan.avatar || "",
      membersCount: chat.membersCount,
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
      {/* Centered High-Tech Glass Workspace Frame */}
      <div className="collab-panel-wrapper relative flex h-full min-h-0 overflow-hidden bg-[#030114] border border-white/[0.08] shadow-2xl md:rounded-3xl">
        
        {/* Ambient futuristic background glows */}
        <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#5271ff]/[0.06] blur-[130px]" />
        <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-[#3a4ec4]/[0.06] blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-[#22d3ee]/[0.04] blur-[100px]" />

        {/* Left Side: Centered Chat Focus Area */}
        <div className="flex-1 min-w-0 h-full relative z-10">
          {activeChannel ? (
            <ChatWindow
              activeChannelName={activeChannel.name}
              activeChannelType={activeChannel.type}
              messages={activeMessages}
              onSendMessage={handleSendMessage}
              onInitiateCall={(type) => {
                if (type === "audio") void handleStartCall();
                else toast.info("Video calls are not enabled yet");
              }}
              onDeleteMessage={handleDeleteMessage}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center opacity-40 select-none">
              <p className="text-sm text-white/80">No active thread selected.</p>
              <p className="text-xs text-white/40 mt-1">Pick a synchronization link from the right sidebar.</p>
            </div>
          )}
        </div>

        {/* Right Side: Integrated Right Sidebar */}
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

      {/* Futuristic Secure Call overlay */}
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

      {/* New Sync Session creation modal */}
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onCreateChannel={handleCreateChannel}
      />
    </div>
  );
}
