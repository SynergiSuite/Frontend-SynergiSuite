import { isAbsoluteUrl, backendBaseUrl, TokenUser, UserId } from "./mainHelper";
import { Message, MessageType, SharedEntityType, SharedItemSnapshot } from "../types";

export interface RawChatMessage {
  id?: string;
  sender?: { name?: string; email?: string };
  senderId?: UserId;
  text?: string;
  createdAt?: string;
  type?: MessageType;
  sharedEntityType?: SharedEntityType;
  sharedEntityId?: string;
  sharedEntitySnapshot?: SharedItemSnapshot;
  replyToId?: string;
  repliesCount?: number;
  replies?: unknown[];
  groupId?: string;
  fileUrl?: string;
  m_text?: string;
  m_type?: MessageType;
  m_createdAt?: string;
}

export const toDirectFileUrl = (filePath?: string, uploadUrl?: string) => {
  if (!filePath) return "";
  if (isAbsoluteUrl(filePath) || filePath.startsWith("blob:")) return filePath;

  if (uploadUrl && isAbsoluteUrl(uploadUrl)) {
    try {
      const uploadUrlObject = new URL(uploadUrl);
      return `${uploadUrlObject.origin}${uploadUrlObject.pathname}`;
    } catch {
      // Fall through to backend-relative URL.
    }
  }

  if (!backendBaseUrl) return filePath;
  return `${backendBaseUrl.replace(/\/$/, "")}/${filePath.replace(/^\//, "")}`;
};

export const getUploadedFileUrl = (response: {
  filePath?: string;
  fileUrl?: string;
  publicUrl?: string;
  viewUrl?: string;
  downloadUrl?: string;
  url?: string;
  uploadUrl?: string;
}) =>
  response.fileUrl ||
  response.publicUrl ||
  response.viewUrl ||
  response.downloadUrl ||
  response.url ||
  toDirectFileUrl(response.filePath, response.uploadUrl);

export const formatChatTime = (value?: string) =>
  value ? new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

export const formatMessagePreview = (
  message?: Partial<Message> | RawChatMessage | null
): string => {
  if (!message) return "";
  if (message.type === "shared_item" || message.sharedEntityType) {
    const entityLabel =
      message.sharedEntityType === "client_feedback"
        ? "feedback"
        : message.sharedEntityType || "item";
    const title = message.sharedEntitySnapshot?.title || "an item";
    return `Shared a ${entityLabel}: ${title}`;
  }
  if ("attachment" in message && message.attachment) {
    return `Sent a file: ${message.attachment.name}`;
  }
  const mText = "m_text" in message && typeof message.m_text === "string" ? message.m_text : "";
  return message.text || mText || "";
};

export const formatMessage = (message: RawChatMessage, currentUser: TokenUser): Message => {
  const sender = message.sender || {};
  const isMe =
    (currentUser.user_id ?? currentUser.sub) === message.senderId ||
    (Boolean(currentUser.email) && currentUser.email === sender.email);

  const rawType = message.type;
  const isSharedItem = rawType === "shared_item" || Boolean(message.sharedEntityType);

  return {
    id: message.id || "",
    sender: isMe ? "me" : "them",
    senderName: isMe ? "Me" : sender.name || sender.email || "Unknown user",
    text: message.text || "",
    time: message.createdAt
      ? new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : "",
    avatar: sender.name
      ? sender.name.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase()
      : undefined,
    type: isSharedItem
      ? "shared_item"
      : rawType || (message.fileUrl ? (message.fileUrl.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) ? "image" : "file") : "text"),
    sharedEntityType: message.sharedEntityType,
    sharedEntityId: message.sharedEntityId,
    sharedEntitySnapshot: message.sharedEntitySnapshot,
    replyToId: message.replyToId,
    repliesCount:
      typeof message.repliesCount === "number"
        ? message.repliesCount
        : Array.isArray(message.replies)
        ? message.replies.length
        : 0,
    createdAt: message.createdAt,
    groupId: message.groupId,
    attachment: message.fileUrl
      ? {
          name: decodeURIComponent(message.fileUrl.split("/").pop()?.split("?")[0] || "Attachment"),
          size: "",
          type: message.fileUrl.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) ? "image" : "file",
          url: toDirectFileUrl(message.fileUrl),
        }
      : undefined,
  };
};
