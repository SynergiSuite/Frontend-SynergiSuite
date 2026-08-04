"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Hash,
  Sparkles,
} from "lucide-react";
import { MessageType } from "./ChatArea";

interface Props {
  message: MessageType;
}

type MarkdownBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; lines: string[] }
  | { type: "list"; ordered: boolean; items: Array<{ depth: number; text: string }> }
  | { type: "code"; language?: string; content: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "quote"; lines: string[] }
  | { type: "image"; alt: string; src: string }
  | { type: "divider" }
  | { type: "keyValueGroup"; items: Array<{ key: string; value: string }> };

function parseJsonLikeText(text: string) {
  const trimmed = text.trim();

  if (!trimmed || !/^[{[]/.test(trimmed)) {
    return null;
  }

  try {
    return JSON.stringify(JSON.parse(trimmed), null, 2);
  } catch {
    return null;
  }
}

function splitTableRow(line: string) {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableDivider(line: string) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());
}

function isKeyValueLine(line: string) {
  return /^(?:[-*+]\s*)?(?:\*\*)?[^:\n]{2,80}(?:\*\*)?:\s+\S/.test(line.trim());
}

function parseKeyValue(line: string) {
  const match = line.trim().match(/^(?:[-*+]\s*)?(?:\*\*)?([^:*][^:\n]{1,80}?)(?:\*\*)?:\s+(.+)$/);

  if (!match) {
    return null;
  }

  return {
    key: match[1].replace(/\*\*/g, "").trim(),
    value: match[2].trim(),
  };
}

function parseMarkdownBlocks(text: string): MarkdownBlock[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const jsonText = parseJsonLikeText(normalized);

  if (jsonText) {
    return [{ type: "code", language: "json", content: jsonText }];
  }

  const lines = normalized.split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const currentLine = lines[index];
    const trimmed = currentLine.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const fenceMatch = trimmed.match(/^```(\w+)?\s*$/);
    if (fenceMatch) {
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      blocks.push({
        type: "code",
        language: fenceMatch[1],
        content: codeLines.join("\n"),
      });
      continue;
    }

    // Setext-style headers (Line text followed by === or --- on next line)
    if (
      index + 1 < lines.length &&
      trimmed.length > 0 &&
      !/^(?:={3,}|-{3,}|\*{3,}|_{3,})\s*$/.test(trimmed) &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("`")
    ) {
      const nextTrimmed = lines[index + 1].trim();
      if (/^={3,}\s*$/.test(nextTrimmed)) {
        blocks.push({
          type: "heading",
          level: 1,
          text: trimmed,
        });
        index += 2;
        continue;
      }
      if (/^-{3,}\s*$/.test(nextTrimmed)) {
        blocks.push({
          type: "heading",
          level: 2,
          text: trimmed,
        });
        index += 2;
        continue;
      }
    }

    // Standalone horizontal rule / divider line (===, ---, ***, ___)
    if (/^(?:={3,}|-{3,}|\*{3,}|_{3,})\s*$/.test(trimmed)) {
      blocks.push({ type: "divider" });
      index += 1;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      index += 1;
      continue;
    }

    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      blocks.push({
        type: "image",
        alt: imageMatch[1],
        src: imageMatch[2],
      });
      index += 1;
      continue;
    }

    if (
      index + 1 < lines.length &&
      trimmed.includes("|") &&
      isTableDivider(lines[index + 1])
    ) {
      const headers = splitTableRow(trimmed);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length && lines[index].trim().includes("|")) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }

      blocks.push({ type: "table", headers, rows });
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = [];

      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }

      blocks.push({ type: "quote", lines: quoteLines });
      continue;
    }

    const listMatch = currentLine.match(/^(\s*)(?:([-*+])|(\d+\.))\s+(.+)$/);
    if (listMatch) {
      const items: Array<{ depth: number; text: string }> = [];
      const ordered = Boolean(listMatch[3]);

      while (index < lines.length) {
        const itemMatch = lines[index].match(/^(\s*)(?:([-*+])|(\d+\.))\s+(.+)$/);

        if (!itemMatch) {
          break;
        }

        items.push({
          depth: Math.min(Math.floor(itemMatch[1].length / 2), 4),
          text: itemMatch[4],
        });
        index += 1;
      }

      blocks.push({ type: "list", ordered, items });
      continue;
    }

    if (isKeyValueLine(trimmed)) {
      const items: Array<{ key: string; value: string }> = [];

      while (index < lines.length && isKeyValueLine(lines[index])) {
        const parsed = parseKeyValue(lines[index]);

        if (!parsed) {
          break;
        }

        items.push(parsed);
        index += 1;
      }

      if (items.length > 1) {
        blocks.push({ type: "keyValueGroup", items });
        continue;
      }

      blocks.push({ type: "paragraph", lines: [trimmed] });
      continue;
    }

    const paragraphLines: string[] = [];

    while (index < lines.length) {
      const nextLine = lines[index];
      const nextTrimmed = nextLine.trim();

      if (
        !nextTrimmed ||
        /^```/.test(nextTrimmed) ||
        /^(#{1,6})\s+/.test(nextTrimmed) ||
        /^(?:={3,}|-{3,}|\*{3,}|_{3,})\s*$/.test(nextTrimmed) ||
        (index + 1 < lines.length && /^={3,}\s*$/.test(lines[index + 1].trim())) ||
        (index + 1 < lines.length && /^-{3,}\s*$/.test(lines[index + 1].trim())) ||
        /^(\s*)(?:[-*+]|\d+\.)\s+/.test(nextLine) ||
        /^>\s?/.test(nextTrimmed) ||
        (index + 1 < lines.length && nextTrimmed.includes("|") && isTableDivider(lines[index + 1]))
      ) {
        break;
      }

      paragraphLines.push(nextTrimmed);
      index += 1;
    }

    blocks.push({ type: "paragraph", lines: paragraphLines });
  }

  return blocks;
}

function formatInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|__.*?__|`.*?`|\[.*?\]\(.*?\)|https?:\/\/[^\s)]+)/g);

  return parts.map((part, index) => {
    if (!part) {
      return null;
    }

    if (
      (part.startsWith("**") && part.endsWith("**")) ||
      (part.startsWith("__") && part.endsWith("__"))
    ) {
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
          className="rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-cyan-300"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const markdownLinkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    const url = markdownLinkMatch?.[2] ?? (part.startsWith("http") ? part : "");

    if (url) {
      const label = markdownLinkMatch?.[1] || url;

      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex max-w-full items-center gap-1 break-all font-semibold text-cyan-300 underline decoration-cyan-300/30 underline-offset-2 hover:text-cyan-200"
        >
          <span>{label}</span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      );
    }

    return part;
  });
}

function renderValueWithBadges(value: string) {
  const trimmed = value.trim();

  if (trimmed.includes(" • ")) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        {trimmed.split(" • ").map((item) => (
          <span
            key={item}
            className="inline-flex min-w-0 items-center rounded-lg border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-white/80"
          >
            {formatInlineMarkdown(item.trim())}
          </span>
        ))}
      </div>
    );
  }

  if (/^-?\d+(?:\.\d+)?%$/.test(trimmed)) {
    const num = parseFloat(trimmed);
    const isHigh = num >= 80;

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-xs font-bold shadow-sm ${
          isHigh
            ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            : "border-amber-500/30 bg-amber-500/15 text-amber-300"
        }`}
      >
        <Activity className="h-3 w-3" />
        {trimmed}
      </span>
    );
  }

  const lower = trimmed.toLowerCase();

  if (lower.includes("optimal") || lower.includes("completed") || lower.includes("balanced")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
        <CheckCircle2 className="h-3 w-3" />
        {trimmed}
      </span>
    );
  }

  if (
    lower.includes("heavy") ||
    lower.includes("at risk") ||
    lower.includes("warning") ||
    lower.includes("overdue") ||
    lower.includes("failed") ||
    lower.includes("error")
  ) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.15)]">
        <AlertCircle className="h-3 w-3" />
        {trimmed}
      </span>
    );
  }

  if (lower.includes("in progress") || lower.includes("active") || lower.includes("pending")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/15 px-2.5 py-0.5 text-xs font-bold text-cyan-300">
        <Clock className="h-3 w-3" />
        {trimmed}
      </span>
    );
  }

  return <span>{formatInlineMarkdown(trimmed)}</span>;
}

