"use client";

import React, { useEffect, useState } from "react";
import { Edit3, LoaderCircle, Plus, Trash2 } from "lucide-react";

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
import { Task } from "../task/schemas/task";
import { MilestoneUpdate } from "../schemas/milestone";

type MilestoneEditModalProps = {
  onCancel: () => void;
  onSubmit: (data: MilestoneUpdate) => void;
  milestoneId: string;
  initialName?: string;
  initialEndDate?: string;
  initialTaskIds?: string[];
  availableTasks: Task[];
  isSubmitting?: boolean;
  title?: string;
};

const inputClassName =
  "h-11 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3.5 text-xs text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-400 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20";

export default function MilestoneEditModal({
  onCancel,
  onSubmit,
  milestoneId,
  initialName = "",
  initialEndDate = "",
  initialTaskIds = [],
  availableTasks,
  isSubmitting = false,
  title = "Edit Milestone",
}: MilestoneEditModalProps) {
  const [name, setName] = useState(initialName);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [taskIds, setTaskIds] = useState<string[]>(initialTaskIds);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  useEffect(() => {
    setEndDate(initialEndDate);
  }, [initialEndDate]);

  useEffect(() => {
    setTaskIds(initialTaskIds);
  }, [initialTaskIds]);

  const taskTitle = (task: Task) => task.title || "Untitled task";

  const addTask = () => {
    if (!selectedTaskId) return;
    setTaskIds((prev) =>
      prev.includes(selectedTaskId) ? prev : [...prev, selectedTaskId]
    );
    setSelectedTaskId("");
  };

  const removeTask = (index: number) => {
    setTaskIds((prev) => prev.filter((_, taskIndex) => taskIndex !== index));
  };

  const isFormValid = name.trim().length > 0 && endDate !== "";

  return (
    <Dialog open onOpenChange={(open) => !open && !isSubmitting && onCancel()}>
      <DialogContent
        showCloseButton
        className="max-w-lg border border-v2-neutral-300 bg-v2-neutral-100 p-0 shadow-2xl rounded-2xl"
      >
        <DialogHeader className="border-b border-v2-neutral-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-v2-neutral-200 text-v2-neutral-600">
              <Edit3 className="size-5" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold text-v2-neutral-600">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-v2-neutral-400 mt-0.5">
                Update milestone roadmap target and deliverable bindings.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4 max-h-[calc(85vh-160px)] overflow-y-auto v2-scrollbar">
          <FieldGroup className="gap-4">
            {/* Name */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
                Milestone Title <span className="text-destructive">*</span>
              </FieldLabel>
              <input
                type="text"
                placeholder="Enter milestone title"
                disabled={isSubmitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClassName}
              />
            </Field>

            {/* End date */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
                Target End Date <span className="text-destructive">*</span>
              </FieldLabel>
              <DatePicker
                value={endDate}
                disabled={isSubmitting}
                onChange={setEndDate}
                placeholder="Choose milestone target date"
              />
              <FieldDescription className="text-[11px] text-v2-neutral-400">
                Target delivery deadline date.
              </FieldDescription>
            </Field>

            {/* Link Tasks */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
                Associated Tasks
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
                        <SelectItem key={task.id} value={task.id} className="text-xs">
                          {taskTitle(task)}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-tasks" disabled className="text-xs text-v2-neutral-400">
                        No tasks available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTask}
                  disabled={
                    availableTasks.length === 0 ||
                    !selectedTaskId ||
                    isSubmitting
                  }
                  className="h-11 px-3.5 border-v2-neutral-300 text-xs font-semibold text-v2-neutral-600 hover:bg-v2-neutral-200"
                >
                  <Plus className="size-3.5 mr-1" />
                  Add
                </Button>
              </div>

              {taskIds.length > 0 && (
                <div className="mt-2.5 max-h-36 overflow-y-auto space-y-1.5 v2-scrollbar">
                  {taskIds.map((taskId, index) => {
                    const task = availableTasks.find((item) => item.id === taskId);
                    return (
                      <div
                        key={`${taskId}-${index}`}
                        className="flex items-center justify-between rounded-lg border border-v2-neutral-200 bg-v2-neutral-200/50 px-3 py-2 text-xs"
                      >
                        <span className="font-medium text-v2-neutral-600 truncate max-w-[280px]">
                          {task ? taskTitle(task) : "Task"}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeTask(index)}
                          disabled={isSubmitting}
                          className="text-destructive hover:underline text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
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

        <DialogFooter className="border-t border-v2-neutral-200 bg-v2-neutral-200/30 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="border-v2-neutral-300 text-v2-neutral-600 hover:bg-v2-neutral-200"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            disabled={!isFormValid || isSubmitting}
            onClick={() => {
              if (!isFormValid || isSubmitting) return;
              onSubmit({
                id: milestoneId,
                name: name.trim(),
                end_date: endDate,
                taskIds,
              });
            }}
            className="gap-2 bg-v2-neutral-600 text-v2-neutral-100 hover:bg-v2-neutral-500 font-semibold shadow-sm min-w-[145px]"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Saving changes...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
