export type RecordingStatus =
  | "starting"
  | "active"
  | "ending"
  | "complete"
  | "failed"
  | "aborted"
  | "limit_reached"
  | "unknown";

export interface MeetingRecording {
  id: string;
  roomName: string;
  egressId: string | null;
  status: RecordingStatus;
  bucket: string;
  filePath: string | null;
  fileLocation: string | null;
  fileSize: string | null;
  duration: string | null;
  error: string | null;
  playbackUrl?: string | null;
  playbackUrlExpiresIn?: number | null;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlaybackUrlResponse {
  viewUrl: string;
}
