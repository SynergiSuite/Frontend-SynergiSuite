"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileText,
  Calendar,
  X,
  ExternalLink,
  Trash,
  HardDrive,
  Tag,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileType } from "./statesCards";
import { getViewUrlApi } from "./apis/getViewUrlApi";
import { getCategoryIcon, getCategoryBadge, getScopeBadge } from "./filesTableRows";
import { toast } from "sonner";

type FileDetailProps = {
  file: FileType | null;
  open: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
};

const DetailTile = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/30 p-3.5 space-y-1">
    <div className="flex items-center gap-1.5 text-[11px] font-medium text-v2-neutral-400">
      <Icon className="size-3.5 text-v2-neutral-300" />
      <span>{label}</span>
    </div>
    <div className="text-xs font-semibold text-v2-neutral-100 break-words">
      {value}
    </div>
  </div>
);

export default function FileDetailModal({
  file,
  open,
  onClose,
  onDelete,
}: FileDetailProps) {
  const [isViewing, setIsViewing] = useState(false);

  if (!file) return null;

  const scope = getScopeBadge(file);
  const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";

  const handleViewDocument = async () => {
    try {
      setIsViewing(true);
      toast.loading("Fetching secure document link...", { id: `view-${file.id}` });
      const { viewUrl } = await getViewUrlApi(file.id);
      toast.success("Opening document in new tab", { id: `view-${file.id}` });
      window.open(viewUrl, "_blank");
    } catch {
      toast.error("Failed to fetch document view URL", { id: `view-${file.id}` });
    } finally {
      setIsViewing(false);
    }
  };

  const getScopeDetail = () => {
    if (file.labelType === 1 || file.referenceType === "personal") {
      return "Personal Workspace (Private)";
    }
    if (file.labelType === 2 || file.referenceType === "team") {
      return file.teamId ? `Shared with Team (ID: ${file.teamId})` : "Shared with Team";
    }
    if (file.labelType === 3 || file.referenceType === "project") {
      return file.projectId ? `Bound to Project (ID: ${file.projectId})` : "Project Bound";
    }
    if (file.labelType === 4 || file.referenceType === "client") {
      const flags = [file.isClient ? "From Client" : "", file.forClient ? "For Client" : ""].filter(Boolean);
      return flags.length > 0 ? `Client Scope: ${flags.join(" & ")}` : "Client Scope";
    }
    return "Workspace General";
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-v2-neutral-600/75 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="relative z-10 w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border border-v2-neutral-400 bg-v2-neutral-600 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-v2-neutral-500 px-6 py-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-v2-neutral-100 text-v2-neutral-600 shadow-sm">
                  {getCategoryIcon(file.category, "size-5")}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-v2-neutral-400">
                      .{ext}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border ${getCategoryBadge(
                        file.category
                      )}`}
                    >
                      {file.category}
                    </span>
                  </div>
                  <h3
                    className="truncate text-base font-semibold text-v2-neutral-100 mt-0.5"
                    title={file.name}
                  >
                    {file.name}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-v2-neutral-500 text-v2-neutral-400 hover:bg-v2-neutral-500 hover:text-v2-neutral-100 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailTile
                  icon={FileText}
                  label="Document Name"
                  value={file.name}
                />
                <DetailTile
                  icon={HardDrive}
                  label="File Size"
                  value={<span className="font-mono">{file.size}</span>}
                />
                <DetailTile
                  icon={Calendar}
                  label="Upload Date"
                  value={file.uploadedAt}
                />
                <DetailTile
                  icon={scope.icon}
                  label="Classification Scope"
                  value={getScopeDetail()}
                />
                {file.userLabel && (
                  <DetailTile
                    icon={Tag}
                    label="Custom Label"
                    value={file.userLabel}
                  />
                )}
                <DetailTile
                  icon={ShieldCheck}
                  label="Security & Storage"
                  value="MinIO Encrypted Bucket"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-3 border-t border-v2-neutral-500 px-6 py-4 shrink-0 bg-v2-neutral-600">
              <div>
                {onDelete && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onClose();
                      onDelete(file.id);
                    }}
                    className="gap-1.5 text-rose-400 hover:text-rose-300 border-v2-neutral-500 hover:border-rose-400/40 hover:bg-rose-500/10"
                  >
                    <Trash className="size-3.5" />
                    <span>Delete Asset</span>
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleViewDocument}
                  disabled={isViewing}
                  className="gap-1.5 shadow-md"
                >
                  {isViewing ? (
                    <LoaderCircle className="size-3.5 animate-spin" />
                  ) : (
                    <ExternalLink className="size-3.5" />
                  )}
                  <span>{isViewing ? "Opening..." : "View Document"}</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
