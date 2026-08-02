export type CallStatus =
  | "ringing"
  | "active"
  | "rejected"
  | "cancelled"
  | "missed"
  | "ended"
  | "failed";

export interface CallParticipant {
  user_id?: number | string;
  id?: number | string;
  userId?: number | string;
  name: string;
  email?: string;
}

export interface CallDto {
  callId: string;
  groupId: string;
  status: CallStatus;
  caller: CallParticipant;
  recipient: CallParticipant;
  createdAt: string;
  answeredAt?: string;
  endedAt?: string;
}

export interface CallTokenResponse {
  token: string;
  url: string;
  roomName: string;
}

export interface CallAcknowledgement {
  success: boolean;
  call?: CallDto;
  error?: { code: string; message: string };
}
