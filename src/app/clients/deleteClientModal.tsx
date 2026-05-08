"use client";

import React from "react";
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this client?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone and will permanently remove the
            client and its corresponding data. This action can not be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            onClick={() => {
              if (clientId) {
                onConfirm?.(clientId);
              }
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
