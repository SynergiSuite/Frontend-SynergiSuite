"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  AlertTriangle,
  Calendar,
  Flag,
  Layers,
  LoaderCircle,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Milestone } from "../schemas/milestone";

type DeleteMilestoneModalProps = {
  open: boolean;
  milestoneId: string | null;
  milestone?: Milestone | null;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (milestoneId: string) => Promise<void> | void;
};

export default function DeleteMilestoneModal({
  open,
  milestoneId,
  milestone,
  onOpenChange,
  onConfirm,
}: DeleteMilestoneModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // GSAP entrance animation
  useLayoutEffect(() => {
    if (!open || !contentRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-delete-modal-section]",
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.28,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    }, contentRef);

    return () => ctx.revert();
  }, [open]);

  const handleDelete = async () => {
    if (!milestoneId || isDeleting) return;
    try {
      setIsDeleting(true);
      await onConfirm?.(milestoneId);
    } catch (err) {
      console.error("Error confirming milestone deletion:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (isDeleting) return;
    onOpenChange(false);
  };

  const milestoneName = milestone?.name || "this milestone";
  const tasksCount = milestone?.tasks?.length || 0;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleCancel()}>
      <DialogContent
        ref={contentRef}
        showCloseButton={!isDeleting}
        className="max-w-md border border-v2-neutral-300 bg-v2-neutral-100 p-0 text-v2-neutral-600 shadow-2xl rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <DialogHeader
          data-delete-modal-section
          className="border-b border-v2-neutral-200 px-6 py-5"
        >
          <div className="flex items-start gap-3.5 pr-8">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive shadow-xs">
              <Trash2 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight text-v2-neutral-600">
                Delete Milestone
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-5 text-v2-neutral-400">
                Permanently remove this roadmap milestone from the project lifecycle.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="space-y-4 px-6 py-5">
          {/* Milestone Details Card */}
          <div
            data-delete-modal-section
            className="rounded-xl border border-v2-neutral-300 bg-v2-neutral-200/40 p-4 space-y-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="grid size-7 place-items-center rounded-lg bg-v2-neutral-200 text-v2-neutral-600 shrink-0">
                <Flag className="size-3.5" />
              </span>
              <span className="text-sm font-semibold text-v2-neutral-600 truncate">
                {milestoneName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-v2-neutral-300/60 text-xs">
              <div className="flex items-center gap-1.5 text-v2-neutral-500">
                <Calendar className="size-3.5 text-v2-neutral-400 shrink-0" />
                <span className="truncate">
                  {milestone?.end_date
                    ? new Date(milestone.end_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No target date"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-v2-neutral-500">
                <Layers className="size-3.5 text-v2-neutral-400 shrink-0" />
                <span>
                  {tasksCount} {tasksCount === 1 ? "deliverable" : "deliverables"}
                </span>
              </div>
            </div>
          </div>

          {/* Safety Reassurance Notice */}
          <Card
            data-delete-modal-section
            variant="subtle"
            size="sm"
            className="border-amber-200 bg-amber-50/60 text-amber-900"
          >
            <CardContent className="flex items-start gap-3 p-3.5 text-xs leading-relaxed">
              <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Linked tasks will <strong>not be deleted</strong>. They will safely remain in the project backlog for reallocation.
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <DialogFooter
          data-delete-modal-section
          className="border-t border-v2-neutral-200 bg-v2-neutral-200/30 px-6 py-4 flex items-center justify-end gap-3"
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
            className="border-v2-neutral-300 text-v2-neutral-600 hover:bg-v2-neutral-200"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2 font-semibold shadow-sm min-w-[145px]"
          >
            {isDeleting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete Milestone
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