function BlockRenderer({ block }: { block: MarkdownBlock }) {
  if (block.type === "heading") {
    const levelClasses: Record<number, string> = {
      1: "text-lg sm:text-xl font-extrabold text-white",
      2: "text-base sm:text-lg font-bold text-white",
      3: "text-sm sm:text-base font-bold text-[#8fa2ff]",
      4: "text-sm font-semibold text-white/90",
      5: "text-xs font-semibold text-white/80 uppercase",
      6: "text-xs font-semibold text-white/70 uppercase",
    };

    return (
      <div className="flex min-w-0 items-start gap-2 border-b border-white/10 pb-2">
        {block.level <= 2 ? (
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#5271ff]" />
        ) : (
          <Hash className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5271ff]/80" />
        )}
        <div className={`min-w-0 leading-6 tracking-normal ${levelClasses[block.level]}`}>
          {formatInlineMarkdown(block.text)}
        </div>
      </div>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p className="whitespace-pre-wrap text-sm leading-6 text-white/90">
        {formatInlineMarkdown(block.lines.join(" "))}
      </p>
    );
  }

  if (block.type === "list") {
    return (
      <div className="space-y-1.5">
        {block.items.map((item, index) => (
          <div
            key={`${item.text}-${index}`}
            className="flex min-w-0 items-start gap-2.5 text-sm leading-6 text-white/85"
            style={{ paddingLeft: `${item.depth * 14}px` }}
          >
            <span className="mt-2 flex h-5 min-w-5 items-center justify-center">
              {block.ordered ? (
                <span className="text-[10px] font-bold text-[#8fa2ff]">{index + 1}.</span>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-[#5271ff] shadow-[0_0_6px_#5271ff]" />
              )}
            </span>
            <div className="min-w-0 break-words">{formatInlineMarkdown(item.text)}</div>
          </div>
        ))}
      </div>
    );
  }

  if (block.type === "code") {
    return (
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#02010c]/80">
        {block.language && (
          <div className="border-b border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-cyan-300/80">
            {block.language}
          </div>
        )}
        <pre className="custom-scrollbar max-h-96 overflow-auto p-3 text-xs leading-5 text-white/85">
          <code className="font-mono">{block.content || " "}</code>
        </pre>
      </div>
    );
  }

  if (block.type === "table") {
    return (
      <div className="custom-scrollbar overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-left text-xs">
          <thead className="bg-white/[0.04] text-white/60">
            <tr>
              {block.headers.map((header, index) => (
                <th key={`${header}-${index}`} className="whitespace-nowrap px-3 py-2 font-semibold">
                  {formatInlineMarkdown(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-[#030114]/30">
                {block.headers.map((_, cellIndex) => (
                  <td key={cellIndex} className="max-w-[280px] break-words px-3 py-2 text-white/85">
                    {formatInlineMarkdown(row[cellIndex] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote className="border-l-2 border-[#5271ff]/60 bg-white/[0.03] px-3 py-2 text-sm leading-6 text-white/75">
        {block.lines.map((line, index) => (
          <p key={`${line}-${index}`}>{formatInlineMarkdown(line)}</p>
        ))}
      </blockquote>
    );
  }

  if (block.type === "image") {
    return (
      <a href={block.src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.src}
          alt={block.alt}
          className="max-h-80 w-full object-contain"
          loading="lazy"
        />
      </a>
    );
  }

  if (block.type === "keyValueGroup") {
    return (
      <div className="grid gap-2">
        {block.items.map((item) => (
          <div
            key={`${item.key}-${item.value}`}
            className="grid min-w-0 gap-1.5 rounded-lg border border-white/[0.08] bg-[#030114]/40 px-3.5 py-2.5 sm:grid-cols-[minmax(120px,0.42fr)_minmax(0,1fr)] sm:items-center"
          >
            <span className="min-w-0 text-[11px] font-semibold uppercase tracking-wide text-white/50">
              {item.key}
            </span>
            <div className="min-w-0 break-words text-sm font-medium text-white/95 sm:text-right">
              {renderValueWithBadges(item.value)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <hr className="border-white/10" />;
}

function FormattedMessageText({ text }: { text: string }) {
  const blocks = parseMarkdownBlocks(text);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="w-full min-w-0 space-y-3 overflow-hidden break-words">
      {blocks.map((block, index) => (
        <BlockRenderer key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}

const ChatMessage = ({ message }: Props) => {
  const isUserMessage = message.sender === "user";

  return (
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
      className={`flex w-full ${isUserMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-[94%] gap-2 sm:max-w-[86%] sm:gap-3 lg:max-w-[78%] ${
          isUserMessage ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {!isUserMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.05, type: "spring", stiffness: 340, damping: 24 }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] shadow-[0_0_12px_rgba(82,113,255,0.3)] sm:h-10 sm:w-10"
          >
            <Sparkles className="h-4 w-4 text-white" />
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
            className={`min-w-0 overflow-hidden rounded-2xl p-4 shadow-sm sm:p-5 ${
              isUserMessage
                ? "border border-[#5271ff]/30 bg-[#5271ff]/15 text-white shadow-[0_8px_24px_rgba(82,113,255,0.15)]"
                : "border border-white/[0.08] bg-[#0a0826]/70 text-white/95 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-sm"
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
              className={`mt-2 text-[9px] font-semibold uppercase tracking-wider text-white/30 ${
                isUserMessage ? "text-right" : "text-left"
              }`}
            >
              {message.time}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
