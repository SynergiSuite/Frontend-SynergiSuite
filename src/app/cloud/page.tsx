"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { gsap } from "gsap";
import { RefreshCw, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import StatsCards, { FileType } from "./statesCards";
import CloudFilterBar from "./cloudFilterBar";
import FilesTable from "./filesTable";
import FilesGridView from "./filesGridView";
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
    labelType: 3,
    referenceType: "project",
  },
  {
    id: "2",
    name: "Marketing_Banner_Hero.png",
    category: "Image",
    size: "14.5 MB",
    sizeBytes: 15204352,
    uploadedAt: "May 12, 2026",
    labelType: 2,
    referenceType: "team",
  },
  {
    id: "3",
    name: "Synergy_Intro_Walkthrough.mp4",
    category: "Media",
    size: "128.4 MB",
    sizeBytes: 134637158,
    uploadedAt: "May 14, 2026",
    labelType: 1,
    referenceType: "personal",
  },
  {
    id: "4",
    name: "Synergy_Source_v2.zip",
    category: "Archive",
    size: "450.8 MB",
    sizeBytes: 472711168,
    uploadedAt: "May 18, 2026",
    labelType: 3,
    referenceType: "project",
  },
  {
    id: "5",
    name: "Workspace_Plan_v3.docx",
    category: "Document",
    size: "512 KB",
    sizeBytes: 524288,
    uploadedAt: "May 22, 2026",
    labelType: 4,
    referenceType: "client",
  },
];

interface DbDocument {
  document_id?: string | number;
  name?: string;
  created_at?: string;
  label?: string | null;
  reference_type?: string;
  reference_id?: string;
}

