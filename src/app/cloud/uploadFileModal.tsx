"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CloudUpload,
  FileCheck,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileType } from "./statesCards";
import {
  DocumentLabel,
  ALL_DOCUMENT_LABEL_OPTIONS,
  CLIENT_DOCUMENT_LABEL_OPTIONS,
} from "@/app/enums/documentLabel.enum";
import { getPresignedUrlApi } from "./apis/getPresignedUrlApi";
import { createDocumentApi } from "./apis/createDocumentApi";
import { getAllProjectsApi } from "@/app/projects/apis/getAllProjectsApi";
import { Projects } from "@/app/projects/schemas/project";
import { toast } from "sonner";

type UploadFileModalProps = {
  onClose: () => void;
  onSave: (payload: Omit<FileType, "id" | "uploadedAt" | "sizeBytes"> & {
    document_id?: number;
    file_path?: string;
  }) => Promise<void>;
  teams: Array<{ id?: string; name?: string; team_id?: string; team_name?: string }>;
  role?: string;
};

export default function UploadFileModal({
  onClose,
  onSave,
  teams,
  role,
}: UploadFileModalProps) {
  const isClientRole = role?.toLowerCase() === "client";
  const labelOptions = isClientRole
    ? CLIENT_DOCUMENT_LABEL_OPTIONS
    : ALL_DOCUMENT_LABEL_OPTIONS;

  const [name, setName] = useState("");
  const [category, setCategory] = useState<
    "Document" | "Image" | "Media" | "Archive" | "Other"
  >("Document");
  const [size, setSize] = useState("");
  const [userLabel, setUserLabel] = useState("");
  const [labelType, setLabelType] = useState<number>(
    isClientRole ? DocumentLabel.PROJECT : DocumentLabel.PROJECT
  );
  const [teamId, setTeamId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [apiProjects, setApiProjects] = useState<Projects[]>([]);
  const [isClient, setIsClient] = useState(true);
  const [forClient, setForClient] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  // File drag & drop state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projects = await getAllProjectsApi();
        const mappedProjects: Projects[] = projects.map((p) => ({
          id: p.id,
          name: p.name,
          status: p.status,
          duration: p.duration,
          teams: [],
          client: {} as Projects["client"],
          tasks: [],
        }));
        setApiProjects(mappedProjects);
      } catch (error) {
        console.error("Failed to load projects for dropdown:", error);
      }
    };
    loadProjects();
  }, []);

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

    // Format human-readable size
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !size.trim()) {
      toast.error("Please select a file to upload.");
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
          selectedFile.type || "application/octet-stream",
          process.env.NEXT_PUBLIC_DOC_BUCKET || "synergisuite-resources"
        );
        filePath = presignedData.filePath;

        // Step 2: Upload file binary directly to MinIO
        setUploadStatus("Uploading binary data to MinIO...");
        const uploadRes = await fetch(presignedData.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": selectedFile.type || "application/octet-stream",
          },
          body: selectedFile,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to write binary block to storage bucket");
        }
      }

      // Step 3: Register TypeORM database document record
      setUploadStatus("Registering database entry...");

      let reference_type = "project";
      let reference_id = projectId || "project";

      if (labelType === DocumentLabel.PERSONAL) {
        reference_type = "personal";
        reference_id = "personal";
      } else if (labelType === DocumentLabel.TEAM) {
        reference_type = "team";
        reference_id = teamId || "team";
      } else if (labelType === DocumentLabel.PROJECT) {
        reference_type = "project";
        reference_id = projectId || "project";
      } else if (labelType === DocumentLabel.CLIENT) {
        reference_type = "client";
        reference_id = "client";
      } else if (labelType === DocumentLabel.OTHER) {
        reference_type = "other";
        reference_id = "other";
      }

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
      });

      toast.success("Document uploaded and indexed successfully!");
      onClose();
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to complete upload workflow";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setUploadStatus("");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-v2-neutral-600/75 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative z-10 w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border border-v2-neutral-400 bg-v2-neutral-600 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-v2-neutral-500 px-6 py-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-v2-neutral-100 text-v2-neutral-600 shadow-sm">
                <CloudUpload className="size-4.5" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-v2-neutral-100">
                  Upload Cloud Asset
                </h3>
                <p className="text-xs text-v2-neutral-400">
                  Upload files, documents, or visuals directly into cloud storage.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-v2-neutral-500 text-v2-neutral-400 hover:bg-v2-neutral-500 hover:text-v2-neutral-100 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-4 overflow-y-auto custom-scrollbar"
          >
            {/* Drag & Drop Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center transition-all cursor-pointer text-center ${
                dragActive
                  ? "border-v2-neutral-100 bg-v2-neutral-500/50"
                  : selectedFile
                  ? "border-emerald-500/60 bg-emerald-500/10"
                  : "border-v2-neutral-500 hover:border-v2-neutral-400 bg-v2-neutral-500/20 hover:bg-v2-neutral-500/30"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="grid size-11 place-items-center rounded-xl bg-v2-neutral-500/40 text-v2-neutral-200 mb-2">
                {selectedFile ? (
                  <FileCheck className="size-6 text-emerald-400" />
                ) : (
                  <Upload className="size-6 text-v2-neutral-300" />
                )}
              </div>
              <p className="text-xs font-semibold text-v2-neutral-100">
                {selectedFile
                  ? `Selected: ${selectedFile.name}`
                  : "Drag and drop file here, or click to browse"}
              </p>
              <p className="text-[11px] text-v2-neutral-400 mt-1">
                {selectedFile
                  ? `Size: ${size}`
                  : "Supports PDF, DOC, Images, Archives, Video (up to 100 MB)"}
              </p>
            </div>

            {/* File Name & Category */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                  File Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q1_Financial_Report.pdf"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none placeholder:text-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                  Category *
                </label>
                <Select
                  value={category}
                  onValueChange={(val) =>
                    setCategory(
                      val as "Document" | "Image" | "Media" | "Archive" | "Other"
                    )
                  }
                >
                  <SelectTrigger className="h-10 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent className="z-[100] rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                    <SelectItem value="Document" className="cursor-pointer text-xs">
                      Document (PDF, Word, Sheet)
                    </SelectItem>
                    <SelectItem value="Image" className="cursor-pointer text-xs">
                      Image (PNG, JPG, SVG)
                    </SelectItem>
                    <SelectItem value="Media" className="cursor-pointer text-xs">
                      Media (Video, Audio)
                    </SelectItem>
                    <SelectItem value="Archive" className="cursor-pointer text-xs">
                      Archive (ZIP, RAR, Tar)
                    </SelectItem>
                    <SelectItem value="Other" className="cursor-pointer text-xs">
                      Other File
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* File Size & User Label */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                  File Size *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2.4 MB"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none placeholder:text-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20 font-mono"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                  Custom Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q1 Final Deliverable"
                  value={userLabel}
                  onChange={(e) => setUserLabel(e.target.value)}
                  className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 outline-none placeholder:text-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-2 focus:ring-v2-neutral-400/20"
                />
              </div>
            </div>

            {/* Scope / Classification */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                  Access Classification *
                </label>
                <Select
                  value={String(labelType)}
                  onValueChange={(val) => setLabelType(Number(val))}
                >
                  <SelectTrigger className="h-10 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                    <SelectValue placeholder="Select classification..." />
                  </SelectTrigger>
                  <SelectContent className="z-[100] rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                    {labelOptions.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={String(opt.value)}
                        className="cursor-pointer text-xs"
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Project / Team Selector */}
              {labelType === DocumentLabel.PROJECT && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                    Target Project *
                  </label>
                  <Select
                    value={projectId}
                    onValueChange={setProjectId}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                      <SelectValue placeholder="Choose project..." />
                    </SelectTrigger>
                    <SelectContent className="z-[100] max-h-56 rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                      {apiProjects.map((p) => (
                        <SelectItem
                          key={p.id}
                          value={p.id}
                          className="cursor-pointer text-xs"
                        >
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {labelType === DocumentLabel.TEAM && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-v2-neutral-300">
                    Target Team *
                  </label>
                  <Select
                    value={teamId}
                    onValueChange={setTeamId}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-3 text-xs text-v2-neutral-600 shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                      <SelectValue placeholder="Choose team..." />
                    </SelectTrigger>
                    <SelectContent className="z-[100] max-h-56 rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                      {teams.map((t) => (
                        <SelectItem
                          key={t.id || t.team_id || t.name}
                          value={String(t.id || t.team_id || t.name)}
                          className="cursor-pointer text-xs"
                        >
                          {t.name || t.team_name || "Unnamed Team"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {labelType === DocumentLabel.CLIENT && (
                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-v2-neutral-300">
                    <input
                      type="checkbox"
                      checked={isClient}
                      onChange={(e) => setIsClient(e.target.checked)}
                      className="size-4 rounded accent-v2-neutral-100"
                    />
                    <span>From Client</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-v2-neutral-300">
                    <input
                      type="checkbox"
                      checked={forClient}
                      onChange={(e) => setForClient(e.target.checked)}
                      className="size-4 rounded accent-v2-neutral-100"
                    />
                    <span>For Client</span>
                  </label>
                </div>
              )}
            </div>

            {/* Status indicator */}
            {uploadStatus && (
              <div className="flex items-center gap-2 rounded-xl bg-v2-neutral-500/40 p-3 text-xs text-v2-neutral-300">
                <LoaderCircle className="size-4 animate-spin text-v2-neutral-100" />
                <span>{uploadStatus}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-v2-neutral-500 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="size-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Upload Asset</span>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
