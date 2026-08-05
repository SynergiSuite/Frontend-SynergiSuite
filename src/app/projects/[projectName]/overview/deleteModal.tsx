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
      <AlertDialogContent className="bg-[#0a0826]/95 border border-white/[0.08] backdrop-blur-md rounded-2xl shadow-2xl shadow-rose-500/5 text-white max-w-md p-6 overflow-hidden">
        {/* Top Danger Line Accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-rose-500" />
        
        <AlertDialogHeader className="border-b-0 p-0 text-left sm:text-left flex flex-col gap-1.5">
          <AlertDialogTitle className="text-lg font-bold text-white tracking-tight">
            Delete this milestone?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-white/50 leading-relaxed font-medium">
            This action cannot be undone and will permanently remove the milestone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="border-t-0 p-0 mt-6 gap-2 flex flex-row justify-end items-center">
          <AlertDialogCancel className="cursor-pointer px-4 py-2 text-xs font-semibold text-white/70 hover:text-white bg-white/[0.02] border border-white/[0.08] rounded-xl hover:bg-white/[0.05] transition-all duration-200 h-auto">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 border border-rose-500/30 rounded-xl hover:shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:scale-[1.02] transition-all duration-200 h-auto"
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

