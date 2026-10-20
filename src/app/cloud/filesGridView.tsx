"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Trash,
  Eye,
  FolderOpen,
  Plus,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileType } from "./statesCards";
import {
  getCategoryIcon,
  getCategoryBadge,
  getScopeBadge,
} from "./filesTableRows";
import { getViewUrlApi } from "./apis/getViewUrlApi";

type Props = {
  files: FileType[];
  isLoading?: boolean;
  onSelect: (file: FileType) => void;
  onDelete: (id: string) => void;
  onUploadClick?: () => void;
};

function FileGridCard({
  file,
  onSelect,
  onDelete,
}: {
  file: FileType;
  onSelect: (file: FileType) => void;
  onDelete: (id: string) => void;
}) {
  const [isOpening, setIsOpening] = useState(false);
  const scope = getScopeBadge(file);
  const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";

  const handleDirectView = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsOpening(true);
      toast.loading("Fetching document link...", { id: `view-${file.id}` });
      const { viewUrl } = await getViewUrlApi(file.id);
      toast.success("Opening file in new tab", { id: `view-${file.id}` });
      window.open(viewUrl, "_blank");
    } catch {
      toast.error("Failed to load document view URL", { id: `view-${file.id}` });
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <div
      onClick={() => onSelect(file)}
      className="group relative flex flex-col justify-between rounded-2xl border border-v2-neutral-300 bg-v2-neutral-100 p-4 shadow-sm hover:shadow-md hover:border-v2-neutral-400 transition-all duration-200 cursor-pointer min-h-[190px]"
    >
      <div>
        {/* Top Header Strip */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="grid size-11 place-items-center rounded-xl bg-v2-neutral-200 shadow-xs group-hover:scale-105 transition-transform">
            {getCategoryIcon(file.category, "size-5")}
          </div>

          <div
            className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              title="Open document in new tab"
              disabled={isOpening}
              onClick={handleDirectView}
              className="inline-flex size-7.5 items-center justify-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-500 hover:border-v2-neutral-400 hover:bg-v2-neutral-200 hover:text-v2-neutral-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isOpening ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <ExternalLink className="size-3.5" />
              )}
            </button>

            <button
              type="button"
              title="View details"
              onClick={() => onSelect(file)}
              className="inline-flex size-7.5 items-center justify-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-500 hover:border-v2-neutral-400 hover:bg-v2-neutral-200 hover:text-v2-neutral-600 transition-colors cursor-pointer"
            >
              <Eye className="size-3.5" />
            </button>

            <button
              type="button"
              title="Delete asset"
              onClick={() => onDelete(file.id)}
              className="inline-flex size-7.5 items-center justify-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Trash className="size-3.5" />
            </button>
          </div>
        </div>

        {/* File Name & Label */}
        <h4
          className="truncate text-xs font-semibold text-v2-neutral-600 group-hover:text-v2-neutral-600"
          title={file.name}
        >
          {file.name}
        </h4>

        <div className="flex items-center gap-1.5 mt-1">
          <span className="font-mono text-[10px] font-bold text-v2-neutral-400">
            .{ext}
          </span>
          {file.userLabel && (
            <>
              <span className="text-v2-neutral-300">•</span>
              <span className="truncate text-[11px] text-v2-neutral-400">
                {file.userLabel}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Badges & Footer */}
      <div className="mt-4 pt-3 border-t border-v2-neutral-200/80">
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span
            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${getCategoryBadge(
              file.category
            )}`}
          >
            {file.category}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${scope.classes}`}
          >
            <scope.icon className="size-2.5" />
            <span>{scope.label}</span>
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-v2-neutral-400">
          <span className="font-mono font-medium text-v2-neutral-600">
            {file.size}
          </span>
          <span>{file.uploadedAt}</span>
        </div>
      </div>
    </div>
  );
}

export default function FilesGridView({
  files,
  isLoading = false,
  onSelect,
  onDelete,
  onUploadClick,
}: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-v2-neutral-300 bg-v2-neutral-100 p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="size-11 rounded-xl bg-v2-neutral-200" />
              <div className="size-7 rounded-lg bg-v2-neutral-200" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-v2-neutral-300 rounded" />
              <div className="h-3 w-1/2 bg-v2-neutral-200 rounded" />
            </div>
            <div className="h-8 bg-v2-neutral-200 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="rounded-2xl border border-v2-neutral-300 bg-v2-neutral-100 p-12 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-v2-neutral-200 text-v2-neutral-500 mb-3 shadow-inner">
            <FolderOpen className="size-6" />
          </div>
          <p className="text-sm font-semibold text-v2-neutral-600">
            No documents found
          </p>
          <p className="mt-1 text-xs text-v2-neutral-400 max-w-sm">
            There are currently no assets matching your filters. Adjust your search or upload a new file.
          </p>
          {onUploadClick && (
            <Button
              type="button"
              size="sm"
              onClick={onUploadClick}
              className="mt-4 gap-1.5 shadow-sm"
            >
              <Plus className="size-3.5" />
              <span>Upload File</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {files.map((file) => (
        <FileGridCard
          key={file.id}
          file={file}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
