"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  LocalParticipant,
  TrackPublication,
  RemoteTrackPublication,
  RemoteTrack,
  Track,
  VideoQuality,
} from "livekit-client";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  Monitor,
  Users,
  Shield,
  Maximize2,
  Minimize2,
  Volume2,
  Radio,
  Sparkles,
} from "lucide-react";
import { MeetingResponseDto, MeetingTokenResponse } from "./types/meetingTypes";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { TranscriptionResult } from "./apis/transcribeApi";
import { getOrGenerateMeetingTranscript, getRecording, stopRecording, waitForRecordingPlaybackUrl } from "./apis/recordingApi";
import { MeetingRecording } from "./types/recordingTypes";

interface MeetingRoomModalProps {
  meeting: MeetingResponseDto;
  tokenResponse: MeetingTokenResponse;
  currentUserId: number;
  onLeave: () => void;
  onEndMeeting?: (options?: { skipStopRecording?: boolean }) => void | Promise<void>;
  onTranscriptionResult?: (result: TranscriptionResult) => void;
}

interface ParticipantTrackState {
  identity: string;
  name: string;
  isLocal: boolean;
  videoTrack?: Track | null;
  audioTrack?: Track | null;
  screenTrack?: Track | null;
  isMicMuted: boolean;
  isVideoMuted: boolean;
}

