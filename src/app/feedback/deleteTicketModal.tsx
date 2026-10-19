"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteFeedbackApi } from "./apis/deleteFeedbackApi";

interface DeleteTicketModalProps {
  open: boolean;
  ticketId: string | number | null;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export default function DeleteTicketModal({
  open,
  ticketId,
  onOpenChange,
  onDeleted,
}: DeleteTicketModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!ticketId) return;

    try {
      setIsDeleting(true);
      await deleteFeedbackApi(ticketId);
      toast.success("Client ticket deleted successfully.");
      onOpenChange(false);
      onDeleted();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete ticket";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md border-v2-neutral-400 bg-v2-neutral-600 text-v2-neutral-100">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <AlertDialogTitle className="text-base font-semibold text-v2-neutral-100">
                Delete Client Ticket
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-v2-neutral-300 mt-1">
                Are you sure you want to delete this ticket? This action removes all client notes, ratings, and threaded replies permanently.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2 border-t border-v2-neutral-500 pt-4">
          <AlertDialogCancel
            disabled={isDeleting}
            className="border-v2-neutral-400 bg-transparent text-v2-neutral-200 hover:bg-v2-neutral-500 hover:text-v2-neutral-100"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-rose-600 text-white hover:bg-rose-700"
          >
            {isDeleting ? "Deleting..." : "Delete Ticket"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
