"use client";

import React, { useState } from "react";
import { AlertTriangle, LoaderCircle, Trash2 } from "lucide-react";

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

type DeleteTaskModalProps = {
  open: boolean;
  taskId: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (taskId: string) => Promise<void> | void;
};

export default function DeleteTaskModal({
  open,
  taskId,
  onOpenChange,
  onConfirm,
}: DeleteTaskModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!taskId || isDeleting) return;
    try {
      setIsDeleting(true);
      await onConfirm?.(taskId);
    } catch (err) {
      console.error("Error deleting task:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (isDeleting) return;
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleCancel()}>
      <DialogContent
        showCloseButton={!isDeleting}
        className="max-w-md border border-v2-neutral-300 bg-v2-neutral-100 p-0 text-v2-neutral-600 shadow-2xl rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="border-b border-v2-neutral-200 px-6 py-5">
          <div className="flex items-start gap-3.5 pr-8">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive shadow-xs">
              <Trash2 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight text-v2-neutral-600">
                Delete Task
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-5 text-v2-neutral-400">
                Permanently remove this task from the project workspace.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="space-y-4 px-6 py-5">
          <Card
            variant="subtle"
            size="sm"
            className="border-rose-200 bg-rose-50/60 text-rose-900"
          >
            <CardContent className="flex items-start gap-3 p-3.5 text-xs leading-relaxed">
              <AlertTriangle className="size-4 shrink-0 text-rose-600 mt-0.5" />
              <span>
                This action cannot be undone. All recorded progress and team assignments for this task will be permanently removed.
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-v2-neutral-200 bg-v2-neutral-200/30 px-6 py-4 flex items-center justify-end gap-3">
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
            className="gap-2 font-semibold shadow-sm min-w-[130px]"
          >
            {isDeleting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete Task
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
