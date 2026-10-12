"use client";

import React, { useState } from "react";
import { AlertTriangle, LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteProjectApi } from "./apis/deleteProject";
import type { Projects } from "./schemas/project";

type DeleteProjectModalProps = {
  open: boolean;
  project: Projects | null;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function DeleteProjectModal({
  open,
  project,
  onCancel,
  onSuccess,
}: DeleteProjectModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!project || isDeleting) return;
    try {
      setIsDeleting(true);
      await deleteProjectApi(project.id);
      toast.success(`Project "${project.name}" deleted successfully.`);
      onSuccess();
      onCancel();
    } catch (error) {
      console.error("Failed to delete project:", error);
      const message =
        error instanceof Error ? error.message : "Failed to delete project";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && !isDeleting && onCancel()}>
      <DialogContent className="max-w-md border-v2-neutral-300 bg-v2-neutral-100 p-6 text-v2-neutral-600 shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </span>
          <DialogTitle className="text-lg font-bold tracking-tight text-v2-neutral-600">
            Delete Project
          </DialogTitle>
          <DialogDescription className="text-xs text-v2-neutral-400 max-w-sm">
            Are you sure you want to delete <span className="font-semibold text-v2-neutral-600">&ldquo;{project.name}&rdquo;</span>? All related tasks, deliverables, and timeline history will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex items-center justify-center gap-3 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
            className="border-v2-neutral-300 text-v2-neutral-600 hover:bg-v2-neutral-200"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="gap-2 font-semibold shadow-md"
          >
            {isDeleting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
