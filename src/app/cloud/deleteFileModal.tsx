"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

type DeleteFileModalProps = {
  open: boolean;
  fileId: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (fileId: string) => Promise<void> | void;
};

export default function DeleteFileModal({
  open,
  fileId,
  onOpenChange,
  onConfirm,
}: DeleteFileModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!fileId || isDeleting) return;
    try {
      setIsDeleting(true);
      await onConfirm?.(fileId);
    } catch {
      // Error handles toast in caller
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop Overlay */}
          <motion.button
            type="button"
            aria-label="Cancel delete"
            disabled={isDeleting}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer disabled:cursor-not-allowed"
            onClick={() => !isDeleting && onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Dialog Container */}
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-[24px] border border-red-500/20 bg-[#0c0a2f] bg-gradient-to-br from-red-500/5 via-[#0c0a2f]/95 to-[#0a0826] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-md text-left flex flex-col items-center"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* Warning Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)] mb-4">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
            </div>

            {/* Content Details */}
            <h3 className="text-xl font-bold tracking-tight text-white text-center">
              Delete Asset Permanently?
            </h3>
            <p className="text-xs text-white/50 text-center mt-2 leading-relaxed max-w-xs">
              This action cannot be undone. The file and all related sharing permissions will be permanently expunged from MinIO storage and the database.
            </p>

            {/* Actions Grid */}
            <div className="mt-6 flex w-full gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => onOpenChange(false)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm font-semibold text-white/70 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08] hover:text-white hover:border-white/20 active:scale-95 flex-1 justify-center flex items-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2.5 text-sm font-semibold text-white border border-red-500/30 transition-all duration-300 hover:opacity-95 hover:shadow-[0_0_15px_rgba(239,68,68,0.35)] active:scale-95 flex-1 justify-center flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete File"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
