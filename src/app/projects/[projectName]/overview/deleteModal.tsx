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
      <AlertDialogContent className="bg-[#0a0826]/95 border border-white/[0.08] backdrop-blur-md rounded-2xl shadow-2xl shadow-rose-500/5 text-white max-w-md p-6 relative overflow-hidden">
        {/* Top Danger Line Accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-rose-500" />
        
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-white tracking-tight">
            Delete this milestone?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-white/50 leading-relaxed font-medium">
            This action cannot be undone and will permanently remove the milestone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="mt-5 gap-2">
          <AlertDialogCancel className="cursor-pointer px-4 py-2 text-xs font-semibold text-white/70 hover:text-white bg-white/[0.02] border border-white/[0.08] rounded-xl hover:bg-white/[0.05] transition-all duration-200">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:scale-[1.02] transition-all duration-200"
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

