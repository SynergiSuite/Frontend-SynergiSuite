"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, CloudUpload, X } from "lucide-react";
import { FileType } from "./statesCards";
import { DocumentLabel, DOCUMENT_LABEL_OPTIONS } from "@/app/enums/documentLabel.enum";
import { getPresignedUrlApi } from "./apis/getPresignedUrlApi";
import { createDocumentApi } from "./apis/createDocumentApi";
import { toast } from "sonner";

type UploadFileModalProps = {
  onClose: () => void;
  onSave: (payload: Omit<FileType, "id" | "uploadedAt" | "sizeBytes"> & { document_id?: number; file_path?: string }) => Promise<void>;
  teams: any[];
};

const MOCK_PROJECTS = ["SynergiSuite Frontend", "NextGen Mobile Client", "Enterprise CRM Integrator", "AI Analytics Node"];

export default function UploadFileModal({
  onClose,
  onSave,
  teams,
}: UploadFileModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"Document" | "Image" | "Media" | "Archive" | "Other">("Document");
  const [size, setSize] = useState("");
  const [userLabel, setUserLabel] = useState("");
  const [labelType, setLabelType] = useState<number>(DocumentLabel.PERSONAL);
  const [teamId, setTeamId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [isClient, setIsClient] = useState(true);
  const [forClient, setForClient] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setName(file.name);
    
    // Human-readable size
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB < 0.1) {
      setSize(`${(file.size / 1024).toFixed(1)} KB`);
    } else {
      setSize(`${sizeInMB.toFixed(2)} MB`);
    }

    // Auto-detect category
    if (file.type.startsWith("image/")) {
      setCategory("Image");
    } else if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
      setCategory("Media");
    } else if (
      file.name.endsWith(".zip") ||
      file.name.endsWith(".tar") ||
      file.name.endsWith(".gz") ||
      file.name.endsWith(".rar") ||
      file.name.endsWith(".7z")
    ) {
      setCategory("Archive");
    } else {
      setCategory("Document");
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !size) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setIsSubmitting(true);
      let filePath = "";

      if (selectedFile) {
        // Step 1: Request Pre-Signed upload URL from backend MinIO
        setUploadStatus("Requesting upload ticket...");
        const presignedData = await getPresignedUrlApi(
          selectedFile.name,
          selectedFile.type || "application/octet-stream"
        );
        filePath = presignedData.filePath;

        // Step 2: Upload file binary directly to MinIO
        setUploadStatus("Uploading binary pack...");
        const uploadRes = await fetch(presignedData.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": selectedFile.type || "application/octet-stream",
          },
          body: selectedFile,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to write binary block to MinIO bucket");
        }
      }

      // Step 3: Register TypeORM database document record
      setUploadStatus("Creating database entry...");
      
      // Determine reference type and reference ID mapping
      let reference_type = "personal";
      let reference_id = "personal";

      if (labelType === DocumentLabel.TEAM) {
        reference_type = "team";
        reference_id = teamId;
      } else if (labelType === DocumentLabel.PROJECT) {
        reference_type = "project";
        reference_id = projectId;
      } else if (labelType === DocumentLabel.CLIENT) {
        reference_type = "client";
        reference_id = "client";
      } else if (labelType === DocumentLabel.OTHER) {
        reference_type = "other";
        reference_id = "other";
      }

      // Build label value
      let finalLabel = userLabel.trim();
      if (labelType === DocumentLabel.CLIENT) {
        const clientFlags = [
          isClient ? "From Client" : "",
          forClient ? "For Client" : "",
        ].filter(Boolean);
        finalLabel = finalLabel
          ? `${finalLabel} (${clientFlags.join(" & ")})`
          : clientFlags.join(" & ");
      }

      const dbDoc = await createDocumentApi({
        name,
        reference_type,
        reference_id,
        file_path: filePath || `manual-uploads/${name}`,
        label: finalLabel || null,
      });

      // Step 4: Propagate new file item state changes to parent view
      await onSave({
        name,
        category,
        size,
        userLabel: finalLabel || undefined,
        labelType,
        teamId: labelType === DocumentLabel.TEAM ? teamId : undefined,
        projectId: labelType === DocumentLabel.PROJECT ? projectId : undefined,
        isClient: labelType === DocumentLabel.CLIENT ? isClient : undefined,
        forClient: labelType === DocumentLabel.CLIENT ? forClient : undefined,
        document_id: dbDoc.document_id,
        file_path: filePath,
      } as any);

      toast.success("Document uploaded and saved successfully!");
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to complete upload workflow");
    } finally {
      setIsSubmitting(false);
      setUploadStatus("");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      <motion.div
        className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0c0a2f] bg-gradient-to-br from-[#5271ff]/5 via-[#0c0a2f]/95 to-[#0a0826] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-md flex flex-col max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div className="mb-6 border-b border-white/[0.08] pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <CloudUpload className="h-6 w-6 text-[#5271ff]" />
                Upload New Asset
              </h2>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-white/30 mt-1">
                Store documents, images, and other assets safely in workspace cloud.
              </p>
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

        <form className="flex flex-1 flex-col" onSubmit={handleSubmit}>
          {/* Active Drag and Drop Panel */}
          <div
            onClick={handleFileClick}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer mb-6 ${
              dragActive
                ? "border-[#5271ff] bg-[#5271ff]/10 shadow-[0_0_15px_rgba(82,113,255,0.15)]"
                : selectedFile
                  ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "border-white/20 bg-white/[0.01] hover:bg-white/[0.03]"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <CloudUpload className={`h-10 w-10 mb-3 ${selectedFile ? "text-emerald-400" : "text-white/40 animate-bounce"}`} />
            <p className="text-sm font-semibold text-white text-center">
              {selectedFile ? `Selected: ${selectedFile.name}` : "Drag and drop file here, or click to select"}
            </p>
            <p className="text-[10px] text-white/30 mt-1.5 uppercase tracking-wider font-semibold">
              {selectedFile ? `Calculated Size: ${size}` : "Max file upload limit: 100 MB"}
            </p>
          </div>

          <div className="space-y-4 flex-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                  File Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Q1_Financial_Report.pdf"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value as any)}
                    className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0c0a2f] px-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                  >
                    <option value="Document">Document</option>
                    <option value="Image">Image</option>
                    <option value="Media">Media</option>
                    <option value="Archive">Archive</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                  File Size (e.g. 4.2 MB)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 4.2 MB"
                  value={size}
                  onChange={(event) => setSize(event.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                  User Label (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Confidential Q1"
                  value={userLabel}
                  onChange={(event) => setUserLabel(event.target.value)}
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                  Access Classification
                </label>
                <div className="relative">
                  <select
                    value={labelType}
                    onChange={(event) => setLabelType(Number(event.target.value))}
                    className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0c0a2f] px-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                  >
                    {DOCUMENT_LABEL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                  />
                </div>
              </div>

              {/* Dynamic field rendering depending on classification */}
              {labelType === DocumentLabel.TEAM && (
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                    Select Target Team
                  </label>
                  <div className="relative">
                    <select
                      value={teamId}
                      onChange={(event) => setTeamId(event.target.value)}
                      required
                      className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0c0a2f] px-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                    >
                      <option value="">-- Choose Team --</option>
                      {teams.map((t) => (
                        <option key={t.id || t.team_id || t.name} value={String(t.id || t.team_id || t.name)}>
                          {t.name || t.team_name || "Unnamed Team"}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                    />
                  </div>
                </div>
              )}

              {labelType === DocumentLabel.PROJECT && (
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                    Select Related Project
                  </label>
                  <div className="relative">
                    <select
                      value={projectId}
                      onChange={(event) => setProjectId(event.target.value)}
                      required
                      className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0c0a2f] px-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30 focus:bg-[#0a0826]/60"
                    >
                      <option value="">-- Choose Project --</option>
                      {MOCK_PROJECTS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                    />
                  </div>
                </div>
              )}

              {labelType === DocumentLabel.CLIENT && (
                <div className="flex flex-col justify-center gap-3 pt-2">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="isClient"
                      checked={isClient}
                      onChange={(event) => setIsClient(event.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#5271ff] focus:ring-0 focus:ring-offset-0 focus:outline-none"
                    />
                    <label htmlFor="isClient" className="text-xs font-semibold uppercase tracking-wider text-white/70 select-none cursor-pointer">
                      From Client
                    </label>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="forClient"
                      checked={forClient}
                      onChange={(event) => setForClient(event.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#5271ff] focus:ring-0 focus:ring-offset-0 focus:outline-none"
                    />
                    <label htmlFor="forClient" className="text-xs font-semibold uppercase tracking-wider text-white/70 select-none cursor-pointer">
                      For Client
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload loading status indicator */}
          {isSubmitting && uploadStatus && (
            <div className="mt-6 text-center text-xs font-bold uppercase tracking-wider text-[#22d3ee] animate-pulse">
              ⚡ {uploadStatus}
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-2 text-sm font-semibold text-white/70 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08] hover:text-white hover:border-white/20 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-6 py-2 text-sm font-semibold text-white transition-all duration-300 hover:opacity-95 hover:shadow-[0_0_15px_rgba(82,113,255,0.35)] active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
