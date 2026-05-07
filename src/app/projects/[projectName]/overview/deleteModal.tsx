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

type DeleteMilestoneModalProps = {
  open: boolean;
  milestoneId: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (milestoneId: string) => void;
};

export default function DeleteMilestoneModal({
  open,
  milestoneId,
  onOpenChange,
  onConfirm,
}: DeleteMilestoneModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this milestone?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone and will permanently remove the
            milestone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            onClick={() => {
              if (milestoneId) {
                onConfirm?.(milestoneId);
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
