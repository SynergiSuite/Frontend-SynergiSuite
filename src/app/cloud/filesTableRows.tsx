"use client";

import React from "react";
import { Pencil, Trash, FileText, Image as ImageIcon, Video, FolderArchive, File } from "lucide-react";
import { FileType } from "./statesCards";

type Props = {
  file: FileType;
  onSelect: (file: FileType) => void;
  onEdit: (file: FileType) => void;
  onDelete: (id: string) => void;
  teams?: any[];
  userId?: string;
  role?: string;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Document":
      return <FileText className="h-4 w-4 text-cyan-400" />;
    case "Image":
      return <ImageIcon className="h-4 w-4 text-amber-400" />;
    case "Media":
      return <Video className="h-4 w-4 text-emerald-400" />;
    case "Archive":
      return <FolderArchive className="h-4 w-4 text-indigo-400" />;
    default:
      return <File className="h-4 w-4 text-white/50" />;
  }
};

const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case "Document":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]";
    case "Image":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]";
    case "Media":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]";
    case "Archive":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.15)]";
    default:
      return "bg-white/5 text-white/40 border-white/10";
  }
};

const FileRow = ({
  file,
  onSelect,
  onEdit,
  onDelete,
  teams = [],
  userId = "",
  role = "",
}: Props) => {
  const getDisplayValue = (value?: string | number) => {
    return value !== undefined && value !== null && String(value).trim() !== ""
      ? String(value)
      : "N/A";
  };

  let canDelete = false;
  const userRole = role.toLowerCase();
  
  if (file.referenceType === "user" || file.labelType === 1) {
    canDelete = String(userId) === String(file.referenceId || file.teamId);
  } else if (file.referenceType === "team" || file.labelType === 2) {
    const team = teams.find((t) => String(t.id || t.team_id || t.teamId) === String(file.referenceId || file.teamId));
    if (team) {
      const leaderId = team.leader?.user_id || team.leader_id || team.leaderId;
      canDelete = String(userId) === String(leaderId);
    }
  } else if (file.referenceType === "project" || file.labelType === 3) {
    canDelete = ["manager", "founder"].includes(userRole);
  } else if (file.referenceType === "client" || file.labelType === 4) {
    canDelete = ["client", "manager", "founder"].includes(userRole);
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(file)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect(file);
          }
        }}
        className="grid w-full gap-4 border-b border-white/[0.08] px-4 py-4 text-left transition-all duration-300 hover:bg-white/[0.03] hover:translate-x-1 focus:bg-white/[0.03] focus:outline-none last:border-b-0 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] md:items-center md:gap-0 md:px-6 md:py-5"
      >
        {/* Name */}
        <div className="min-w-0 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10">
            {getCategoryIcon(file.category)}
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
              File Name
            </p>
            <p className="truncate font-semibold text-white text-sm" title={getDisplayValue(file.name)}>
              {getDisplayValue(file.name)}
            </p>
          </div>
        </div>

        {/* Category */}
        <div className="min-w-0">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
            Category
          </p>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-semibold border ${getCategoryBadgeClass(file.category)}`}
            title={file.category}
          >
            {file.category}
          </span>
        </div>

        {/* Size */}
        <div className="min-w-0">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
            File Size
          </p>
          <div className="truncate text-white/80 text-sm" title={getDisplayValue(file.size)}>
            {getDisplayValue(file.size)}
          </div>
        </div>

        {/* Date */}
        <div className="min-w-0">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
            Upload Date
          </p>
          <div className="truncate text-white/70 text-sm" title={getDisplayValue(file.uploadedAt)}>
            {getDisplayValue(file.uploadedAt)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex min-w-0 items-center justify-between gap-3 md:justify-start">
          <p className="text-[9px] font-bold uppercase tracking-wider text-white/40 md:hidden">
            Actions
          </p>
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {canDelete && (
              <button
                type="button"
                aria-label="Delete file"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(file.id);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/60 transition-all duration-200 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
              >
                <Trash className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FileRow;
