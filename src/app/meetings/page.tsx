"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Play,
  PhoneOff,
  Radio,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import MeetingTranscriptionModal from "./MeetingTranscriptionModal";
import { TranscriptionResult, transcribeUrlApi } from "./apis/transcribeApi";
import { getRecording, stopRecording, getRecordingPlaybackUrl, getOrGenerateMeetingTranscript } from "./apis/recordingApi";
import { MeetingRecording } from "./types/recordingTypes";
import {
  MeetingResponseDto,
  MeetingStatus,
  MeetingTokenResponse,
  CreateMeetingPayload,
} from "./types/meetingTypes";
import {
  getMeetingsApi,
  startMeetingApi,
  joinMeetingApi,
  leaveMeetingApi,
  endMeetingApi,
  cancelMeetingApi,
  getMeetingTokenApi,
  createMeetingApi,
} from "./apis/meetingsApi";
import {
  emitStartMeeting,
  emitJoinMeeting,
  emitLeaveMeeting,
  emitEndMeeting,
  emitCancelMeeting,
  emitCreateMeeting,
  subscribeMeetingSocketEvents,
} from "./meetingSocket";
import CreateMeetingModal from "./CreateMeetingModal";
import MeetingRoomModal from "./MeetingRoomModal";
import { getCollabGroupsApi } from "./apis/meetingsApi";
import { useRealtime } from "@/context/RealtimeContext";

type TabFilter = "all" | "live" | "scheduled" | "ended";