const mapDbDocumentToFileType = (dbDoc: DbDocument): FileType => {
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

  // Size fallback
  const size = "1.2 MB";
  const sizeBytes = 1258291;

  let labelType = 1;
  if (dbDoc.reference_type === "team") labelType = 2;
  else if (dbDoc.reference_type === "project") labelType = 3;
  else if (dbDoc.reference_type === "client") labelType = 4;
  else if (dbDoc.reference_type === "other") labelType = 5;

  return {
    id: String(dbDoc.document_id || ""),
    name: dbDoc.name || "Untitled",
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

const ITEMS_PER_PAGE = 8;

export default function CloudStoragePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Data states
  const [files, setFiles] = useState<FileType[]>([]);
  const [teams, setTeams] = useState<
    Array<{ id?: string; name?: string; team_id?: string; team_name?: string }>
  >([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedScope, setSelectedScope] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [detailFile, setDetailFile] = useState<FileType | null>(null);
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim().toLowerCase());
      setCurrentPage(1);
    }, 280);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  // Load documents
  const loadDocuments = useCallback(async () => {
    try {
      setIsDataLoading(true);
      const dbDocs = await getDocumentsApi();
      if (dbDocs && Array.isArray(dbDocs)) {
        const mapped = dbDocs.map(mapDbDocumentToFileType);
        setFiles(mapped);
      } else {
        setFiles(DEFAULT_FILES);
      }

      // Fetch teams
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
      console.warn("Failed to load documents from backend, using default assets.", error);
      setFiles(DEFAULT_FILES);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => {
    setUserId(String(CookieManager("get", "user-id") || ""));
    setRole(String(CookieManager("get", "primary_role") || CookieManager("get", "role") || ""));
    void loadDocuments();
  }, [loadDocuments]);

  // Filtering
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      // Search
      if (debouncedSearch) {
        const matchName = file.name.toLowerCase().includes(debouncedSearch);
        const matchCat = file.category.toLowerCase().includes(debouncedSearch);
        const matchLabel = file.userLabel?.toLowerCase().includes(debouncedSearch);
        const matchSize = file.size.toLowerCase().includes(debouncedSearch);
        if (!matchName && !matchCat && !matchLabel && !matchSize) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "all" && file.category !== selectedCategory) {
        return false;
      }

      // Scope filter
      if (selectedScope !== "all") {
        if (selectedScope === "personal" && file.labelType !== 1 && file.referenceType !== "personal") {
          return false;
        }
        if (selectedScope === "team" && file.labelType !== 2 && file.referenceType !== "team") {
          return false;
        }
        if (selectedScope === "project" && file.labelType !== 3 && file.referenceType !== "project") {
          return false;
        }
        if (selectedScope === "client" && file.labelType !== 4 && file.referenceType !== "client") {
          return false;
        }
        if (selectedScope === "other" && file.labelType !== 5 && file.referenceType !== "other") {
          return false;
        }
      }

      return true;
    });
  }, [files, debouncedSearch, selectedCategory, selectedScope]);

  // Pagination
  const totalItems = filteredFiles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFiles = filteredFiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // GSAP Entrance Animations
  useLayoutEffect(() => {
    const element = rootRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("[data-cloud-section]");
      if (sections.length > 0) {
        gsap.fromTo(
          sections,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.05,
            ease: "power2.out",
            clearProps: "all",
          }
        );
      }
    }, element);

    return () => context.revert();
  }, [files.length]);

  // Actions
  const handleUploadFile = async () => {
    await loadDocuments();
  };

  const handleDeleteFile = async (id: string) => {
    try {
      await deleteDocumentApi(id);
      setFiles((prev) => prev.filter((f) => String(f.id) !== String(id)));
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Failed to delete document:", error);
      const message = error instanceof Error ? error.message : "Failed to delete document";
      toast.error(message);
      throw error;
    }
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== "all" ||
    selectedScope !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedScope("all");
    setCurrentPage(1);
  };

  return (
    <div ref={rootRef} className="min-h-full text-v2-neutral-100">
      <div className="flex flex-col gap-6">
        {/* Page Top Header */}
        <header
          data-cloud-section
          className="flex flex-col gap-4 border-b border-v2-neutral-500 pb-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-100 sm:text-4xl">
              Cloud Storage
            </h1>
            <p className="mt-2 text-sm leading-6 text-v2-neutral-300">
              Review, organize, preview, and securely manage company files and project deliverables.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadDocuments}
              disabled={isDataLoading}
              className="gap-1.5"
            >
              <RefreshCw
                className={`size-3.5 ${isDataLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => setIsUploadOpen(true)}
              className="gap-1.5 shadow-md"
            >
              <Upload className="size-4" />
              <span>Upload File</span>
            </Button>
          </div>
        </header>

        {/* Stats Metrics Cards */}
        <div data-cloud-section>
          <StatsCards files={files} />
        </div>

        {/* Filter and Control Bar */}
        <div data-cloud-section>
          <CloudFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            selectedScope={selectedScope}
            onScopeChange={(scope) => {
              setSelectedScope(scope);
              setCurrentPage(1);
            }}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Files Content (Table or Grid View) */}
        <div data-cloud-section className="space-y-4">
          {viewMode === "table" ? (
            <FilesTable
              files={paginatedFiles}
              isLoading={isDataLoading}
              onSelect={setDetailFile}
              onDelete={setDeleteFileId}
              onUploadClick={() => setIsUploadOpen(true)}
              teams={teams}
              userId={userId}
              role={role}
            />
          ) : (
            <FilesGridView
              files={paginatedFiles}
              isLoading={isDataLoading}
              onSelect={setDetailFile}
              onDelete={setDeleteFileId}
              onUploadClick={() => setIsUploadOpen(true)}
            />
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/* Modals Portals */}
      <AnimatePresence>
        {isUploadOpen && (
          <UploadFileModal
            onClose={() => setIsUploadOpen(false)}
            onSave={handleUploadFile}
            teams={teams}
            role={role}
          />
        )}

        {detailFile && (
          <FileDetailModal
            file={detailFile}
            open={detailFile !== null}
            onClose={() => setDetailFile(null)}
            onDelete={(id) => {
              setDetailFile(null);
              setDeleteFileId(id);
            }}
          />
        )}

        {deleteFileId && (
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
        )}
      </AnimatePresence>
    </div>
  );
}
