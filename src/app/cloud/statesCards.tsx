"use client";

import React from "react";
import { Cloud, FileText, Image as ImageIcon } from "lucide-react";

export type FileType = {
  id: string;
  name: string;
  category: "Document" | "Image" | "Media" | "Archive" | "Other";
  size: string;
  uploadedAt: string;
  sizeBytes: number;
  userLabel?: string;
  labelType?: number;
  teamId?: string;
  projectId?: string;
  isClient?: boolean;
  forClient?: boolean;
  referenceType?: string;
  referenceId?: string;
};

type Props = {
  files: FileType[];
};

const StatsCards = ({ files }: Props) => {
  const totalFiles = files.length;
  const totalBytes = files.reduce((sum, f) => sum + f.sizeBytes, 0);
  
  // Format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formattedUsed = formatBytes(totalBytes);
  const docsCount = files.filter((f) => f.category === "Document").length;
  const imagesCount = files.filter((f) => f.category === "Image").length;

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
        {/* Storage Cap Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-[#5271ff]/30 hover:shadow-[0_0_20px_rgba(82,113,255,0.15)] hover:-translate-y-0.5">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#5271ff]/10 blur-xl transition-all duration-500 group-hover:scale-150" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Storage Used
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
                {formattedUsed} <span className="text-xs font-normal text-white/30">/ 10 GB limit</span>
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5271ff]/10 border border-[#5271ff]/20 text-[#5271ff] shadow-[0_0_15px_rgba(82,113,255,0.1)]">
              <Cloud className="h-6 w-6 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5271ff]" />
            Secure cloud asset bounds
          </div>
        </div>

        {/* Total Documents Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-0.5">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-cyan-500/10 blur-xl transition-all duration-500 group-hover:scale-150" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Documents
              </p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-cyan-400 sm:text-4xl">
                {docsCount} <span className="text-xs font-normal text-white/30">records</span>
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <FileText className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
            PDFs, word files, spreadsheets
          </div>
        </div>

        {/* Images/Media Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:-translate-y-0.5">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-amber-500/10 blur-xl transition-all duration-500 group-hover:scale-150" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Images & Visuals
              </p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-amber-400 sm:text-4xl">
                {imagesCount} <span className="text-xs font-normal text-white/30">assets</span>
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <ImageIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            PNGs, JPEGs, SVG vector nodes
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsCards;
