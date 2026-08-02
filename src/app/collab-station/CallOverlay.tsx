"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, Phone, PhoneOff, Shield, X } from "lucide-react";
import { ConnectionState, Room, RoomEvent, Track } from "livekit-client";
import { CallDto, CallTokenResponse } from "./callTypes";

interface CallOverlayProps {
  call: CallDto | null;
  currentUserId?: number | string;
  callSide?: "caller" | "recipient";
  credentials: CallTokenResponse | null;
  error?: string;
  onAccept: () => void;
  onReject: () => void;
  onCancel: () => void;
  onEnd: () => void;
}

export default function CallOverlay({
  call,
  currentUserId,
  callSide,
  credentials,
  error,
  onAccept,
  onReject,
  onCancel,
  onEnd,
}: CallOverlayProps) {
  const roomRef = useRef<Room | null>(null);
  const audioContainerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [mediaError, setMediaError] = useState("");
  const [audioPlaybackBlocked, setAudioPlaybackBlocked] = useState(false);
  const [microphonePublished, setMicrophonePublished] = useState(false);
  const [remoteAudioConnected, setRemoteAudioConnected] = useState(false);
  const isMutedRef = useRef(false);

  const isCurrentUser = useCallback(
    (userId?: number | string) =>
      userId !== undefined &&
      currentUserId !== undefined &&
      String(userId) === String(currentUserId),
    [currentUserId]
  );

  const isRecipient = callSide
    ? callSide === "recipient"
    : isCurrentUser(call?.recipient.user_id);
  const otherUser = useMemo(() => {
    if (!call) return null;
    if (callSide === "caller") return call.recipient;
    if (callSide === "recipient") return call.caller;
    return isCurrentUser(call.caller.user_id) ? call.recipient : call.caller;
  }, [call, callSide, isCurrentUser]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const credentialsUrl = credentials?.url;
    const credentialsToken = credentials?.token;

    if (call?.status !== "active" || !credentialsUrl || !credentialsToken) return;

    let disposed = false;
    let microphonePublishInFlight = false;
    let microphoneRecoveryTimeout: number | undefined;
    let microphoneWatchdog: number | undefined;
    const audioContainer = audioContainerRef.current;
    const room = new Room({ adaptiveStream: true, dynacast: true });
    roomRef.current = room;

    const getMicrophonePublication = () =>
      room.localParticipant.getTrackPublication(Track.Source.Microphone);

    const hasLiveMicrophonePublication = () => {
      const publication = getMicrophonePublication();
      const mediaTrack = publication?.track?.mediaStreamTrack;
      return Boolean(publication && mediaTrack && mediaTrack.readyState === "live");
    };

    const updateMicrophoneState = () => {
      setMicrophonePublished(hasLiveMicrophonePublication());
    };

    const scheduleMicrophoneRecovery = (delayMs = 800) => {
      if (disposed || isMutedRef.current || microphoneRecoveryTimeout) return;

      microphoneRecoveryTimeout = window.setTimeout(() => {
        microphoneRecoveryTimeout = undefined;
        void publishMicrophone();
      }, delayMs);
    };

    const publishMicrophone = async () => {
      if (
        disposed ||
        isMutedRef.current ||
        microphonePublishInFlight ||
        room.state !== ConnectionState.Connected
      ) {
        return;
      }
      microphonePublishInFlight = true;
      try {
        await room.localParticipant.setMicrophoneEnabled(true, {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        });
        if (!disposed) {
          updateMicrophoneState();
          setMediaError("");
        }
      } catch (reason) {
        if (!disposed) {
          const connectionState = room.state as ConnectionState;
          setMicrophonePublished(false);
          setMediaError(
            connectionState === ConnectionState.Reconnecting
              ? "Media connection interrupted. Reconnecting…"
              : reason instanceof Error
                ? reason.message
                : "Unable to publish microphone audio"
          );
        }
      } finally {
        microphonePublishInFlight = false;
      }
    };

    const attachExistingRemoteAudio = () => {
      let foundRemote = false;
      room.remoteParticipants.forEach((participant) => {
        participant.audioTrackPublications.forEach((publication) => {
          if (publication.track) {
            attachTrack(publication.track);
            foundRemote = true;
          } else if (!publication.isSubscribed) {
            publication.setSubscribed(true);
          }
        });
      });
      if (foundRemote) {
        setRemoteAudioConnected(true);
      }
    };

    const attachTrack = (track: {
      kind: Track.Kind;
      sid?: string;
      mediaStreamTrack?: MediaStreamTrack;
      attach: () => HTMLMediaElement;
    }) => {
      if (track.kind !== Track.Kind.Audio || !audioContainer) return;
      if (
        audioContainer.querySelector(
          `[data-livekit-track-id="${trackId(track)}"]`
        )
      ) {
        setRemoteAudioConnected(true);
        return;
      }
      const element = track.attach();
      element.dataset.livekitTrackId = trackId(track);
      element.autoplay = true;
      audioContainer.appendChild(element);
      setRemoteAudioConnected(true);
      void element.play().catch(() => setAudioPlaybackBlocked(true));
    };

    const trackId = (track: { sid?: string; mediaStreamTrack?: MediaStreamTrack }) =>
      track.sid || track.mediaStreamTrack?.id || "audio";

    const detachTrack = (track: { detach: () => HTMLMediaElement[] }) => {
      track.detach().forEach((element) => element.remove());
      setRemoteAudioConnected(audioContainer?.children.length ? true : false);
    };

    room.on(RoomEvent.TrackSubscribed, (track) => {
      attachTrack(track);
      setRemoteAudioConnected(true);
    });
    room.on(RoomEvent.TrackUnsubscribed, detachTrack);
    room.on(RoomEvent.ParticipantConnected, () => attachExistingRemoteAudio());
    room.on(RoomEvent.ParticipantDisconnected, () => attachExistingRemoteAudio());
    room.on(RoomEvent.TrackPublished, () => attachExistingRemoteAudio());
    room.on(RoomEvent.Disconnected, () => {
      setMicrophonePublished(false);
      setRemoteAudioConnected(false);
      setMediaError("Media connection ended");
    });
    room.on(RoomEvent.AudioPlaybackStatusChanged, () => {
      setAudioPlaybackBlocked(!room.canPlaybackAudio);
    });
    room.on(RoomEvent.LocalTrackPublished, (publication) => {
      if (publication.source === Track.Source.Microphone) updateMicrophoneState();
    });
    room.on(RoomEvent.LocalTrackUnpublished, (publication) => {
      if (publication.source === Track.Source.Microphone) {
        setMicrophonePublished(false);
        scheduleMicrophoneRecovery();
      }
    });
    room.on(RoomEvent.LocalAudioSilenceDetected, () => {
      setMediaError("No microphone audio is being detected. Check the selected input device.");
    });
    room.on(RoomEvent.MediaDevicesError, (reason) => {
      setMediaError(reason.message || "The microphone could not be accessed");
      scheduleMicrophoneRecovery(1500);
    });
    room.on(RoomEvent.TrackSubscriptionFailed, () => {
      setMediaError("The other participant's audio track could not be received");
    });
    room.on(RoomEvent.Reconnecting, () => {
      if (!disposed) setMediaError("Media connection interrupted. Reconnecting…");
    });
    room.on(RoomEvent.Reconnected, () => {
      if (!disposed) {
        setMediaError("");
        attachExistingRemoteAudio();
        void publishMicrophone();
      }
    });

    const connectUrl = credentialsUrl.trim();

    room
      .connect(connectUrl, credentialsToken)
      .then(async () => {
        if (disposed) return;
        setAudioPlaybackBlocked(!room.canPlaybackAudio);
        attachExistingRemoteAudio();
        await publishMicrophone();
        microphoneWatchdog = window.setInterval(() => {
          if (disposed || isMutedRef.current || room.state !== ConnectionState.Connected) return;
          attachExistingRemoteAudio();
          if (!hasLiveMicrophonePublication()) {
            setMicrophonePublished(false);
            scheduleMicrophoneRecovery();
          }
        }, 2000);
      })
      .catch((reason) => {
        if (!disposed) {
          setMediaError(reason instanceof Error ? reason.message : "Unable to connect audio");
        }
      });

    return () => {
      disposed = true;
      if (microphoneRecoveryTimeout) window.clearTimeout(microphoneRecoveryTimeout);
      if (microphoneWatchdog) window.clearInterval(microphoneWatchdog);
      room.disconnect();
      roomRef.current = null;
      audioContainer?.replaceChildren();
      setMicrophonePublished(false);
      setRemoteAudioConnected(false);
    };
  }, [call?.callId, call?.status, credentials?.token, credentials?.url]);

  useEffect(() => {
    if (call?.status !== "active") {
      setSeconds(0);
      return;
    }
    const startedAt = call.answeredAt ? new Date(call.answeredAt).getTime() : Date.now();
    const update = () => setSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [call?.status, call?.answeredAt]);

  const toggleMute = async () => {
    const nextMuted = !isMuted;
    await roomRef.current?.localParticipant.setMicrophoneEnabled(!nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) {
      setMediaError("");
    }
  };

  const enableAudioPlayback = async () => {
    try {
      await roomRef.current?.startAudio();
      setAudioPlaybackBlocked(false);
    } catch {
      setMediaError("Browser audio playback is blocked. Allow sound for this site and retry.");
    }
  };

  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <AnimatePresence>
      {call && (call.status === "ringing" || call.status === "active") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#030114]/95 backdrop-blur-2xl"
        >
          <div
            ref={audioContainerRef}
            className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_#5271ff_1px,_transparent_1px)] [background-size:24px_24px] opacity-10" />
          <div className="pointer-events-none absolute h-[480px] w-[480px] rounded-full bg-[#5271ff]/10 blur-[140px]" />

          <div className="relative flex w-full max-w-md flex-col items-center px-6 text-center">
            <div className="mb-8 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <Shield size={12} /> Encrypted voice call
            </div>

            <div className="relative mb-7 flex h-36 w-36 items-center justify-center rounded-full border-2 border-white/10 bg-gradient-to-tr from-[#5271ff] to-[#3a4ec4] text-4xl font-bold text-white shadow-[0_0_40px_rgba(82,113,255,0.4)]">
              {otherUser?.name?.slice(0, 2).toUpperCase() || "??"}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 -z-10 rounded-full border border-[#5271ff]"
              />
            </div>

            <h2 className="text-2xl font-bold text-white">{otherUser?.name || "Voice call"}</h2>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/45">
              {call.status === "active"
                ? credentials
                  ? time
                  : "Connecting audio…"
                : isRecipient
                  ? "Incoming voice call"
                  : "Calling…"}
            </p>

            {(error || mediaError) && (
              <p className="mt-4 max-w-sm text-xs text-rose-400">{error || mediaError}</p>
            )}

            {call.status === "active" && (
              <div className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-wider text-white/40">
                <span className={microphonePublished ? "text-emerald-400" : "text-rose-400"}>
                  Mic {microphonePublished ? "live" : "offline"}
                </span>
                <span>•</span>
                <span className={remoteAudioConnected ? "text-emerald-400" : "text-amber-400"}>
                  Remote audio {remoteAudioConnected ? "connected" : "waiting"}
                </span>
              </div>
            )}

            {audioPlaybackBlocked && (
              <button
                type="button"
                onClick={enableAudioPlayback}
                className="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-300"
              >
                Enable speaker audio
              </button>
            )}

            <div className="mt-12 flex items-center gap-5 rounded-2xl border border-white/10 bg-[#0c0a2d]/80 px-6 py-4 backdrop-blur-lg">
              {call.status === "ringing" && isRecipient ? (
                <>
                  <button onClick={onReject} className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white" aria-label="Reject call">
                    <X size={22} />
                  </button>
                  <button onClick={onAccept} className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white" aria-label="Accept call">
                    <Phone size={22} />
                  </button>
                </>
              ) : (
                <>
                  {call.status === "active" && (
                    <button onClick={toggleMute} className={`flex h-12 w-12 items-center justify-center rounded-full border ${isMuted ? "border-rose-500/40 bg-rose-500/25 text-rose-400" : "border-white/10 bg-white/5 text-white"}`} aria-label={isMuted ? "Unmute" : "Mute"}>
                      {isMuted ? <MicOff size={19} /> : <Mic size={19} />}
                    </button>
                  )}
                  <button onClick={call.status === "active" ? onEnd : onCancel} className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white" aria-label="End call">
                    <PhoneOff size={22} />
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
