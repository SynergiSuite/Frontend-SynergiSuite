"use client";

import React, { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Video,
  FolderArchive,
  File,
  ExternalLink,
  Trash,
  Eye,
  Building2,
  FolderKanban,
  Users,
  User,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";
import { FileType } from "./statesCards";
import { getViewUrlApi } from "./apis/getViewUrlApi";

type Props = {
  file: FileType;
  onSelect: (file: FileType) => void;
  onDelete: (id: string) => void;
  teams?: Array<{ id?: string; name?: string; team_id?: string; team_name?: string }>;
  userId?: string;
  role?: string;
};

export const getCategoryIcon = (category: string, className = "size-4") => {
  switch (category) {
    case "Document":
      return <FileText className={`${className} text-amber-600`} />;
    case "Image":
      return <ImageIcon className={`${className} text-sky-600`} />;
    case "Media":
      return <Video className={`${className} text-emerald-600`} />;
    case "Archive":
      return <FolderArchive className={`${className} text-purple-600`} />;
    default:
      return <File className={`${className} text-v2-neutral-500`} />;
  }
};

export const getCategoryBadge = (category: string) => {
  switch (category) {
    case "Document":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Image":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "Media":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Archive":
      return "bg-purple-100 text-purple-700 border-purple-200";
    default:
      return "bg-v2-neutral-200 text-v2-neutral-600 border-v2-neutral-300";
  }
};

export const getScopeBadge = (file: FileType) => {
  if (file.labelType === 1 || file.referenceType === "personal") {
    return {
      label: "Personal",
      icon: User,
      classes: "bg-v2-neutral-200 text-v2-neutral-600",
    };
  }
  if (file.labelType === 2 || file.referenceType === "team") {
    return {
      label: "Team",
      icon: Users,
      classes: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    };
  }
  if (file.labelType === 3 || file.referenceType === "project") {
    return {
      label: "Project",
      icon: FolderKanban,
      classes: "bg-cyan-50 text-cyan-700 border border-cyan-200",
    };
  }
  if (file.labelType === 4 || file.referenceType === "client") {
    return {
      label: "Client",
      icon: Building2,
      classes: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    };
  }
  return {
    label: "Workspace",
    icon: File,
    classes: "bg-v2-neutral-200 text-v2-neutral-600",
  };
};

export default function FileRow({ file, onSelect, onDelete }: Props) {
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
    <tr
      onClick={() => onSelect(file)}
      className="group cursor-pointer transition-colors hover:bg-v2-neutral-200/40"
    >
      {/* File Name & Icon */}
      <td className="py-3.5 pl-4 pr-3 sm:pl-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-v2-neutral-200 shadow-xs group-hover:scale-105 transition-transform">
            {getCategoryIcon(file.category)}
          </div>
          <div className="min-w-0">
            <p
              className="truncate text-xs font-semibold text-v2-neutral-600 group-hover:text-v2-neutral-600 max-w-xs md:max-w-sm"
              title={file.name}
            >
              {file.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-[10px] font-bold text-v2-neutral-400">
                .{ext}
              </span>
              {file.userLabel && (
                <>
                  <span className="text-v2-neutral-300">•</span>
                  <span className="text-[11px] text-v2-neutral-400 truncate">
                    {file.userLabel}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-3 py-3.5">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold border ${getCategoryBadge(
            file.category
          )}`}
        >
          {file.category}
        </span>
      </td>

      {/* Scope / Classification */}
      <td className="px-3 py-3.5 hidden md:table-cell">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${scope.classes}`}
        >
          <scope.icon className="size-3" />
          <span>{scope.label}</span>
        </span>
      </td>

      {/* File Size */}
      <td className="px-3 py-3.5 hidden sm:table-cell">
        <span className="text-xs font-mono font-medium text-v2-neutral-600">
          {file.size}
        </span>
      </td>

      {/* Upload Date */}
      <td className="px-3 py-3.5 hidden lg:table-cell">
        <span className="text-xs text-v2-neutral-400">{file.uploadedAt}</span>
      </td>

      {/* Actions */}
      <td className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick View Button */}
          <button
            type="button"
            title="Open document in new tab"
            disabled={isOpening}
            onClick={handleDirectView}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-500 hover:border-v2-neutral-400 hover:bg-v2-neutral-200 hover:text-v2-neutral-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isOpening ? (
              <LoaderCircle className="size-3.5 animate-spin" />
            ) : (
              <ExternalLink className="size-3.5" />
            )}
          </button>

          {/* Details Button */}
          <button
            type="button"
            title="View asset details"
            onClick={() => onSelect(file)}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-500 hover:border-v2-neutral-400 hover:bg-v2-neutral-200 hover:text-v2-neutral-600 transition-colors cursor-pointer"
          >
            <Eye className="size-3.5" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            title="Delete file"
            onClick={() => onDelete(file.id)}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Trash className="size-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