function MeetingRecordingCardButton({
  meeting,
  onTranscribeResult,
}: {
  meeting: MeetingResponseDto;
  onTranscribeResult?: (result: TranscriptionResult) => void;
}) {
  const [recording, setRecording] = useState<MeetingRecording | null>(null);
  const [isLoadingPlayback, setIsLoadingPlayback] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const roomName = meeting.roomName || meeting.meetingId;

  useEffect(() => {
    if (!roomName) return;
    let isMounted = true;

    getRecording(roomName).then((rec) => {
      if (isMounted && rec) {
        setRecording(rec);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [roomName]);

  if (!recording) return null;

  const handlePlayRecording = async () => {
    if (!roomName || isLoadingPlayback) return;
    try {
      setIsLoadingPlayback(true);
      let url = recording?.playbackUrl;
      if (!url) {
        url = await getRecordingPlaybackUrl(roomName);
      }
      if (url) {
        window.open(url, "_blank");
      } else {
        toast.error("Playback URL not available");
      }
    } catch (err: any) {
      console.error("[Recording Playback URL Failed]", err);
      toast.error(err?.message || "Recording is still processing");
    } finally {
      setIsLoadingPlayback(false);
    }
  };

  const handleTranscribeRecording = async () => {
    if (!roomName || isTranscribing) return;
    const toastId = toast.loading("Checking transcript status...");
    try {
      setIsTranscribing(true);
      const cleanTitle = (meeting.title || "meeting").replace(/[^a-zA-Z0-9-_]/g, "_");

      // 1. Checks GET /api/recordings/:roomName/transcript for existing transcript
      // 2. If missing, generates via faster-whisper AI once and saves via POST /api/recordings/:roomName/transcript
      const result = await getOrGenerateMeetingTranscript(
        roomName,
        recording?.playbackUrl || undefined,
        `${cleanTitle}.mp4`
      );

      toast.success("Meeting transcript ready!", { id: toastId });
      onTranscribeResult?.(result);
    } catch (err: any) {
      console.error("Recording URL transcription error:", err);
      toast.error(err?.message || "Failed to load transcript", { id: toastId });
    } finally {
      setIsTranscribing(false);
    }
  };

  if (recording.status === "complete" && (recording.playbackUrl || recording.filePath || recording.fileLocation)) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={isLoadingPlayback}
          onClick={handlePlayRecording}
          className="flex items-center gap-1.5 rounded-xl border border-[#5271ff]/40 bg-[#5271ff]/15 px-3 py-1.5 text-xs font-bold text-[#8fa2ff] hover:bg-[#5271ff]/30 transition cursor-pointer disabled:opacity-50"
        >
          <Play className="h-3.5 w-3.5" />
          <span>{isLoadingPlayback ? "Loading..." : "Play"}</span>
        </button>

        <button
          type="button"
          disabled={isTranscribing}
          onClick={handleTranscribeRecording}
          className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>{isTranscribing ? "Transcribing..." : "Transcribe"}</span>
        </button>
      </div>
    );
  }

  if (recording.status === "ending" || recording.status === "starting" || recording.status === "active") {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
        <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
        <span>{recording.status === "ending" ? "Processing recording..." : "Recording"}</span>
      </span>
    );
  }

  if (recording.status === "failed") {
    return (
      <span className="text-[11px] font-semibold text-rose-400" title={recording.error || "Recording failed"}>
        Recording failed
      </span>
    );
  }

  return null;
}

function getMeetingId(m: any): string {
  return String(m?.meetingId || m?.id || m?.meeting_id || "");
}

export default function MeetingsPage() {
  const rt = useRealtime();
  const [meetings, setMeetings] = useState<MeetingResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const currentUserId = Number(rt.currentUserId || 0);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTranscribeModalOpen, setIsTranscribeModalOpen] = useState(false);
  const [autoTranscriptionResult, setAutoTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [activeMeeting, setActiveMeeting] = useState<MeetingResponseDto | null>(null);
  const [livekitToken, setLivekitToken] = useState<MeetingTokenResponse | null>(null);

  // Fetch initial meetings list and groups
  const fetchMeetingsData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getMeetingsApi(50);
      setMeetings(data.items || []);
    } catch (err: any) {
      console.error("Failed to load meetings:", err);
      toast.error(err?.message || "Failed to load meetings list");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetingsData();
  }, [fetchMeetingsData]);

  // Load available collab groups for scheduling
  useEffect(() => {
    async function loadGroups() {
      try {
        const collabGroups = await getCollabGroupsApi();
        setGroups(
          collabGroups.map((g) => ({
            id: g.id,
            name: g.name || "Unnamed Group",
          }))
        );
      } catch (err) {
        console.warn("Could not load collab groups for meetings:", err);
      }
    }
    loadGroups();
  }, []);

  // Subscribe to real-time meeting events (page-specific list updates)
  // Socket is already connected by RealtimeProvider
  useEffect(() => {
    const unsubscribe = subscribeMeetingSocketEvents({
      onCreated: (newMeeting) => {
        const targetId = getMeetingId(newMeeting);
        setMeetings((prev) => [newMeeting, ...prev.filter((m) => getMeetingId(m) !== targetId)]);
        toast.info(`New meeting created: ${newMeeting.title}`);
      },
      onStarted: (startedMeeting) => {
        const targetId = getMeetingId(startedMeeting);
        setMeetings((prev) =>
          prev.map((m) => (getMeetingId(m) === targetId ? { ...m, ...startedMeeting, status: "live" } : m))
        );
        toast.success(`Meeting is now live: ${startedMeeting.title}`);
      },
      onJoined: ({ meeting: updatedMeeting }) => {
        const targetId = getMeetingId(updatedMeeting);
        setMeetings((prev) =>
          prev.map((m) => (getMeetingId(m) === targetId ? { ...m, ...updatedMeeting } : m))
        );
      },
      onLeft: ({ meeting: updatedMeeting }) => {
        const targetId = getMeetingId(updatedMeeting);
        setMeetings((prev) =>
          prev.map((m) => (getMeetingId(m) === targetId ? { ...m, ...updatedMeeting } : m))
        );
      },
      onEnded: (endedMeeting) => {
        const targetId = getMeetingId(endedMeeting);
        setMeetings((prev) =>
          prev.map((m) => (getMeetingId(m) === targetId ? { ...m, ...endedMeeting, status: "ended" } : m))
        );
        if (getMeetingId(activeMeeting) === targetId) {
          setActiveMeeting(null);
          setLivekitToken(null);
          toast.info("Meeting has ended.");
        }
      },
      onCancelled: (cancelledMeeting) => {
        const targetId = getMeetingId(cancelledMeeting);
        setMeetings((prev) =>
          prev.map((m) => (getMeetingId(m) === targetId ? { ...m, ...cancelledMeeting, status: "cancelled" } : m))
        );
        if (getMeetingId(activeMeeting) === targetId) {
          setActiveMeeting(null);
          setLivekitToken(null);
          toast.info("Meeting was cancelled by host.");
        }
      },
    });

    return () => {
      unsubscribe();
    };
  }, [activeMeeting]);

  // Create meeting submit handler
  const handleCreateMeeting = async (payload: CreateMeetingPayload, isInstant: boolean) => {
    try {
      let created: MeetingResponseDto;
      try {
        created = await emitCreateMeeting(payload);
      } catch {
        created = await createMeetingApi(payload);
      }
      const createdId = getMeetingId(created);
      setMeetings((prev) => [created, ...prev.filter((m) => getMeetingId(m) !== createdId)]);

      if (isInstant) {
        let liveMeeting: MeetingResponseDto;
        try {
          liveMeeting = await emitStartMeeting(createdId);
        } catch {
          liveMeeting = await startMeetingApi(createdId);
        }

        const liveId = getMeetingId(liveMeeting) || createdId;
        setMeetings((prev) =>
          prev.map((m) => (getMeetingId(m) === liveId ? { ...m, ...liveMeeting, status: "live" } : m))
        );

        await handleJoinMeeting({ ...created, ...liveMeeting, status: "live" });
        toast.success("Instant meeting started live!");
      } else {
        toast.success("Meeting scheduled successfully!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to create meeting");
    }
  };

  // Host Action: Start Meeting
  const handleStartMeeting = async (meeting: MeetingResponseDto) => {
    const targetId = getMeetingId(meeting);
    try {
      let updated: MeetingResponseDto;
      try {
        updated = await emitStartMeeting(targetId);
      } catch {
        updated = await startMeetingApi(targetId);
      }
      setMeetings((prev) =>
        prev.map((m) => (getMeetingId(m) === targetId ? { ...m, ...updated, status: "live" } : m))
      );
      toast.success("Meeting started! You can now join.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to start meeting");
    }
  };

  // Host Action: Cancel Meeting
  const handleCancelMeeting = async (meeting: MeetingResponseDto) => {
    const targetId = getMeetingId(meeting);
    try {
      let updated: MeetingResponseDto;
      try {
        updated = await emitCancelMeeting(targetId);
      } catch {
        updated = await cancelMeetingApi(targetId);
      }
      setMeetings((prev) =>
        prev.map((m) => (getMeetingId(m) === targetId ? { ...m, ...updated, status: "cancelled" } : m))
      );
      toast.info("Meeting cancelled.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel meeting");
    }
  };

  // Host Action: End Meeting
  const handleEndMeeting = async (meeting: MeetingResponseDto) => {
    const targetId = getMeetingId(meeting);
    const roomName = meeting.roomName || meeting.meetingId;

    // Trigger stopRecording to tell NestJS / LiveKit to stop Egress and upload recording to MinIO bucket
    if (roomName) {
      stopRecording(roomName).catch((err) => {
        console.warn("[Meeting End] stopRecording error:", err);
      });
    }

    // Optimistically update local meetings list to status ended
    setMeetings((prev) =>
      prev.map((m) =>
        getMeetingId(m) === targetId ? { ...m, status: "ended" } : m
      )
    );

    if (getMeetingId(activeMeeting) === targetId) {
      setActiveMeeting(null);
      setLivekitToken(null);
    }

    try {
      try {
        await emitEndMeeting(targetId);
      } catch (e) {
        console.warn("Socket end meeting error:", e);
      }

      await endMeetingApi(targetId);
      toast.info("Meeting ended.");
    } catch (err: any) {
      console.warn("Failed to end meeting on backend:", err);
    }
  };

  // Participant Action: Join Meeting
  const handleJoinMeeting = async (meeting: MeetingResponseDto) => {
    if (meeting.status !== "live") {
      toast.error("Meeting is not live yet.");
      return;
    }

    try {
      const meetingId = getMeetingId(meeting);
      try {
        await emitJoinMeeting(meetingId);
      } catch {
        await joinMeetingApi(meetingId);
      }

      // 2. Fetch LiveKit token
      const tokenRes = await getMeetingTokenApi(meetingId);

      setActiveMeeting(meeting);
      setLivekitToken(tokenRes);
    } catch (err: any) {
      toast.error(err?.message || "Failed to join LiveKit room");
    }
  };

  // Leave active meeting
  const handleLeaveActiveMeeting = async () => {
    if (!activeMeeting) return;
    const hostId = Number(activeMeeting.host?.user_id || 0);
    const myId = Number(currentUserId || 0);
    const isHost = hostId > 0 && myId > 0 && hostId === myId;

    if (isHost) {
      await handleEndMeeting(activeMeeting);
      return;
    }

    try {
      const targetId = getMeetingId(activeMeeting);
      try {
        await emitLeaveMeeting(targetId);
      } catch {
        await leaveMeetingApi(targetId);
      }
    } catch (err) {
      console.warn("Error leaving meeting:", err);
    } finally {
      setActiveMeeting(null);
      setLivekitToken(null);
      toast.info("Left meeting room.");
    }
  };

  // Filter meetings list
  const filteredMeetings = meetings.filter((m) => {
    if (activeTab === "live" && m.status !== "live") return false;
    if (activeTab === "scheduled" && m.status !== "scheduled") return false;
    if (activeTab === "ended" && m.status !== "ended" && m.status !== "cancelled") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchHost = m.host?.name?.toLowerCase().includes(q);
      const matchGroup = m.groupName?.toLowerCase().includes(q);
      return matchTitle || matchHost || matchGroup;
    }
    return true;
  });

  const getStatusBadge = (status: MeetingStatus) => {
    switch (status) {
      case "live":
        return (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <Radio className="h-3 w-3 animate-pulse text-emerald-400" />
            LIVE NOW
          </span>
        );
      case "scheduled":
        return (
          <span className="flex items-center gap-1.5 rounded-full border border-sky-500/40 bg-sky-500/15 px-3 py-1 text-xs font-bold text-sky-400">
            <Clock className="h-3 w-3" />
            Scheduled
          </span>
        );
      case "ended":
        return (
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/50">
            <CheckCircle2 className="h-3 w-3 text-white/40" />
            Ended
          </span>
        );
      case "cancelled":
        return (
          <span className="flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
            <XCircle className="h-3 w-3" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030114] text-white">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#5271ff]/[0.08] blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 right-0 h-[450px] w-[450px] rounded-full bg-[#a78bfa]/[0.06] blur-[130px]" />

      <div className="relative z-10 space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Video className="h-8 w-8 text-[#5271ff]" />
              Group Video Meetings
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-white/50">
              LiveKit audio & video conferencing integrated with your team collaboration station.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchMeetingsData}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] cursor-pointer transition"
              title="Refresh Meetings"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-[#5271ff]" : ""}`} />
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-5 py-3 text-xs font-extrabold text-white shadow-[0_0_20px_rgba(82,113,255,0.35)] hover:scale-[1.02] transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New Meeting</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 p-1.5 backdrop-blur-xl">
            {(["all", "live", "scheduled", "ended"] as TabFilter[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#5271ff] text-white shadow-[0_0_15px_rgba(82,113,255,0.3)]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/60 pl-10 pr-4 text-xs text-white placeholder-white/30 outline-none transition focus:border-[#5271ff]"
            />
          </div>
        </div>

        {/* Meetings Cards Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/40">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5271ff] border-t-transparent" />
            <p className="text-xs font-semibold">Loading meetings...</p>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-[#0a0826]/40 py-20 px-4 text-center">
            <Video className="h-12 w-12 text-white/20 mb-3" />
            <h3 className="text-base font-bold text-white">No Meetings Found</h3>
            <p className="mt-1 text-xs text-white/40 max-w-sm">
              There are no group meetings matching your current filter. Create a new meeting to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredMeetings.map((meeting) => {
              const isHost = meeting.host?.user_id === currentUserId;

              return (
                <motion.div
                  key={meeting.meetingId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/80 p-6 backdrop-blur-xl transition duration-300 hover:border-[#5271ff]/40 hover:bg-[#0a0826]/95 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                >
                  {/* Top Header Card Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      {getStatusBadge(meeting.status)}
                      <span className="text-[10px] font-semibold text-white/40">
                        {meeting.groupName || "Group Meeting"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-[#5271ff] transition">
                      {meeting.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-white/60">
                      <p className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-white/40" />
                        <span>Host: <strong className="text-white">{meeting.host?.name || "Host"}</strong></span>
                      </p>

                      {meeting.startsAt && (
                        <p className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-white/40" />
                          <span>Starts: {new Date(meeting.startsAt).toLocaleString()}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Controls */}
                  <div className="mt-6 border-t border-white/[0.08] pt-4 flex items-center justify-between gap-2">
                    <div className="text-[10px] text-white/40">
                      {meeting.participants?.length || 0} participants
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Meeting Recording Action Button / Status */}
                      <MeetingRecordingCardButton
                        meeting={meeting}
                        onTranscribeResult={(res) => {
                          setAutoTranscriptionResult(res);
                          setIsTranscribeModalOpen(true);
                        }}
                      />

                      {/* Host: Start Meeting button */}
                      {isHost && meeting.status === "scheduled" && (
                        <button
                          type="button"
                          onClick={() => handleStartMeeting(meeting)}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition cursor-pointer"
                        >
                          <Play className="h-3.5 w-3.5" />
                          Start
                        </button>
                      )}

                      {/* Host: Cancel Meeting button */}
                      {isHost && meeting.status === "scheduled" && (
                        <button
                          type="button"
                          onClick={() => handleCancelMeeting(meeting)}
                          className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}

                      {/* Participant / Host: Join Live Meeting button */}
                      {meeting.status === "live" && (
                        <button
                          type="button"
                          onClick={() => handleJoinMeeting(meeting)}
                          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-extrabold text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:scale-[1.02] transition cursor-pointer animate-pulse"
                        >
                          <Video className="h-3.5 w-3.5" />
                          Join Live
                        </button>
                      )}

                      {/* Host: End Live Meeting button */}
                      {isHost && meeting.status === "live" && (
                        <button
                          type="button"
                          onClick={() => handleEndMeeting(meeting)}
                          className="flex items-center gap-1 rounded-xl bg-rose-600/80 px-3 py-2 text-xs font-bold text-white hover:bg-rose-600 transition cursor-pointer"
                        >
                          End
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Schedule / Start Modal */}
      {isCreateModalOpen && (
        <CreateMeetingModal
          groups={groups}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateMeeting}
        />
      )}

      {/* Meeting Audio Transcription Modal */}
      <MeetingTranscriptionModal
        isOpen={isTranscribeModalOpen}
        initialResult={autoTranscriptionResult}
        onClose={() => {
          setIsTranscribeModalOpen(false);
          setAutoTranscriptionResult(null);
        }}
      />

      {/* Active LiveKit Video Conference Overlay */}
      {activeMeeting && livekitToken && (
        <MeetingRoomModal
          meeting={activeMeeting}
          tokenResponse={livekitToken}
          currentUserId={currentUserId}
          onLeave={handleLeaveActiveMeeting}
          onEndMeeting={() => handleEndMeeting(activeMeeting)}
          onTranscriptionResult={(res) => {
            setAutoTranscriptionResult(res);
            setIsTranscribeModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
