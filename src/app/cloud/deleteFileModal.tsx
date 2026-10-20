"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, LoaderCircle, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-v2-neutral-600/75 backdrop-blur-xs"
            onClick={() => !isDeleting && onOpenChange(false)}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-v2-neutral-400 bg-v2-neutral-600 shadow-2xl overflow-hidden p-6 text-center"
          >
            {/* Warning Icon */}
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 shadow-sm mb-4">
              <AlertTriangle className="size-6" />
            </div>

            <h3 className="text-base font-semibold text-v2-neutral-100">
              Delete Cloud Asset?
            </h3>
            <p className="mt-2 text-xs text-v2-neutral-400 leading-relaxed max-w-xs mx-auto">
              This action cannot be undone. The file and its access permissions will be permanently removed from cloud storage and the database.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isDeleting}
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white border-0 gap-1.5 shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <LoaderCircle className="size-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash className="size-3.5" />
                    <span>Delete File</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
