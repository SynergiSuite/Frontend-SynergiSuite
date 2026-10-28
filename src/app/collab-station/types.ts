import { CallDto } from "./callTypes";

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
  missedCalls?: CallDto[];
  missedCallCount?: number;
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
  url?: string;
  file?: File;
}

export type MessageType = "text" | "image" | "file" | "shared_item";

export type SharedEntityType = "task" | "milestone" | "client_feedback";

export interface SharedItemSnapshot {
  title: string;
  projectId: string;
  projectName?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  targetType?: string;
}

export interface ShareMessagePayload {
  groupId: string;
  entityType: SharedEntityType;
  entityId: string;
  text?: string;
}

export interface CollabGroup {
  id: string;
  name: string;
  type: "group" | "direct";
  groupType?: "team" | "project" | "custom";
  projectId?: string;
  projectName?: string;
  membersCount?: number;
  avatar?: string;
  description?: string;
}

export interface Message {
  id: string;
  sender: "me" | "them";
  senderName: string;
  text: string;
  time: string;
  avatar?: string;
  attachment?: Attachment;
  type?: MessageType;
  sharedEntityType?: SharedEntityType;
  sharedEntityId?: string;
  sharedEntitySnapshot?: SharedItemSnapshot;
  replyToId?: string;
  repliesCount?: number;
  createdAt?: string;
  groupId?: string;
}

export interface ChatThreadMap {
  [channelId: string]: Message[];
}

export type CallType = "audio" | "video" | null;

