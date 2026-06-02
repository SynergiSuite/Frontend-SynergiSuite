export interface ChatChannel {
  id: string;
  name: string;
  type: "group" | "direct";
  groupType?: "team" | "project" | "custom";
  lastMessage: string;
  time: string;
  unreadCount: number;
  status?: "online" | "offline";
  avatar?: string;
  membersCount?: number;
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface Message {
  id: string;
  sender: "me" | "them";
  senderName: string;
  text: string;
  time: string;
  avatar?: string;
  attachment?: Attachment;
}

export interface ChatThreadMap {
  [channelId: string]: Message[];
}

export type CallType = "audio" | "video" | null;
