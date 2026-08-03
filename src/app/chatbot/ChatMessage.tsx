"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Activity, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { MessageType } from "./ChatArea";

interface Props {
  message: MessageType;
}

// Helper to format inline bold (**text**) and code (`text`)
function formatInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-cyan-300 border border-white/10"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// Smart badge renderer for values (percentages, ratios, status tags, dot separators)
function renderValueWithBadges(val: string) {
  const trimmed = val.trim();

  // 1. If value contains bullet separators " • ", split into badge pills
  if (trimmed.includes(" • ")) {
    const items = trimmed.split(" • ");
    return (
      <div className="flex flex-wrap gap-1.5 items-center justify-end">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-white/80 transition-colors hover:bg-white/[0.08]"
          >
            {formatInlineMarkdown(item.trim())}
          </span>
        ))}
      </div>
    );
  }

  // 2. Percentage scores (e.g., "100%", "98.5%")
  if (/^\d+(?:\.\d+)?%$/.test(trimmed)) {
    const num = parseFloat(trimmed);
    const isHigh = num >= 80;
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-bold border shadow-sm ${
          isHigh
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            : "bg-amber-500/15 text-amber-300 border-amber-500/30"
        }`}
      >
        <Activity className="h-3 w-3" />
        {trimmed}
      </span>
    );
  }

  // 3. Status terms (Capacity Heavy, Optimal, At Risk, Completed, Balanced, etc.)
  const lower = trimmed.toLowerCase();
  if (
    lower.includes("optimal") ||
    lower.includes("completed") ||
    lower.includes("balanced")
  ) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
        <CheckCircle2 className="h-3 w-3" />
        {trimmed}
      </span>
    );
  }

  if (
    lower.includes("heavy") ||
    lower.includes("at risk") ||
    lower.includes("warning") ||
    lower.includes("overdue")
  ) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.15)]">
        <AlertCircle className="h-3 w-3" />
        {trimmed}
      </span>
    );
  }

  if (lower.includes("in progress") || lower.includes("active")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-bold text-cyan-300">
        <Clock className="h-3 w-3" />
        {trimmed}
      </span>
    );
  }

  return <span>{formatInlineMarkdown(trimmed)}</span>;
}

// Component to render formatted messages & structured report cards
function FormattedMessageText({ text }: { text: string }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  if (lines.length === 0) return null;

  return (
    <div className="space-y-2.5 w-full">
      {lines.map((line, idx) => {
        // 1. Markdown H1 Header (# Heading)
        const h1Match = line.match(/^#\s+(.*)$/);
        if (h1Match) {
          return (
            <div key={idx} className="pb-3 mb-3 border-b border-white/15">
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#5271ff]" />
                {formatInlineMarkdown(h1Match[1])}
              </h1>
            </div>
          );
        }

        // 2. Markdown H2 Header (## Heading)
        const h2Match = line.match(/^##\s+(.*)$/);
        if (h2Match) {
          return (
            <div key={idx} className="pt-2 pb-1.5 mb-2 border-b border-white/10 flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                {formatInlineMarkdown(h2Match[1])}
              </h2>
            </div>
          );
        }

        // 3. Markdown H3 Header (### Heading)
        const h3Match = line.match(/^###\s+(.*)$/);
        if (h3Match) {
          return (
            <h3 key={idx} className="text-xs sm:text-sm font-semibold text-[#8fa2ff] tracking-wide pt-1.5 mb-1">
              {formatInlineMarkdown(h3Match[1])}
            </h3>
          );
        }

        // 4. Markdown H4 Header (#### Heading)
        const h4Match = line.match(/^####\s+(.*)$/);
        if (h4Match) {
          return (
            <h4 key={idx} className="text-xs font-semibold text-white/80 pt-1 mb-1">
              {formatInlineMarkdown(h4Match[1])}
            </h4>
          );
        }

        // 5. Header Line with Emoji / Bold (e.g. "⚡ **Team Execution Report**")
        const headerMatch = line.match(/^(?:([⚡📊📁🤝🏢💡🚀📌])\s*)?\*\*(.*?)\*\*$/);
        if (headerMatch) {
          const icon = headerMatch[1];
          const title = headerMatch[2];
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 pb-2.5 mb-2 border-b border-white/10"
            >
              {icon ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#5271ff]/20 to-[#3a4ec4]/10 border border-[#5271ff]/30 text-[#5271ff] text-sm font-bold shadow-[0_0_12px_rgba(82,113,255,0.25)] shrink-0">
                  {icon}
                </span>
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#5271ff]/15 border border-[#5271ff]/20 text-[#5271ff] shrink-0">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
              )}
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                {title}
              </h3>
            </div>
          );
        }

        // 6. Key-Value bullet item (e.g. "- **Role**: Manager" or "**Role**: Manager")
        const kvMatch = line.match(/^(?:[\-*•]\s*)?\*\*(.*?)\*\*:\s*(.*)$/);
        if (kvMatch) {
          const key = kvMatch[1];
          const val = kvMatch[2];
          return (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 rounded-xl border border-white/[0.08] bg-[#030114]/40 px-3.5 py-2.5 transition-all hover:bg-white/[0.04] hover:border-white/15"
            >
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider shrink-0">
                {key}
              </span>
              <div className="text-xs font-medium text-white/95 sm:text-right min-w-0 break-words">
                {renderValueWithBadges(val)}
              </div>
            </div>
          );
        }

        // 7. Regular bullet point (e.g. "- 4 / 7" or "* Completed Tasks")
        const bulletMatch = line.match(/^[\-*•]\s*(.*)$/);
        if (bulletMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80 py-1 px-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5271ff] mt-1.5 shrink-0 shadow-[0_0_6px_#5271ff]" />
              <div className="min-w-0 leading-5">{formatInlineMarkdown(bulletMatch[1])}</div>
            </div>
          );
        }

        // 8. Default text line
        return (
          <p key={idx} className="text-xs text-white/90 leading-5">
            {formatInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}

const ChatMessage = ({ message }: Props) => {
  const isUserMessage = message.sender === "user";

  return (
    <>
      <motion.div
        layout
        initial={{
          opacity: 0,
          x: isUserMessage ? 32 : -32,
          y: 18,
          scale: 0.96,
        }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 26,
          mass: 0.8,
        }}
        className={`w-full flex ${
          isUserMessage ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`flex max-w-[92%] gap-2 sm:max-w-[82%] sm:gap-3 lg:max-w-[75%] ${
            isUserMessage ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {!isUserMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.05, type: "spring", stiffness: 340, damping: 24 }}
              className="
                h-8
                w-8
                sm:h-10
                sm:w-10
                rounded-full
                bg-gradient-to-r
                from-[#5271ff]
                to-[#3a4ec4]
                shadow-[0_0_12px_rgba(82,113,255,0.3)]
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
          )}

          <div className="min-w-0 flex-1">
            <motion.div
              initial={{
                opacity: 0,
                scale: isUserMessage ? 0.94 : 0.98,
                y: 12,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 24,
                delay: isUserMessage ? 0.04 : 0,
              }}
              className={`p-4 sm:p-5 rounded-2xl shadow-sm ${
                isUserMessage
                  ? "bg-[#5271ff]/15 text-white border border-[#5271ff]/30 shadow-[0_8px_24px_rgba(82,113,255,0.15)]"
                  : "bg-[#0a0826]/70 text-white/95 border border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-sm"
              }`}
            >
              {message.isTyping ? (
                <div className="flex items-center gap-1.5 py-1">
                  <motion.span
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                    className="h-1.5 w-1.5 rounded-full bg-[#5271ff] shadow-[0_0_8px_#5271ff]"
                  />
                  <motion.span
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                    className="h-1.5 w-1.5 rounded-full bg-[#5271ff] shadow-[0_0_8px_#5271ff]"
                  />
                  <motion.span
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="h-1.5 w-1.5 rounded-full bg-[#5271ff] shadow-[0_0_8px_#5271ff]"
                  />
                </div>
              ) : (
                <FormattedMessageText text={message.text} />
              )}
            </motion.div>

            {!message.isTyping && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.22 }}
                className={`text-[9px] uppercase tracking-wider font-semibold text-white/30 mt-2 ${
                  isUserMessage ? "text-right" : "text-left"
                }`}
              >
                {message.time}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ChatMessage;