export default function MeetingRoomModal({
  meeting,
  tokenResponse,
  currentUserId,
  onLeave,
  onEndMeeting,
  onTranscriptionResult,
}: MeetingRoomModalProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [connectionState, setConnectionState] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participantTracks, setParticipantTracks] = useState<ParticipantTrackState[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto Meeting Audio Recording Refs & State
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isAutoRecording, setIsAutoRecording] = useState(false);

  const hostUserId = Number(meeting.host?.user_id || 0);
  const myUserId = Number(currentUserId || 0);
  const isHost = hostUserId > 0 && myUserId > 0 && hostUserId === myUserId;

  // Backend LiveKit Server Egress Recording State
  const [serverRecording, setServerRecording] = useState<MeetingRecording | null>(null);
  const [isStoppingServerRecording, setIsStoppingServerRecording] = useState(false);

  const roomName = meeting.roomName || meeting.meetingId;

  // Poll backend GET /api/recordings/:roomName for server-driven egress status
  useEffect(() => {
    if (!roomName) return;

    let isMounted = true;
    let pollTimer: number | null = null;

    const fetchRecordingStatus = async () => {
      const rec = await getRecording(roomName);
      if (!isMounted) return;

      if (rec) {
        setServerRecording(rec);
      }

      const status = rec?.status;
      const isTerminal =
        status === "complete" ||
        status === "failed" ||
        status === "aborted" ||
        status === "limit_reached";

      if (isTerminal) {
        return; // Stop polling on terminal states
      }

      // Poll every 5s while starting/active/ending, 10s if waiting for first record
      const nextDelay = status ? 5000 : 10000;
      pollTimer = window.setTimeout(fetchRecordingStatus, nextDelay);
    };

    void fetchRecordingStatus();

    return () => {
      isMounted = false;
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [roomName]);

  const handleStopServerRecording = async () => {
    if (!roomName || isStoppingServerRecording) return;
    try {
      setIsStoppingServerRecording(true);
      const updated = await stopRecording(roomName);
      setServerRecording(updated);
      toast.success("Stop recording request sent");
    } catch (err: any) {
      console.error("[Recording Stop Failed]", err);
      toast.error(err?.message || "Failed to stop recording");
    } finally {
      setIsStoppingServerRecording(false);
    }
  };

  // Start automatic meeting audio recording
  const startMeetingAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsAutoRecording(true);
      console.log("[Meeting Audio Recorder] Auto recording started.");
    } catch (err) {
      console.warn("[Meeting Audio Recorder] Could not start audio recording:", err);
    }
  };

  // Finalize recording on leave/end meeting and trigger transcription
  const handleFinalizeAndTranscribe = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        const recorder = mediaRecorderRef.current;
        recorder.stop();
        recorder.stream.getTracks().forEach((track) => track.stop());
        setIsAutoRecording(false);
      } catch (err) {
        console.warn("[Meeting Audio Recorder] Error stopping recorder:", err);
      }
    }

    let playbackUrl: string | undefined;

    if (isHost && roomName) {
      try {
        console.log(`[Meeting End] Triggering stopRecording for room: "${roomName}"`);
        const stoppedRecording = await stopRecording(roomName);
        setServerRecording(stoppedRecording);
      } catch (err) {
        console.warn("[Meeting End] Could not call stopRecording:", err);
      }
    }

    if (isHost && onEndMeeting) {
      await onEndMeeting({ skipStopRecording: true });
    } else {
      onLeave();
    }

    if (isHost && roomName) {
      const toastId = toast.loading("Uploading recording to storage...");
      try {
        const cleanTitle = (meeting.title || "meeting").replace(/[^a-zA-Z0-9-_]/g, "_");
        playbackUrl = await waitForRecordingPlaybackUrl(roomName);
        toast.loading("Processing stored recording with faster-whisper AI...", { id: toastId });

        const result = await getOrGenerateMeetingTranscript(
          roomName,
          playbackUrl,
          `${cleanTitle}.mp4`
        );
        toast.success("Meeting transcribed successfully!", { id: toastId });
        onTranscriptionResult?.(result);
      } catch (err: any) {
        console.error("Stored recording transcription failed:", err);
        toast.error("Stored recording transcription failed: " + (err?.message || "Error"), { id: toastId });
      }
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    const livekitRoom = new Room({
      adaptiveStream: true,
      dynacast: true,
    });

    setRoom(livekitRoom);

    const updateParticipants = () => {
      if (!isSubscribed) return;
      const list: ParticipantTrackState[] = [];

      // Local participant
      const local = livekitRoom.localParticipant;
      if (local) {
        let videoTrack: Track | null = null;
        let audioTrack: Track | null = null;
        let screenTrack: Track | null = null;

        local.trackPublications.forEach((pub) => {
          if (pub.track) {
            if (pub.source === Track.Source.Camera) videoTrack = pub.track;
            if (pub.source === Track.Source.Microphone) audioTrack = pub.track;
            if (pub.source === Track.Source.ScreenShare) screenTrack = pub.track;
          }
        });

        list.push({
          identity: local.identity,
          name: local.name || local.identity || "You",
          isLocal: true,
          videoTrack,
          audioTrack,
          screenTrack,
          isMicMuted: !local.isMicrophoneEnabled,
          isVideoMuted: !local.isCameraEnabled,
        });
      }

      // Remote participants
      livekitRoom.remoteParticipants.forEach((p: RemoteParticipant) => {
        let videoTrack: Track | null = null;
        let audioTrack: Track | null = null;
        let screenTrack: Track | null = null;

        p.trackPublications.forEach((pub: RemoteTrackPublication) => {
          if (pub.track && pub.isSubscribed) {
            if (pub.source === Track.Source.Camera) videoTrack = pub.track;
            if (pub.source === Track.Source.Microphone) audioTrack = pub.track;
            if (pub.source === Track.Source.ScreenShare) screenTrack = pub.track;
          }
        });

        list.push({
          identity: p.identity,
          name: p.name || p.identity || "Participant",
          isLocal: false,
          videoTrack,
          audioTrack,
          screenTrack,
          isMicMuted: !p.isMicrophoneEnabled,
          isVideoMuted: !p.isCameraEnabled,
        });
      });

      setParticipantTracks(list);
    };

    livekitRoom
      .on(RoomEvent.Connected, () => {
        if (!isSubscribed) return;
        setConnectionState("connected");
        updateParticipants();
        void startMeetingAudioRecording();

        // Publish local mic and camera separately with graceful hardware fallback
        const initMedia = async () => {
          try {
            await livekitRoom.localParticipant.setMicrophoneEnabled(true);
            setIsMicOn(true);
          } catch (micErr: any) {
            console.warn("Could not enable microphone:", micErr);
            setIsMicOn(false);
            toast.warning("Microphone not detected or access denied", { id: "mic-warning" });
          }

          try {
            await livekitRoom.localParticipant.setCameraEnabled(true);
            setIsCamOn(true);
          } catch (camErr: any) {
            console.warn("Could not enable camera:", camErr);
            setIsCamOn(false);
            toast.warning("Camera not detected — connected in audio-only mode", { id: "cam-warning" });
          }

          if (isSubscribed) updateParticipants();
        };

        void initMedia();
      })
      .on(RoomEvent.Disconnected, () => {
        if (!isSubscribed) return;
        setConnectionState("disconnected");
      })
      .on(RoomEvent.ParticipantConnected, () => updateParticipants())
      .on(RoomEvent.ParticipantDisconnected, () => updateParticipants())
      .on(RoomEvent.TrackSubscribed, () => updateParticipants())
      .on(RoomEvent.TrackUnsubscribed, () => updateParticipants())
      .on(RoomEvent.TrackMuted, () => updateParticipants())
      .on(RoomEvent.TrackUnmuted, () => updateParticipants())
      .on(RoomEvent.LocalTrackPublished, () => updateParticipants())
      .on(RoomEvent.LocalTrackUnpublished, () => updateParticipants());

    const connectUrl = tokenResponse.url;
    console.log(`[LiveKit Connect Attempt] URL: "${connectUrl}" Token: "${tokenResponse.token ? "Present" : "Missing"}"`);

    livekitRoom
      .connect(connectUrl, tokenResponse.token)
      .catch((error) => {
        const msg = String(error?.message || "");
        if (msg.includes("Client initiated disconnect") || msg.includes("client_initiated") || msg.includes("USER_INITIATED")) {
          return;
        }
        console.error("[LiveKit Room Connection Failed] URL:", connectUrl, error);
        toast.error(`[LiveKit Connection Failed]: ${msg || "Could not establish LiveKit room connection"}`, { id: "livekit-conn-error" });
        if (isSubscribed) setConnectionState("disconnected");
      });

    return () => {
      isSubscribed = false;
      livekitRoom.disconnect();
    };
  }, [tokenResponse.token, tokenResponse.url]);

  const toggleMic = async () => {
    if (!room) return;
    try {
      const next = !isMicOn;
      await room.localParticipant.setMicrophoneEnabled(next);
      setIsMicOn(next);
    } catch (err: any) {
      toast.error("Microphone error: " + err?.message);
    }
  };

  const toggleCam = async () => {
    if (!room) return;
    try {
      const next = !isCamOn;
      await room.localParticipant.setCameraEnabled(next);
      setIsCamOn(next);
    } catch (err: any) {
      toast.error("Camera error: " + err?.message);
    }
  };

  const toggleScreenShare = async () => {
    if (!room) return;
    try {
      const next = !isScreenSharing;

      // If starting screen share, close camera video feed so screen is shown exclusively
      if (next && isCamOn) {
        try {
          await room.localParticipant.setCameraEnabled(false);
          setIsCamOn(false);
        } catch (camErr) {
          console.warn("Could not disable camera on screen share:", camErr);
        }
      }

      await room.localParticipant.setScreenShareEnabled(next);
      setIsScreenSharing(next);
    } catch (err: any) {
      toast.error("Screen share error: " + err?.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`fixed z-[100] flex flex-col bg-[#07051e] border border-[#5271ff]/30 text-white shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300 ${
        isExpanded
          ? "inset-0 rounded-none"
          : "inset-4 sm:inset-10 md:inset-14 lg:inset-20 rounded-3xl overflow-hidden"
      }`}
    >
      {/* Top Bar Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#030114]/90 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3 items-center justify-center">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
              {meeting.title}
            </h2>
            <p className="text-xs text-white/40 font-medium">
              Live Meeting • Hosted by {meeting.host.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Server Egress Recording Status Badge */}
          {serverRecording &&
            (serverRecording.status === "starting" ||
              serverRecording.status === "active" ||
              serverRecording.status === "ending") && (
              <div className="hidden sm:flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                    serverRecording.status === "active"
                      ? "border-red-500/40 bg-red-500/10 text-red-400"
                      : "border-amber-500/40 bg-amber-500/10 text-amber-300"
                  }`}
                >
                  <Radio className="h-3 w-3 text-red-500 animate-ping" />
                  <span>
                    {serverRecording.status === "starting"
                      ? "Recording starting"
                      : serverRecording.status === "active"
                      ? "Recording"
                      : "Recording stopping"}
                  </span>
                </span>

                {isHost && (
                  <button
                    type="button"
                    disabled={isStoppingServerRecording}
                    onClick={handleStopServerRecording}
                    className="rounded-full border border-rose-500/40 bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300 transition hover:bg-rose-500/30 hover:border-rose-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isStoppingServerRecording ? "Stopping..." : "Stop recording"}
                  </button>
                )}
              </div>
            )}

          {/* Local Audio Recording Fallback Badge */}
          {!serverRecording && isAutoRecording && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
              <Radio className="h-3 w-3 text-red-500 animate-ping" />
              <span>Recording Audio</span>
            </span>
          )}

          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/70">
            <Users className="h-3.5 w-3.5 text-[#5271ff]" />
            {participantTracks.length} {participantTracks.length === 1 ? "person" : "people"}
          </span>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white cursor-pointer"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Video Tile Grid Body */}
      <div className="relative flex-1 bg-[#030114]/60 p-4 overflow-y-auto custom-scrollbar">
        {connectionState === "connecting" ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-white/50">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#5271ff] border-t-transparent" />
            <p className="text-sm font-semibold">Connecting to LiveKit room...</p>
          </div>
        ) : participantTracks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-white/40">
            <Users className="h-10 w-10 text-white/20" />
            <p className="text-sm font-medium">Waiting for participants to join...</p>
          </div>
        ) : (
          <div
            className={`grid gap-4 h-full w-full ${
              participantTracks.length === 1
                ? "grid-cols-1 max-w-4xl mx-auto"
                : participantTracks.length === 2
                ? "grid-cols-1 md:grid-cols-2"
                : participantTracks.length <= 4
                ? "grid-cols-2"
                : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {participantTracks.map((p) => (
              <ParticipantTile key={p.identity} participant={p} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="flex h-20 shrink-0 items-center justify-between border-t border-white/[0.08] bg-[#030114]/90 px-6 backdrop-blur-xl">
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-white/40">
          <Volume2 className="h-4 w-4 text-[#5271ff]" />
          <span>Live Audio Active</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 mx-auto sm:mx-0">
          {/* Mute Mic */}
          <button
            type="button"
            onClick={toggleMic}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 cursor-pointer ${
              isMicOn
                ? "border-white/10 bg-white/[0.06] text-white hover:bg-white/10"
                : "border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
            }`}
          >
            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          {/* Camera On/Off */}
          <button
            type="button"
            onClick={toggleCam}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 cursor-pointer ${
              isCamOn
                ? "border-white/10 bg-white/[0.06] text-white hover:bg-white/10"
                : "border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
            }`}
          >
            {isCamOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>

          {/* Screen Share */}
          <button
            type="button"
            onClick={toggleScreenShare}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 cursor-pointer ${
              isScreenSharing
                ? "border-[#5271ff]/50 bg-[#5271ff]/20 text-[#5271ff] shadow-[0_0_15px_rgba(82,113,255,0.3)]"
                : "border-white/10 bg-white/[0.06] text-white hover:bg-white/10"
            }`}
          >
            <Monitor className="h-5 w-5" />
          </button>

          {/* Leave Button */}
          <button
            type="button"
            onClick={handleFinalizeAndTranscribe}
            className="flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/20 px-5 py-3 text-xs font-bold text-rose-300 transition hover:bg-rose-500/30 hover:border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.25)] cursor-pointer"
          >
            <PhoneOff className="h-4 w-4" />
            <span>{isHost ? "Leave & End Meeting" : "Leave"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Individual Participant Video & Audio Box
function ParticipantTile({ participant }: { participant: ParticipantTrackState }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeVideoTrack = participant.screenTrack || participant.videoTrack;
  const isSharingScreen = Boolean(participant.screenTrack);

  useEffect(() => {
    const el = videoRef.current;
    if (el && activeVideoTrack) {
      activeVideoTrack.attach(el);
    }
    return () => {
      if (el && activeVideoTrack) {
        activeVideoTrack.detach(el);
      }
    };
  }, [activeVideoTrack]);

  useEffect(() => {
    const el = audioRef.current;
    if (el && participant.audioTrack && !participant.isLocal) {
      participant.audioTrack.attach(el);
    }
    return () => {
      if (el && participant.audioTrack && !participant.isLocal) {
        participant.audioTrack.detach(el);
      }
    };
  }, [participant.audioTrack, participant.isLocal]);

  return (
    <div
      className={`relative flex h-full min-h-[220px] w-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 bg-[#0c0a2f]/80 backdrop-blur-md shadow-lg group ${
        isSharingScreen
          ? "border-[#5271ff]/60 shadow-[0_0_30px_rgba(82,113,255,0.25)]"
          : "border-white/10"
      }`}
    >
      {activeVideoTrack && (!participant.isVideoMuted || isSharingScreen) ? (
        <video
          ref={videoRef}
          className={`h-full w-full ${isSharingScreen ? "object-contain bg-black" : "object-cover"}`}
          autoPlay
          playsInline
          muted={participant.isLocal}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#0c0a2f]/90">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#5271ff]/40 bg-[#5271ff]/15 text-2xl font-extrabold text-white shadow-[0_0_20px_rgba(82,113,255,0.3)]">
            {participant.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        </div>
      )}

      {/* Audio element for remote participant sound */}
      {!participant.isLocal && <audio ref={audioRef} autoPlay />}

      {/* Name and Mute Overlay Badge */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl border border-white/10 bg-black/65 px-3 py-1.5 backdrop-blur-md">
        <span className="truncate text-xs font-semibold text-white flex items-center gap-1.5">
          {isSharingScreen && <Monitor className="h-3.5 w-3.5 text-[#5271ff] animate-pulse" />}
          {participant.name} {participant.isLocal ? "(You)" : ""} {isSharingScreen ? "• Sharing Screen" : ""}
        </span>

        <span className="flex items-center gap-1">
          {participant.isMicMuted ? (
            <MicOff className="h-3.5 w-3.5 text-rose-400" />
          ) : (
            <Mic className="h-3.5 w-3.5 text-emerald-400" />
          )}
        </span>
      </div>
    </div>
  );
}
