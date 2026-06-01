"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Image as ImageIcon, Video, FolderArchive, File, DollarSign, Calendar, Activity, X, ExternalLink } from "lucide-react";
import { FileType } from "./statesCards";
import { getViewUrlApi } from "./apis/getViewUrlApi";
import { toast } from "sonner";

type FileDetailProps = {
  file: FileType | null;
  open: boolean;
  onClose: () => void;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Document":
      return <FileText className="h-6 w-6 text-cyan-400" />;
    case "Image":
      return <ImageIcon className="h-6 w-6 text-amber-400" />;
    case "Media":
      return <Video className="h-6 w-6 text-emerald-400" />;
    case "Archive":
      return <FolderArchive className="h-6 w-6 text-indigo-400" />;
    default:
      return <File className="h-6 w-6 text-white/50" />;
  }
};

const getCategoryConfig = (category: string) => {
  switch (category) {
    case "Document":
      return {
        label: "Document",
        chipClass: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.2)]",
        accentClass: "from-cyan-500/10 via-[#0c0a2f]/90 to-[#0a0826] border-cyan-500/20",
        glowColor: "bg-cyan-500/10",
      };
    case "Image":
      return {
        label: "Image Asset",
        chipClass: "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
        accentClass: "from-amber-500/10 via-[#0c0a2f]/90 to-[#0a0826] border-amber-500/20",
        glowColor: "bg-amber-500/10",
      };
    case "Media":
      return {
        label: "Media / Video",
        chipClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
        accentClass: "from-emerald-500/10 via-[#0c0a2f]/90 to-[#0a0826] border-emerald-500/20",
        glowColor: "bg-emerald-500/10",
      };
    case "Archive":
      return {
        label: "Compressed Archive",
        chipClass: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.2)]",
        accentClass: "from-indigo-500/10 via-[#0c0a2f]/90 to-[#0a0826] border-indigo-500/20",
        glowColor: "bg-indigo-500/10",
      };
    default:
      return {
        label: "Workspace Asset",
        chipClass: "bg-white/5 text-white/40 border border-white/10",
        accentClass: "from-white/5 via-[#0c0a2f]/90 to-[#0a0826] border-white/10",
        glowColor: "bg-white/5",
      };
  }
};

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/[0.15]">
    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
      <span className="text-[#5271ff]/70">{icon}</span>
      <span>{label}</span>
    </div>
    <p className="break-words text-sm font-semibold text-white">{value}</p>
  </div>
);

export default function FileDetailModal({
  file,
  open,
  onClose,
}: FileDetailProps) {
  const [isViewing, setIsViewing] = useState(false);

  const handleViewDocument = async () => {
    if (!file) return;
    try {
      setIsViewing(true);
      toast.loading("Generating secure view link...", { id: "view-doc" });
      const { viewUrl } = await getViewUrlApi(file.id);
      toast.success("Opening document in new tab", { id: "view-doc" });
      window.open(viewUrl, "_blank");
    } catch (error) {
      toast.error("Failed to fetch document view URL", { id: "view-doc" });
    } finally {
      setIsViewing(false);
    }
  };

  if (!file) {
    return null;
  }

  const categoryConfig = getCategoryConfig(file.category);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.button
            type="button"
            aria-label="Close asset details"
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className={`relative w-full max-w-2xl overflow-hidden rounded-[28px] border bg-gradient-to-br ${categoryConfig.accentClass} shadow-[0_24px_80px_rgba(0,0,0,0.6)]`}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            {/* Custom glowing backdrop */}
            <div className={`absolute -right-16 -top-16 h-36 w-36 rounded-full blur-3xl ${categoryConfig.glowColor}`} />
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(82,113,255,0.15),transparent_58%)]" />

            <div className="relative border-b border-white/[0.08] px-6 py-6 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0a0826]/60 shadow-inner">
                    {getCategoryIcon(file.category)}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">
                      File Overview
                    </p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-white max-w-md truncate" title={file.name}>
                      {file.name || "Unnamed Asset"}
                    </h2>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${categoryConfig.chipClass}`}
                      >
                        {categoryConfig.label}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs font-semibold text-white/80">
                        {file.size || "Unknown size"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-white/50 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
              <DetailRow
                icon={<FileText className="h-4 w-4" />}
                label="Asset Name"
                value={file.name || "N/A"}
              />
              <DetailRow
                icon={<Activity className="h-4 w-4" />}
                label="Storage Category"
                value={file.category || "N/A"}
              />
              <DetailRow
                icon={<Calendar className="h-4 w-4" />}
                label="Uploaded Date"
                value={file.uploadedAt || "N/A"}
              />
              <DetailRow
                icon={<DollarSign className="h-4 w-4" />}
                label="Asset Security Status"
                value="Securely Stored in Synergi Cloud"
              />
              {file.userLabel && (
                <DetailRow
                  icon={<FileText className="h-4 w-4" />}
                  label="User Custom Label"
                  value={file.userLabel}
                />
              )}
              {file.labelType !== undefined && (
                <DetailRow
                  icon={<Activity className="h-4 w-4" />}
                  label="Classification Target"
                  value={
                    file.labelType === 1
                      ? "Personal (Confidential)"
                      : file.labelType === 2
                        ? `Shared with Team: ${file.teamId || "Unspecified Team"}`
                        : file.labelType === 3
                          ? `Bound to Project: ${file.projectId || "Unspecified Project"}`
                          : file.labelType === 4
                            ? `Client Scope: ${file.isClient ? "From Client" : ""} ${file.isClient && file.forClient ? "&" : ""} ${file.forClient ? "For Client" : ""}`
                            : "Other Classification"
                  }
                />
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-white/[0.08] px-6 py-4 sm:px-8 bg-[#0a0826]/40 backdrop-blur-md">
              <button
                type="button"
                onClick={handleViewDocument}
                disabled={isViewing}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:opacity-95 hover:shadow-[0_0_15px_rgba(82,113,255,0.35)] active:scale-95 disabled:opacity-50"
              >
                <ExternalLink className="h-4 w-4" />
                {isViewing ? "Opening..." : "View Document"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
