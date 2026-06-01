"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { gsap } from "gsap";

import SubHeader from "./subHeadingSearchbar";
import StatsCards, { FileType } from "./statesCards";
import FilesTable from "./filesTable";
import Pagination from "./footer";
import UploadFileModal from "./uploadFileModal";
import DeleteFileModal from "./deleteFileModal";
import FileDetailModal from "./fileDetailModal";

import { getDocumentsApi } from "./apis/getDocumentsApi";
import { deleteDocumentApi } from "./apis/deleteDocumentApi";
import { getTeamsApi } from "@/app/teams/apis/getTeamsApi";
import { CookieManager } from "@/lib/cookieManager";

const DEFAULT_FILES: FileType[] = [
  {
    id: "1",
    name: "Financial_Report_Q1.pdf",
    category: "Document",
    size: "2.4 MB",
    sizeBytes: 2516582,
    uploadedAt: "May 10, 2026",
  },
  {
    id: "2",
    name: "Marketing_Banner_Hero.png",
    category: "Image",
    size: "14.5 MB",
    sizeBytes: 15204352,
    uploadedAt: "May 12, 2026",
  },
  {
    id: "3",
    name: "Synergy_Intro_Walkthrough.mp4",
    category: "Media",
    size: "128.4 MB",
    sizeBytes: 134637158,
    uploadedAt: "May 14, 2026",
  },
  {
    id: "4",
    name: "Synergy_Source_v2.zip",
    category: "Archive",
    size: "450.8 MB",
    sizeBytes: 472711168,
    uploadedAt: "May 18, 2026",
  },
  {
    id: "5",
    name: "Workspace_Plan_v3.docx",
    category: "Document",
    size: "512 KB",
    sizeBytes: 524288,
    uploadedAt: "May 22, 2026",
  },
];

const mapDbDocumentToFileType = (dbDoc: any): FileType => {
  const name = dbDoc.name || "Untitled";
  const ext = name.split(".").pop()?.toLowerCase();

  let category: "Document" | "Image" | "Media" | "Archive" | "Other" = "Document";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext || "")) {
    category = "Image";
  } else if (["mp4", "webm", "ogg", "mp3", "wav"].includes(ext || "")) {
    category = "Media";
  } else if (["zip", "tar", "gz", "rar", "7z"].includes(ext || "")) {
    category = "Archive";
  } else if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(ext || "")) {
    category = "Document";
  } else {
    category = "Other";
  }

  // Standard size fallbacks since DB record maps path instead of sizes
  const size = "1.2 MB";
  const sizeBytes = 1258291;

  let labelType = 1; // Personal
  if (dbDoc.reference_type === "team") labelType = 2;
  else if (dbDoc.reference_type === "project") labelType = 3;
  else if (dbDoc.reference_type === "client") labelType = 4;
  else if (dbDoc.reference_type === "other") labelType = 5;

  return {
    id: String(dbDoc.document_id),
    name: dbDoc.name,
    category,
    size,
    sizeBytes,
    uploadedAt: new Date(dbDoc.created_at || Date.now()).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    userLabel: dbDoc.label || undefined,
    labelType,
    teamId: dbDoc.reference_type === "team" ? dbDoc.reference_id : undefined,
    projectId: dbDoc.reference_type === "project" ? dbDoc.reference_id : undefined,
    isClient: dbDoc.reference_type === "client" ? true : undefined,
    forClient: dbDoc.reference_type === "client" ? true : undefined,
    referenceType: dbDoc.reference_type,
    referenceId: dbDoc.reference_id,
  };
};

