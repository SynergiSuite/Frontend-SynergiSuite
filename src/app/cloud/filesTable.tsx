"use client";

import React from "react";
import { File } from "lucide-react";
import TableHeader from "./filesTableHeader";
import FileRow from "./filesTableRows";
import { FileType } from "./statesCards";

type Props = {
  files: FileType[];
  onSelect: (file: FileType) => void;
  onEdit: (file: FileType) => void;
  onDelete: (id: string) => void;
  teams?: any[];
  userId?: string;
  role?: string;
};

const FilesTable = ({
  files,
  onSelect,
  onEdit,
  onDelete,
  teams = [],
  userId = "",
  role = "",
}: Props) => {
  return (
    <>
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <TableHeader />

        {files.length > 0 ? (
          <div className="flex-1 overflow-y-auto">
            {files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
                teams={teams}
                userId={userId}
                role={role}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.08] text-white/30 shadow-inner">
              <File className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-white/80">No documents found for user</h3>
            <p className="mt-2 max-w-sm text-sm text-white/40">
              There are currently no documents or files available in your cloud registry.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default FilesTable;
