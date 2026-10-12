"use client";

import React, { useMemo, useState } from "react";
import {
  CheckSquare,
  Flag,
  Layers,
  LoaderCircle,
  Plus,
  User,
  UserX,
  Users,
} from "lucide-react";

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
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "@/components/ui/datePicker";
import { Team } from "@/app/projects/schemas/team";
import {
  getPriorityConfig,
  getStatusConfig,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "./task-utils";

export type NewTaskPayload = {
  projectId: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  due_date?: string;
  milestoneId?: string;
  teamId?: string;
  assigneeId?: number;
};

interface NewTaskModalProps {
  onCancel: () => void;
  onSubmit: (data: NewTaskPayload) => Promise<void> | void;
  assignees: Team[];
  milestones?: { id: string; name: string }[];
  projectName: string;
  projectId?: string;
  initialStatus?: string;
  statusOptions?: string[];
  priorityOptions?: string[];
}

const inputClassName =
  "h-11 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3.5 text-xs text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-400 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20 disabled:cursor-not-allowed disabled:opacity-60";

const textareaClassName =
  "w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 p-3.5 text-xs text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-400 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20 disabled:cursor-not-allowed disabled:opacity-60 resize-none";

export default function NewTaskModal({
  onCancel,
  onSubmit,
  assignees: teams = [],
  milestones = [],
  projectId = "",
  initialStatus = "todo",
  statusOptions = TASK_STATUS_OPTIONS,
  priorityOptions = TASK_PRIORITY_OPTIONS,
}: NewTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusValue, setStatusValue] = useState(initialStatus || "todo");
  const [priorityValue, setPriorityValue] = useState("medium");
  const [assignmentValue, setAssignmentValue] = useState<string>("unassigned");
  const [dueDate, setDueDate] = useState("");
  const [milestoneId, setMilestoneId] = useState("none");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse assignment selection into teamId & assigneeId
  const { teamId, assigneeId } = useMemo(() => {
    if (!assignmentValue || assignmentValue === "unassigned") {
      return { teamId: undefined, assigneeId: undefined };
    }
    if (assignmentValue.startsWith("team:")) {
      return { teamId: assignmentValue.slice(5), assigneeId: undefined };
    }
    if (assignmentValue.startsWith("member:")) {
      const parts = assignmentValue.split(":");
      return { teamId: parts[1], assigneeId: Number(parts[2]) };
    }
    return { teamId: undefined, assigneeId: undefined };
  }, [assignmentValue]);

  const isFormValid = title.trim().length >= 3 && dueDate !== "";

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        projectId,
        title: title.trim(),
        description: description.trim() || undefined,
        status: statusValue,
        priority: priorityValue,
        dueDate,
        due_date: dueDate,
        teamId,
        assigneeId,
        milestoneId: milestoneId && milestoneId !== "none" ? milestoneId : undefined,
      });
    } catch (err) {
      console.error("Error submitting task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && !isSubmitting && onCancel()}>
      <DialogContent
        showCloseButton={!isSubmitting}
        className="max-h-[92vh] max-w-xl overflow-y-auto border border-v2-neutral-300 bg-v2-neutral-100 p-0 text-v2-neutral-600 shadow-2xl rounded-2xl custom-scrollbar"
      >
        {/* Header */}
        <DialogHeader className="border-b border-v2-neutral-200 px-6 py-5">
          <div className="flex items-start gap-3.5 pr-8">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
              <CheckSquare className="size-5" aria-hidden="true" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight text-v2-neutral-600">
                Create New Task
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-5 text-v2-neutral-400">
                Assign a task to an employee, an entire squad, or leave unassigned
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Form */}
        <div className="space-y-4 px-6 py-5">
          {/* Task Title */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
              Task Name <span className="text-destructive">*</span>
            </FieldLabel>
            <input
              type="text"
              placeholder="e.g. Implement user authentication flows"
              value={title}
              disabled={isSubmitting}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClassName}
            />
            {title.trim().length > 0 && title.trim().length < 3 && (
              <FieldDescription className="text-[11px] text-destructive mt-1">
                Title must be at least 3 characters.
              </FieldDescription>
            )}
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
              Description
            </FieldLabel>
            <textarea
              rows={3}
              placeholder="Provide context, acceptance criteria, or design specifications..."
              value={description}
              disabled={isSubmitting}
              onChange={(e) => setDescription(e.target.value)}
              className={textareaClassName}
            />
          </Field>

          {/* Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
                Status <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={statusValue}
                onValueChange={setStatusValue}
                disabled={isSubmitting}
              >
                <SelectTrigger className={inputClassName}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl rounded-xl">
                  {statusOptions.map((opt) => {
                    const cfg = getStatusConfig(opt);
                    return (
                      <SelectItem key={opt} value={opt} className="cursor-pointer text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: cfg.dotColor }}
                          />
                          <span>{cfg.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
                Priority <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={priorityValue}
                onValueChange={setPriorityValue}
                disabled={isSubmitting}
              >
                <SelectTrigger className={inputClassName}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl rounded-xl">
                  {priorityOptions.map((opt) => {
                    const cfg = getPriorityConfig(opt);
                    return (
                      <SelectItem key={opt} value={opt} className="cursor-pointer text-xs">
                        <div className="flex items-center gap-2">
                          <Flag className="size-3" style={{ color: cfg.flagColor }} />
                          <span>{cfg.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* 3-Choice Assignment Selector: Employee, Entire Team, or Unassigned */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
              Assignee / Squad Allocation
            </FieldLabel>
            <Select
              value={assignmentValue}
              onValueChange={setAssignmentValue}
              disabled={isSubmitting}
            >
              <SelectTrigger className={inputClassName}>
                <SelectValue placeholder="Select assignment" />
              </SelectTrigger>
              <SelectContent className="max-h-72 border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl rounded-xl">
                {/* Unassigned Option */}
                <SelectItem value="unassigned" className="cursor-pointer text-xs font-medium">
                  <div className="flex items-center gap-2 text-v2-neutral-400">
                    <UserX className="size-3.5" />
                    <span>Unassigned</span>
                  </div>
                </SelectItem>

                {/* Team & Member Options Grouped by Team */}
                {teams.map((team) => {
                  const membersList = [
                    ...(team.leader ? [team.leader] : []),
                    ...(team.members || []),
                    ...(team.employees || []),
                  ];

                  // Deduplicate members by user_id
                  const uniqueMembers = membersList.filter(
                    (m, idx, self) =>
                      Boolean(m.user_id) &&
                      idx === self.findIndex((o) => o.user_id === m.user_id)
                  );

                  return (
                    <SelectGroup key={team.id} className="border-t border-v2-neutral-200/80 pt-1 mt-1">
                      <SelectLabel className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-v2-neutral-400">
                        {team.name}
                      </SelectLabel>

                      {/* Option 2: Entire Team */}
                      <SelectItem
                        value={`team:${team.id}`}
                        className="cursor-pointer text-xs font-medium text-primary"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="size-3.5" />
                          <span>Entire Team ({team.name})</span>
                        </div>
                      </SelectItem>

                      {/* Option 3: Specific Employee */}
                      {uniqueMembers.map((member) => (
                        <SelectItem
                          key={`${team.id}-${member.user_id}`}
                          value={`member:${team.id}:${member.user_id}`}
                          className="cursor-pointer text-xs pl-6"
                        >
                          <div className="flex items-center gap-2">
                            <User className="size-3 text-v2-neutral-400" />
                            <span className="font-medium text-v2-neutral-600">
                              {member.name}
                            </span>
                            <span className="text-[10px] text-v2-neutral-400">
                              ({team.name})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  );
                })}
              </SelectContent>
            </Select>
            <FieldDescription className="text-[11px] text-v2-neutral-400 mt-1">
              Select a specific employee, assign to an entire team, or keep unassigned.
            </FieldDescription>
          </Field>

          {/* Roadmap Milestone Selection & Target Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
                Roadmap Milestone
              </FieldLabel>
              <Select
                value={milestoneId}
                onValueChange={setMilestoneId}
                disabled={isSubmitting}
              >
                <SelectTrigger className={inputClassName}>
                  <SelectValue placeholder="Optional milestone" />
                </SelectTrigger>
                <SelectContent className="border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl rounded-xl">
                  <SelectItem value="none" className="cursor-pointer text-xs">
                    No milestone linked
                  </SelectItem>
                  {milestones.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="cursor-pointer text-xs">
                      <div className="flex items-center gap-2">
                        <Layers className="size-3.5 text-v2-neutral-500" />
                        <span>{m.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
                Target Due Date <span className="text-destructive">*</span>
              </FieldLabel>
              <DatePicker
                value={dueDate}
                onChange={setDueDate}
                disabled={isSubmitting}
                placeholder="Select date"
              />
            </Field>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-v2-neutral-200 bg-v2-neutral-200/30 px-6 py-4 flex items-center justify-end gap-3">
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
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="gap-2 font-semibold shadow-sm min-w-[135px]"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Create Task
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
