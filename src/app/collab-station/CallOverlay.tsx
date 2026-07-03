"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, Phone, PhoneOff, Shield, X } from "lucide-react";
import { Room, RoomEvent, Track } from "livekit-client";
import { CallDto, CallTokenResponse } from "./callTypes";

interface CallOverlayProps {
  call: CallDto | null;
  currentUserId?: number;
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

  const isRecipient = call?.recipient.user_id === currentUserId;
  const otherUser = useMemo(() => {
    if (!call) return null;
    return call.caller.user_id === currentUserId ? call.recipient : call.caller;
  }, [call, currentUserId]);

  useEffect(() => {
    if (call?.status !== "active" || !credentials) return;

    const room = new Room({ adaptiveStream: true, dynacast: true });
    roomRef.current = room;

    const attachTrack = (track: { kind: Track.Kind; attach: () => HTMLMediaElement }) => {
      if (track.kind !== Track.Kind.Audio || !audioContainerRef.current) return;
      audioContainerRef.current.appendChild(track.attach());
    };

    const detachTrack = (track: { detach: () => HTMLMediaElement[] }) => {
      track.detach().forEach((element) => element.remove());
    };

    room.on(RoomEvent.TrackSubscribed, attachTrack);
    room.on(RoomEvent.TrackUnsubscribed, detachTrack);
    room.on(RoomEvent.Disconnected, () => setMediaError("Media connection ended"));

    room
      .connect(credentials.url, credentials.token)
      .then(() => room.localParticipant.setMicrophoneEnabled(true))
      .catch((reason) => setMediaError(reason instanceof Error ? reason.message : "Unable to connect audio"));

    return () => {
      room.disconnect();
      roomRef.current = null;
      audioContainerRef.current?.replaceChildren();
    };
  }, [call?.status, credentials]);

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
          <div ref={audioContainerRef} className="hidden" />
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
