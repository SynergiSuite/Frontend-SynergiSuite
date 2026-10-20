"use client";

import React from "react";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TableHeader from "./filesTableHeader";
import FileRow from "./filesTableRows";
import { FileType } from "./statesCards";

type Props = {
  files: FileType[];
  isLoading?: boolean;
  onSelect: (file: FileType) => void;
  onEdit?: (file: FileType) => void;
  onDelete: (id: string) => void;
  onUploadClick?: () => void;
  teams?: Array<{ id?: string; name?: string; team_id?: string; team_name?: string }>;
  userId?: string;
  role?: string;
};

export default function FilesTable({
  files,
  isLoading = false,
  onSelect,
  onDelete,
  onUploadClick,
  teams = [],
  userId = "",
  role = "",
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-v2-neutral-300 bg-v2-neutral-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <TableHeader />
          <tbody className="divide-y divide-v2-neutral-200/70">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-3.5 pl-4 pr-3 sm:pl-6">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-v2-neutral-200 shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 w-36 bg-v2-neutral-300 rounded" />
                        <div className="h-2.5 w-20 bg-v2-neutral-200 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="h-5 w-20 bg-v2-neutral-200 rounded-md" />
                  </td>
                  <td className="px-3 py-3.5 hidden md:table-cell">
                    <div className="h-5 w-16 bg-v2-neutral-200 rounded-md" />
                  </td>
                  <td className="px-3 py-3.5 hidden sm:table-cell">
                    <div className="h-3.5 w-14 bg-v2-neutral-300 rounded" />
                  </td>
                  <td className="px-3 py-3.5 hidden lg:table-cell">
                    <div className="h-3.5 w-20 bg-v2-neutral-200 rounded" />
                  </td>
                  <td className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                    <div className="flex justify-end gap-1.5">
                      <div className="size-8 rounded-lg bg-v2-neutral-200" />
                      <div className="size-8 rounded-lg bg-v2-neutral-200" />
                    </div>
                  </td>
                </tr>
              ))
            ) : files.length > 0 ? (
              files.map((file) => (
                <FileRow
                  key={file.id}
                  file={file}
                  onSelect={onSelect}
                  onDelete={onDelete}
                  teams={teams}
                  userId={userId}
                  role={role}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
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
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
