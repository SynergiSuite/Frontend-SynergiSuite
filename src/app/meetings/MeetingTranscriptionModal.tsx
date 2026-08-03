"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Mic,
  Square,
  Play,
  Pause,
  Copy,
  Check,
  Bot,
  FileText,
  Clock,
  Sparkles,
  AlertCircle,
  FileAudio,
  RefreshCw,
  Sliders,
  Radio,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  transcribeAudioApi,
  TranscriptionResult,
  TranscriptSegment,
} from "./apis/transcribeApi";

interface MeetingTranscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialResult?: TranscriptionResult | null;
}

export default function MeetingTranscriptionModal({
  isOpen,
  onClose,
  initialResult,
}: MeetingTranscriptionModalProps) {
  const router = useRouter();

  // Mode: "upload" or "record"
  const [activeTab, setActiveTab] = useState<"upload" | "record">("upload");

  // Language state
  const [language, setLanguage] = useState("en");

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Browser recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  // API Call State
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI Helper states
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedSegmentIdx, setCopiedSegmentIdx] = useState<number | null>(null);

  // Reset or load initialResult when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialResult) {
        setResult(initialResult);
      }
    } else {
      stopRecordingCleanup();
      setError(null);
    }
  }, [isOpen, initialResult]);

  const stopRecordingCleanup = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  // ── File Upload Handlers ──────────────────────────────────────────────────

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidAudioVideoFile(file)) {
        setSelectedFile(file);
        setError(null);
      } else {
        toast.error("Please upload a valid audio or video file (.mp3, .wav, .m4a, .webm, .mp4, .aac)");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidAudioVideoFile(file)) {
        setSelectedFile(file);
        setError(null);
      } else {
        toast.error("Please select a valid audio or video file.");
      }
    }
  };

  const isValidAudioVideoFile = (file: File) => {
    const validTypes = ["audio/", "video/", "application/ogg"];
    const validExts = [".mp3", ".wav", ".m4a", ".webm", ".mp4", ".aac", ".ogg", ".flac", ".mkv"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    return validTypes.some((t) => file.type.startsWith(t)) || validExts.includes(ext);
  };

  // ── Browser Recording Handlers ───────────────────────────────────────────

  const startRecording = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(500);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingSeconds(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      toast.error("Could not access microphone: " + (err?.message || "Permission denied"));
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        timerIntervalRef.current = window.setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      }
    }
  };

  const stopRecording = () => {
    stopRecordingCleanup();
  };

  const resetRecording = () => {
    stopRecordingCleanup();
    setRecordedBlob(null);
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
  };

  // ── Submit & Transcribe Handler ───────────────────────────────────────────

  const handleTranscribe = async () => {
    const fileToTranscribe =
      activeTab === "upload" ? selectedFile : recordedBlob;

    if (!fileToTranscribe) {
      toast.error("Please select a file or record audio first.");
      return;
    }

    try {
      setIsTranscribing(true);
      setError(null);
      setResult(null);

      const fileName =
        activeTab === "upload" && selectedFile
          ? selectedFile.name
          : `meeting-record-${Date.now()}.webm`;

      const responseData = await transcribeAudioApi(
        fileToTranscribe,
        fileName,
        language
      );

      setResult(responseData);
      toast.success("Meeting transcribed successfully!");
    } catch (err: any) {
      console.error("Transcription Error:", err);
      const msg = err?.message || "Failed to transcribe audio";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsTranscribing(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainderSecs = Math.floor(sec % 60);
    return `${String(mins).padStart(2, "0")}:${String(remainderSecs).padStart(2, "0")}`;
  };

  const formatTimestamp = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainderSecs = Math.floor(sec % 60);
    return `${String(mins).padStart(2, "0")}:${String(remainderSecs).padStart(2, "0")}`;
  };

  const handleCopyFullText = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text);
    setCopiedFull(true);
    toast.success("Full transcript copied to clipboard!");
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const handleCopySegment = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSegmentIdx(idx);
    toast.success("Segment copied!");
    setTimeout(() => setCopiedSegmentIdx(null), 1500);
  };

  const handleSendToChatbot = () => {
    if (!result?.text) return;

    const summaryPrompt = `Here is the transcript of a meeting. Please provide a detailed executive summary, key discussion points, decisions made, and numbered action items:\n\n${result.text}`;

    // Store prompt in sessionStorage and navigate to /chatbot
    sessionStorage.setItem("pending_chat_prompt", summaryPrompt);
    toast.info("Redirecting to AI Chatbot for summarization...");
    onClose();
    router.push("/chatbot");
  };

  if (!isOpen) return null;

  const fullText = result?.text || result?.transcript?.text || "";
  const segments = result?.transcript?.segments || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#030114]/90 backdrop-blur-2xl"
      >
        {/* Background Ambient Glows */}
        <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#5271ff]/[0.08] blur-[140px]" />
        <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-[#a78bfa]/[0.06] blur-[120px]" />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0826] text-white shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5 sm:px-8 bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#5271ff]/30 bg-[#5271ff]/15 text-[#8fa2ff] shadow-[0_0_15px_rgba(82,113,255,0.2)]">
                <Sparkles size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  AI Meeting Transcription
                </h2>
                <p className="text-xs text-white/50">
                  Powered by local faster-whisper speech-to-text model
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
            {/* Input Method Selector + Language Options */}
            {!result && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
                {/* Tabs */}
                <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#030114]/60 p-1.5 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                      activeTab === "upload"
                        ? "bg-[#5271ff] text-white shadow-[0_0_15px_rgba(82,113,255,0.3)]"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Upload size={14} />
                    <span>Upload Recording</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("record")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                      activeTab === "record"
                        ? "bg-[#5271ff] text-white shadow-[0_0_15px_rgba(82,113,255,0.3)]"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Mic size={14} />
                    <span>Record Mic</span>
                  </button>
                </div>

                {/* Language selection */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white/50">Language:</span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="rounded-xl border border-white/[0.08] bg-[#030114] px-3 py-2 text-xs font-medium text-white outline-none cursor-pointer focus:border-[#5271ff]"
                  >
                    <option value="en">English (en)</option>
                    <option value="auto">Auto-detect</option>
                    <option value="es">Spanish (es)</option>
                    <option value="fr">French (fr)</option>
                    <option value="de">German (de)</option>
                    <option value="ur">Urdu (ur)</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB 1: File Upload Mode */}
            {!result && activeTab === "upload" && (
              <div className="space-y-4">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all ${
                    dragActive
                      ? "border-[#5271ff] bg-[#5271ff]/10"
                      : selectedFile
                      ? "border-emerald-500/40 bg-emerald-500/[0.03]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                        <FileAudio size={28} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{selectedFile.name}</p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || "audio/video"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="mt-2 text-xs font-semibold text-rose-400 hover:text-rose-300 underline cursor-pointer"
                      >
                        Remove & choose another file
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#5271ff]/30 bg-[#5271ff]/10 text-[#8fa2ff]">
                        <Upload size={26} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          Drag & drop meeting recording here
                        </p>
                        <p className="text-xs text-white/40 mt-1">
                          Supports MP3, WAV, M4A, WEBM, MP4, AAC, OGG
                        </p>
                      </div>

                      <label className="mt-3 cursor-pointer rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/15">
                        Browse Files
                        <input
                          type="file"
                          accept="audio/*,video/*,.mp3,.wav,.m4a,.webm,.mp4,.aac"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Browser Recording Mode */}
            {!result && activeTab === "record" && (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 text-center space-y-6">
                {!isRecording && !recordedAudioUrl ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#5271ff]/30 bg-[#5271ff]/10 text-[#5271ff] shadow-[0_0_30px_rgba(82,113,255,0.2)]">
                      <Mic size={36} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-white">Record Meeting Mic Audio</p>
                      <p className="text-xs text-white/40 mt-1">
                        Click start to record directly from your microphone
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={startRecording}
                      className="mt-2 flex items-center gap-2 rounded-xl bg-[#5271ff] px-6 py-3 text-xs font-extrabold text-white shadow-[0_0_20px_rgba(82,113,255,0.4)] hover:scale-105 transition cursor-pointer"
                    >
                      <Radio size={16} className="animate-pulse text-red-400" />
                      <span>Start Recording</span>
                    </button>
                  </div>
                ) : isRecording ? (
                  <div className="flex flex-col items-center gap-6">
                    {/* Live Recording Indicator */}
                    <div className="flex items-center gap-3 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2">
                      <div className="h-3 w-3 rounded-full bg-red-500 animate-ping" />
                      <span className="text-sm font-mono font-bold text-red-400">
                        {isPaused ? "PAUSED" : "RECORDING"} • {formatSeconds(recordingSeconds)}
                      </span>
                    </div>

                    {/* Equalizer animation */}
                    <div className="flex items-center gap-1.5 h-10">
                      {[0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.3, 0.7, 0.9, 0.4].map((heightRatio, i) => (
                        <motion.div
                          key={i}
                          animate={{ scaleY: isPaused ? 0.2 : [0.2, heightRatio, 0.2] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.08,
                          }}
                          className="w-1.5 rounded-full bg-gradient-to-t from-[#5271ff] to-cyan-400 h-full origin-bottom"
                        />
                      ))}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={pauseRecording}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
                        title={isPaused ? "Resume" : "Pause"}
                      >
                        {isPaused ? <Play size={20} /> : <Pause size={20} />}
                      </button>

                      <button
                        type="button"
                        onClick={stopRecording}
                        className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-rose-500 transition cursor-pointer"
                      >
                        <Square size={16} />
                        <span>Stop & Save Recording</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 w-full max-w-md">
                    <div className="flex items-center justify-between w-full text-xs font-semibold text-emerald-400">
                      <span>Recording Complete ({formatSeconds(recordingSeconds)})</span>
                      <button
                        type="button"
                        onClick={resetRecording}
                        className="text-white/40 hover:text-white underline cursor-pointer"
                      >
                        Re-record
                      </button>
                    </div>

                    {recordedAudioUrl && (
                      <audio
                        src={recordedAudioUrl}
                        controls
                        className="w-full h-10 rounded-xl"
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Error Message Display */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300 text-xs">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Transcription Error</p>
                  <p className="mt-0.5 opacity-80">{error}</p>
                </div>
              </div>
            )}

            {/* Transcribe Submit Button */}
            {!result && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={
                    isTranscribing ||
                    (activeTab === "upload" && !selectedFile) ||
                    (activeTab === "record" && !recordedBlob)
                  }
                  onClick={handleTranscribe}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-8 py-3.5 text-xs font-extrabold text-white shadow-[0_0_25px_rgba(82,113,255,0.35)] hover:scale-[1.02] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isTranscribing ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Transcribing Audio with Whisper AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Transcribe Audio Now</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* SUCCESS VIEW: Transcript Results */}
            {result && (
              <div className="space-y-6">
                {/* Result Metadata Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl border border-white/[0.08] bg-[#030114]/60 p-4 text-xs">
                  <div>
                    <span className="text-white/40 block">Filename</span>
                    <span className="font-bold text-white truncate block">{result.filename}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Language</span>
                    <span className="font-bold text-emerald-400 uppercase">
                      {result.transcript.language || "en"} ({Math.round((result.transcript.language_probability || 1) * 100)}%)
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Duration</span>
                    <span className="font-bold text-white">
                      {formatSeconds(result.transcript.duration || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block">AI Model</span>
                    <span className="font-bold text-[#8fa2ff]">
                      {result.model} ({result.compute_type})
                    </span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText size={16} className="text-[#5271ff]" />
                    <span>Full Transcript</span>
                  </h3>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyFullText}
                      className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition cursor-pointer"
                    >
                      {copiedFull ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span>{copiedFull ? "Copied!" : "Copy Full Text"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSendToChatbot}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-4 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(82,113,255,0.3)] hover:scale-105 transition cursor-pointer"
                    >
                      <Bot size={15} />
                      <span>Summarize in AI Chat</span>
                    </button>
                  </div>
                </div>

                {/* Full Transcript Box */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#030114]/80 p-5 text-sm text-white/90 leading-relaxed max-h-64 overflow-y-auto custom-scrollbar select-text">
                  {fullText}
                </div>

                {/* Timestamped Segments */}
                {segments.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock size={16} className="text-[#5271ff]" />
                      <span>Timestamped Segments ({segments.length})</span>
                    </h3>

                    <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                      {segments.map((seg, idx) => (
                        <div
                          key={idx}
                          className="group relative flex flex-col sm:flex-row sm:items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:border-[#5271ff]/30 hover:bg-white/[0.04]"
                        >
                          <span className="shrink-0 rounded-lg border border-[#5271ff]/30 bg-[#5271ff]/10 px-2.5 py-1 font-mono text-[11px] font-bold text-[#8fa2ff]">
                            [{formatTimestamp(seg.start)} - {formatTimestamp(seg.end)}]
                          </span>

                          <p className="flex-1 text-xs text-white/80 leading-relaxed select-text">
                            {seg.text}
                          </p>

                          <button
                            type="button"
                            onClick={() => handleCopySegment(seg.text, idx)}
                            className="opacity-0 group-hover:opacity-100 transition shrink-0 p-1 text-white/40 hover:text-white cursor-pointer"
                            title="Copy segment"
                          >
                            {copiedSegmentIdx === idx ? (
                              <Check size={14} className="text-emerald-400" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Re-transcribe option */}
                <div className="flex justify-end pt-4 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => {
                      setResult(null);
                      setSelectedFile(null);
                      resetRecording();
                    }}
                    className="text-xs font-semibold text-white/40 hover:text-white transition underline cursor-pointer"
                  >
                    Transcribe Another Recording
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