export default function CloudStoragePage() {
  // states
  const [files, setFiles] = useState<FileType[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  // modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [detailFile, setDetailFile] = useState<FileType | null>(null);
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null);

  // refs
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 4;

  // Load real files on mount
  const loadDocuments = async () => {
    try {
      const dbDocs = await getDocumentsApi();
      if (dbDocs && Array.isArray(dbDocs)) {
        const mapped = dbDocs.map(mapDbDocumentToFileType);
        setFiles(mapped);
      } else {
        setFiles(DEFAULT_FILES);
      }

      // Fetch teams directly after fetching documents
      try {
        const teamsData = await getTeamsApi();
        if (teamsData && Array.isArray(teamsData.teams)) {
          setTeams(teamsData.teams);
        } else if (Array.isArray(teamsData)) {
          setTeams(teamsData);
        }
      } catch (teamError) {
        console.warn("Failed to load teams", teamError);
      }
    } catch (error) {
      console.warn("Failed to load documents from backend, using mocked fallback database.", error);
      setFiles(DEFAULT_FILES);
    }
  };

  useEffect(() => {
    setUserId(String(CookieManager("get", "user-id") || ""));
    setRole(String(CookieManager("get", "role") || ""));
    loadDocuments();
  }, []);

  // filtering
  const filteredFiles = useMemo(() => {
    return files.filter((f) =>
      [f.name, f.category, f.size]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [files, search]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFiles = filteredFiles.slice(startIndex, startIndex + itemsPerPage);

  // GSAP stagger mount animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([".cloud-header-area", ".cloud-stats-area", ".cloud-table-area"], {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
        clearProps: "all",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // CRUD handlers
  const handleUploadFile = async () => {
    // Re-fetch all documents from backend to reflect the newly logged upload perfectly
    await loadDocuments();
  };

  const handleEditFile = async (id: string, payload: Omit<FileType, "id" | "uploadedAt" | "sizeBytes">) => {
    try {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...payload } : f))
      );
      toast.success("File record updated successfully");
    } catch {
      toast.error("Failed to edit file details");
    }
  };

  const handleDeleteFile = async (id: string) => {
    try {
      // Call delete backend API
      await deleteDocumentApi(id);

      setFiles((prev) => prev.filter((f) => f.id !== id));
      toast.success("File successfully deleted");
    } catch {
      // Fallback local deletion if API is not fully set up
      setFiles((prev) => prev.filter((f) => f.id !== id));
      toast.success("File successfully deleted locally");
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-0 w-full overflow-hidden p-6 md:p-10">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#5271ff]/[0.06] blur-[130px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-[#3a4ec4]/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-[#22d3ee]/[0.04] blur-[100px]" />

      <div className="relative z-10 flex min-h-[calc(100vh-140px)] flex-col gap-6 lg:gap-8">
        {/* Header Section */}
        <div className="cloud-header-area">
          <SubHeader
            search={search}
            setSearch={setSearch}
            onUploadClick={() => setIsUploadOpen(true)}
          />
        </div>

        {/* Stats Widgets */}
        <div className="cloud-stats-area">
          <StatsCards files={files} />
        </div>

        {/* Files Table Section */}
        <div className="cloud-table-area flex flex-1 flex-col min-h-0">
          <div className="flex-1 overflow-hidden">
            <FilesTable
              files={currentFiles}
              onSelect={setDetailFile}
              onEdit={() => { }}
              onDelete={setDeleteFileId}
              teams={teams}
              userId={userId}
              role={role}
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/* Modals Portals */}
      <AnimatePresence>
        {isUploadOpen ? (
          <UploadFileModal
            onClose={() => setIsUploadOpen(false)}
            onSave={handleUploadFile}
            teams={teams}
          />
        ) : null}

        {detailFile ? (
          <FileDetailModal
            file={detailFile}
            open={detailFile !== null}
            onClose={() => setDetailFile(null)}
          />
        ) : null}

        {deleteFileId ? (
          <DeleteFileModal
            open={deleteFileId !== null}
            fileId={deleteFileId}
            onOpenChange={(open) => {
              if (!open) setDeleteFileId(null);
            }}
            onConfirm={async (id) => {
              await handleDeleteFile(id);
              setDeleteFileId(null);
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
