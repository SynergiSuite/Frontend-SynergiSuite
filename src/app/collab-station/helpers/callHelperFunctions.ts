import { CallAcknowledgement, CallDto, CallTokenResponse } from "../callTypes";
import { TokenUser } from "./mainHelper";
import { formatChatTime } from "./chatHelperFunctions";
import { Message } from "../types";

export const getMissedCallPreview = (call?: CallDto, currentUser?: TokenUser) => {
  if (!call) return "Missed call";
  const currentUserId = currentUser?.user_id ?? currentUser?.sub;
  const missedFromMe =
    currentUserId !== undefined && String(call.caller.user_id) === String(currentUserId);
  return missedFromMe
    ? `Missed call to ${call.recipient.name}`
    : `Missed call from ${call.caller.name}`;
};

export const formatMissedCallMessage = (call: CallDto, currentUser: TokenUser): Message => ({
  id: `missed-call-${call.callId}`,
  sender: "them",
  senderName: "Missed Call",
  text: getMissedCallPreview(call, currentUser),
  time: formatChatTime(call.endedAt || call.createdAt),
  avatar: "MC",
});
