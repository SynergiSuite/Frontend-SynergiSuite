import { CallDto } from "../callTypes";
import { TokenUser } from "./mainHelper";
import { Message } from "../types";

export const getMissedCallPreview = (call?: CallDto, currentUser?: TokenUser) => {
  if (!call) return "Missed call";
  const currentUserId = currentUser?.user_id ?? currentUser?.sub;
  const missedFromMe =
    currentUserId !== undefined && String(call.caller?.user_id) === String(currentUserId);
  return missedFromMe
    ? `Missed call to ${call.recipient?.name || "Recipient"}`
    : `Missed call from ${call.caller?.name || "Caller"}`;
};

export const formatCallTimeWithDate = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";

  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const timeStr = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });

  if (isToday) {
    return timeStr;
  }

  const dateStr = d.toLocaleDateString([], { month: "short", day: "numeric" });
  return `${dateStr}, ${timeStr}`;
};

export const formatMissedCallMessage = (call: CallDto, currentUser: TokenUser): Message => {
  const rawTime = call.endedAt || call.createdAt;
  const formattedTime = formatCallTimeWithDate(rawTime);

  return {
    id: `missed-call-${call.callId}`,
    sender: "them",
    senderName: "Missed Call",
    text: getMissedCallPreview(call, currentUser),
    time: formattedTime || "Recently",
    avatar: "MC",
  };
};
