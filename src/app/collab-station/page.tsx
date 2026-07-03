"use client";

import { CookieManager } from "@/lib/cookieManager";
import { socket } from "@/lib/socket";

import React, { useState, useEffect, useRef } from "react";
import { getMessagesApi } from "./apis/DirectChats/getMessageApi";
import { sendMessageApi } from "./apis/DirectChats/sendMessageApi";
import { CreateDirectChatApi } from "./apis/DirectChats/createDirectChatsApi";
import { gsap } from "gsap";
import ChatWindow from "./ChatWindow";
import RightSidebar from "./RightSidebar";
import CallOverlay from "./CallOverlay";
import NewChatModal from "./NewChatModal";
import { ChatChannel, Message, ChatThreadMap, CallType, Attachment } from "./types";


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

export default function CollabStationPage() {
  const [activeChannelId, setActiveChannelId] = useState("g-1");
  const [groups, setGroups] = useState<ChatChannel[]>(INITIAL_GROUPS);
  const [recentChats, setRecentChats] = useState<ChatChannel[]>(INITIAL_RECENT_CHATS);
  const [threads, setThreads] = useState<ChatThreadMap>({});
  const [callType, setCallType] = useState<CallType>(null);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  socket.connect();

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  return () => {
    socket.disconnect();
  };
}, []);

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

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/collab-station/groups`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

       setGroups(data.groups || []); 
      setRecentChats(data.directChats || []);
    } catch (err) {
      console.log("Failed to load chats", err);
    }
  };

  fetchChats();
}, []);

useEffect(() => {
  if (!activeChannelId) return;

  socket.emit("join_room", activeChannelId);
}, [activeChannelId]);
  
useEffect(() => {
  socket.on("receive_message", (message) => {
    const roomId = message.roomId;

    setThreads((prev) => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), message],
    }));
  });

  return () => {
    socket.off("receive_message");
  };
}, []);

  // Find active channel metadata
  const activeChannel =
    groups.find((g) => g.id === activeChannelId) ||
    recentChats.find((c) => c.id === activeChannelId);

  const activeMessages = threads[activeChannelId] || [];
  const handleSelectChannel = async (id: string) => {
  setActiveChannelId(id);

  try {
    const data = await getMessagesApi(id);

    setThreads((prev) => ({
      ...prev,
      [id]: data.messages || [],
    }));
  } catch (err) {
    console.log("Failed to load messages", err);
  }
 };
  // Handle message dispatching
 const handleSendMessage = async (text: string, attachment?: Attachment) => {
  if (!activeChannel) return;

  try {
    const timeString = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    // 1. CREATE MESSAGE FIRST (OPTIMISTIC UI)
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "me",
      senderName: "Me",
      text,
      time: timeString,
      attachment,
    };

    // 2. UPDATE UI IMMEDIATELY
    setThreads((prev) => ({
      ...prev,
      [activeChannel.id]: [
        ...(prev[activeChannel.id] || []),
        newMessage,
      ],
    }));

    // 3. SEND VIA SOCKET (REAL-TIME)
    socket.emit("send_message", {
      roomId: activeChannel.id,
      message: newMessage,
    });

    // 4. OPTIONAL: SAVE IN BACKEND (API fallback)
    await sendMessageApi(activeChannel.id, text, attachment);

    // 5. UPDATE CHAT LIST
    const lastMsgDisplay = attachment
      ? `Sent a file: ${attachment.name}`
      : text;

    setGroups((prev) =>
      prev.map((g) =>
        g.id === activeChannel.id
          ? { ...g, lastMessage: `Me: ${lastMsgDisplay}`, time: timeString }
          : g
      )
    );

    setRecentChats((prev) =>
      prev.map((c) =>
        c.id === activeChannel.id
          ? { ...c, lastMessage: `Me: ${lastMsgDisplay}`, time: timeString }
          : c
      )
    );

  } catch (err) {
    console.log("Send message failed:", err);
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
    const data = await CreateDirectChatApi(newChan.id);

    const chat = data.chat || data;

    const fullChannel: ChatChannel = {
      id: chat.id,
      name: chat.name,
      type: chat.type,
      groupType: chat.groupType,
      lastMessage: "Secure sync session established",
      time: timeString,
      unreadCount: 0,
      status: chat.status || "online",
      avatar: chat.avatar || "",
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
  } catch (err) {
    console.log("Create channel failed:", err);
  }
};

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
              onInitiateCall={(type) => setCallType(type)}
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
        callType={callType}
        channelName={activeChannel?.name || "Secure Node"}
        onHangUp={() => setCallType(null)}
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
