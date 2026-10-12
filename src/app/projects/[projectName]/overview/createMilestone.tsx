"use client";

import React, { useState } from "react";
import { Flag, LoaderCircle, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "@/components/ui/datePicker";
import { Project } from "../schemas/project";

export type NewMilestonePayload = {
  name: string;
  endDate: string;
  taskIds: string[];
  projectId?: string;
  projectName?: string;
};

type CreateMilestoneModalProps = {
  onCancel: () => void;
  onSubmit: (data: NewMilestonePayload) => Promise<void> | void;
  projectName?: string;
  projectDetail?: Project;
};

const inputClassName =
  "h-11 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3.5 text-xs text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-400 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20 disabled:cursor-not-allowed disabled:opacity-60";

export default function CreateMilestoneModal({
  onCancel,
  onSubmit,
  projectName,
  projectDetail,
}: CreateMilestoneModalProps) {
  const [name, setName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [taskIds, setTaskIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const projectId = projectDetail?.id;

  const availableTasks = projectDetail?.tasks ?? [];
  const taskTitle = (task: { title?: string; name?: string }) =>
    task?.title || task?.name || "Untitled task";

  const addItem = () => {
    if (!selectedTaskId) return;
    setTaskIds((prev) =>
      prev.includes(selectedTaskId) ? prev : [...prev, selectedTaskId]
    );
    setSelectedTaskId("");
  };

  const removeItem = (index: number) => {
    setTaskIds((prev) => prev.filter((_, i) => i !== index));
  };

  const isFormValid =
    name.trim().length > 0 && endDate !== "" && Boolean(projectId);

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await onSubmit({
        name: name.trim(),
        endDate,
        taskIds,
        projectId,
        projectName: projectName || undefined,
      });
    } catch (err) {
      console.error("Error creating milestone:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && !isSubmitting && onCancel()}>
      <DialogContent
        showCloseButton
        className="max-w-lg border border-v2-neutral-300 bg-v2-neutral-100 p-0 shadow-2xl rounded-2xl"
      >
        <DialogHeader className="border-b border-v2-neutral-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-v2-neutral-200 text-v2-neutral-600">
              <Flag className="size-5" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold text-v2-neutral-600">
                Create Milestone
              </DialogTitle>
              <DialogDescription className="text-xs text-v2-neutral-400 mt-0.5">
                Establish a milestone target for {projectName || "this project"}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4 max-h-[calc(85vh-160px)] overflow-y-auto v2-scrollbar">
          <FieldGroup className="gap-4">
            {/* Milestone Title */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
                Milestone Title <span className="text-destructive">*</span>
              </FieldLabel>
              <input
                type="text"
                disabled={isSubmitting}
                placeholder="e.g., MVP Core Architecture Launch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClassName}
              />
            </Field>

            {/* Target End Date */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
                Target Delivery Date <span className="text-destructive">*</span>
              </FieldLabel>
              <DatePicker
                value={endDate}
                disabled={isSubmitting}
                onChange={setEndDate}
                placeholder="Choose milestone target date"
              />
              <FieldDescription className="text-[11px] text-v2-neutral-400">
                The target deadline when all milestone deliverables must be complete.
              </FieldDescription>
            </Field>

            {/* Link Tasks */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
                Associated Tasks (Optional)
              </FieldLabel>
              <div className="flex gap-2">
                <Select
                  value={selectedTaskId}
                  onValueChange={setSelectedTaskId}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="flex-1 h-11 border-v2-neutral-300 bg-v2-neutral-100 text-xs text-v2-neutral-600 rounded-xl">
                    <SelectValue placeholder="Select a task to link" />
                  </SelectTrigger>
                  <SelectContent className="border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-600">
                    {availableTasks.length > 0 ? (
                      availableTasks.map((task) => (
                        <SelectItem
                          key={String(task.id)}
                          value={String(task.id)}
                          className="text-xs"
                        >
                          {taskTitle(task)}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-tasks" disabled className="text-xs text-v2-neutral-400">
                        No tasks in backlog
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  disabled={availableTasks.length === 0 || !selectedTaskId || isSubmitting}
                  className="h-11 px-3.5 border-v2-neutral-300 text-xs font-semibold text-v2-neutral-600 hover:bg-v2-neutral-200"
                >
                  <Plus className="size-3.5 mr-1" />
                  Add
                </Button>
              </div>

              {taskIds.length > 0 && (
                <div className="mt-2.5 max-h-36 overflow-y-auto space-y-1.5 v2-scrollbar">
                  {taskIds.map((taskId, idx) => {
                    const task = availableTasks.find((t) => t.id === taskId);
                    return (
                      <div
                        key={`${taskId}-${idx}`}
                        className="flex items-center justify-between rounded-lg border border-v2-neutral-200 bg-v2-neutral-200/50 px-3 py-2 text-xs"
                      >
                        <span className="font-medium text-v2-neutral-600 truncate max-w-[280px]">
                          {task ? taskTitle(task) : "Task"}
                        </span>
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => removeItem(idx)}
                          className="text-destructive hover:underline text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 className="size-3" />
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Field>
          </FieldGroup>
        </div>

        <DialogFooter className="border-t border-v2-neutral-200 bg-v2-neutral-200/30 px-6 py-4 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onCancel}
            className="border-v2-neutral-300 text-v2-neutral-600 hover:bg-v2-neutral-200"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            disabled={!isFormValid || isSubmitting}
            onClick={handleSubmit}
            className="gap-2 bg-v2-neutral-600 text-v2-neutral-100 hover:bg-v2-neutral-500 font-semibold shadow-sm min-w-[155px]"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Creating milestone...
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Create Milestone
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
