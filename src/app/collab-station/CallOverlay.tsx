"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Shield, Wifi, Radio } from "lucide-react";
import { CallType } from "./types";

interface CallOverlayProps {
  callType: CallType;
  channelName: string;
  onHangUp: () => void;
}

export default function CallOverlay({ callType, channelName, onHangUp }: CallOverlayProps) {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(callType === "audio");
  const [connectionStage, setConnectionStage] = useState<"connecting" | "active">("connecting");

  // Timer effect
  useEffect(() => {
    if (connectionStage === "connecting") {
      const connectTimeout = setTimeout(() => {
        setConnectionStage("active");
      }, 2500);
      return () => clearTimeout(connectTimeout);
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [connectionStage]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const activeWaveBars = Array.from({ length: 15 });

  return (
    <AnimatePresence>
      {callType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030114]/95 backdrop-blur-2xl overflow-hidden"
        >
          {/* Futuristic mesh background network */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#5271ff_1px,_transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          
          {/* Dynamic glows based on call state */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5271ff]/[0.08] blur-[140px] animate-pulse" />
          <div className="pointer-events-none absolute right-10 bottom-10 h-[300px] w-[300px] rounded-full bg-[#3a4ec4]/[0.05] blur-[100px]" />

          {/* Secure indicator header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-10 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            <Shield size={12} className="animate-pulse" />
            SynergiLink Secure QUANTUM line • Encrypted
          </motion.div>

          {/* Video stream backdrop simulator */}
          {callType === "video" && !isCamOff && connectionStage === "active" && (
            <motion.div
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.25 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-gradient-to-tr from-[#0a0826] via-[#120e3a] to-[#22d3ee]/20 pointer-events-none"
            >
              {/* Abstract simulated camera grid particles */}
              <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </motion.div>
          )}

          {/* Visual Avatar Focus Section */}
          <div className="relative flex flex-col items-center justify-center flex-1 max-w-lg px-6 text-center">
            
            {/* Connection / Pulse Ring Wrapper */}
            <div className="relative mb-8 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <motion.div
                animate={{
                  scale: connectionStage === "connecting" ? [1, 1.3, 1] : [1, 1.15, 1],
                  opacity: connectionStage === "connecting" ? [0.2, 0.5, 0.2] : [0.15, 0.35, 0.15],
                }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="absolute h-48 w-48 rounded-full border border-[#5271ff]/40 bg-[#5271ff]/5"
              />
              <motion.div
                animate={{
                  scale: connectionStage === "connecting" ? [1, 1.5, 1] : [1, 1.25, 1],
                  opacity: connectionStage === "connecting" ? [0.1, 0.3, 0.1] : [0.08, 0.2, 0.08],
                }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute h-48 w-48 rounded-full border border-[#3a4ec4]/30"
              />

              {/* Central Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-[#5271ff] to-[#3a4ec4] text-3xl font-extrabold text-white shadow-[0_0_30px_rgba(82,113,255,0.4)] border-2 border-white/10"
              >
                {channelName.startsWith("#") ? channelName.slice(1, 3).toUpperCase() : channelName.slice(0, 2).toUpperCase()}
              </motion.div>

              {/* Miniature overlay icon indicating status */}
              <div className="absolute bottom-1 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#0a0826] border border-white/15 text-[#5271ff] shadow-md">
                {callType === "video" ? <Video size={14} /> : <Radio size={14} className="animate-spin-slow" />}
              </div>
            </div>

            {/* Calling Identity details */}
            <h2 className="mb-2 text-2xl font-bold text-white tracking-wide">
              {channelName}
            </h2>

            {connectionStage === "connecting" ? (
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs uppercase tracking-widest text-[#5271ff] font-bold">
                  Establishing Connection Link
                </p>
                <div className="mt-2 flex gap-1">
                  <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="h-1.5 w-1.5 rounded-full bg-[#5271ff]" />
                  <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-[#5271ff]" />
                  <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-[#5271ff]" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xl font-mono text-white/90 font-medium">
                  {formatTime(seconds)}
                </p>

                {/* Animated Voice/Frequency Waveform */}
                <div className="flex h-8 items-center justify-center gap-1 px-4">
                  {activeWaveBars.map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isMuted ? 4 : [6, Math.floor(Math.random() * 22) + 8, 6],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6 + i * 0.03,
                        ease: "easeInOut",
                      }}
                      className="w-1 rounded-full bg-gradient-to-t from-[#5271ff] to-[#22d3ee]"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Picture-in-picture simulated inset web-camera for local video preview */}
          {callType === "video" && !isCamOff && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute right-6 top-24 z-20 h-32 w-24 overflow-hidden rounded-xl border border-white/20 bg-[#0a0826] shadow-xl"
            >
              <div className="h-full w-full bg-gradient-to-b from-indigo-950 to-slate-900 flex items-center justify-center text-[10px] text-white/30 relative">
                Local Feed
                <div className="absolute inset-0 bg-cyan-500/10 opacity-30 animate-pulse pointer-events-none" />
              </div>
            </motion.div>
          )}

          {/* Controls Dock Bar */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.3 }}
            className="absolute bottom-16 flex items-center gap-5 rounded-2xl border border-white/[0.08] bg-[#0c0a2d]/80 px-6 py-4 shadow-[0_15px_35px_rgba(0,0,0,0.4)] backdrop-blur-lg"
          >
            {/* Audio Toggle button */}
            <button
              type="button"
              onClick={() => setIsMuted((prev) => !prev)}
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition duration-300 ${
                isMuted
                  ? "bg-rose-500/25 border-rose-500/40 text-rose-400 hover:bg-rose-500/40"
                  : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Video Toggle button */}
            <button
              type="button"
              onClick={() => setIsCamOff((prev) => !prev)}
              disabled={callType === "audio"}
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition duration-300 disabled:opacity-20 disabled:pointer-events-none ${
                isCamOff
                  ? "bg-rose-500/25 border-rose-500/40 text-rose-400 hover:bg-rose-500/40"
                  : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {isCamOff ? <VideoOff size={18} /> : <Video size={18} />}
            </button>

            {/* Call Terminate / Hangup Button */}
            <button
              type="button"
              onClick={onHangUp}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white hover:bg-rose-500 transition duration-300 shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <PhoneOff size={22} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
