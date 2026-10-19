"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type DeleteClientModalProps = {
  open: boolean;
  clientId: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (clientId: string) => void;
};

export default function DeleteClientModal({
  open,
  clientId,
  onOpenChange,
  onConfirm,
}: DeleteClientModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-v2-neutral-600/75 backdrop-blur-xs"
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-v2-neutral-400 bg-v2-neutral-600 shadow-2xl p-6 text-center"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/25 text-rose-400 mb-4">
              <AlertTriangle className="size-6" />
            </div>

            <h3 className="text-base font-semibold text-v2-neutral-100">
              Delete Client Account?
            </h3>
            <p className="mt-2 text-xs leading-5 text-v2-neutral-300">
              Are you sure you want to remove this client profile? All associated records, active contracts, and linked billing data will be permanently removed.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  if (clientId) {
                    onConfirm?.(clientId);
                  }
                }}
              >
                Delete Client
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
