import { isAbsoluteUrl, backendBaseUrl, TokenUser } from "./mainHelper";
import { Message } from "../types";



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

export const formatMessage = (message: any, currentUser: TokenUser): Message => {
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
          url: toDirectFileUrl(message.fileUrl),
        }
      : undefined,
  };
};
