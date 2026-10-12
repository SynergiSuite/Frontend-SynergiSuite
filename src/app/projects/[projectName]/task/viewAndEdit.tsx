"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Flag,
  LoaderCircle,
  Save,
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
import { TaskAssignee, TaskTeam } from "./schemas/task";
import {
  getPriorityConfig,
  getStatusConfig,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "./task-utils";

export type TaskViewEditPayload = {
  id: string;
  title?: string;
  description?: string;
  due_date?: string;
  dueDate?: string;
  status?: string;
  priority?: string;
  teamId?: string;
  assigneeId?: number;
};

export type TaskViewEditData = {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  status?: string;
  priority?: string;
  assignee?: TaskAssignee | null;
  teams?: (Team | TaskTeam)[];
};

type ViewAndEditProps = {
  data: TaskViewEditData;
  availableTeams?: Team[];
  onCancel: () => void;
  onSave: (payload: TaskViewEditPayload) => Promise<void> | void;
  statusOptions?: string[];
  priorityOptions?: string[];
  canEdit?: boolean;
};

const inputClassName =
  "h-11 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-3.5 text-xs text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-400 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20 disabled:cursor-not-allowed disabled:opacity-60";

const textareaClassName =
  "w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 p-3.5 text-xs text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-400 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20 disabled:cursor-not-allowed disabled:opacity-60 resize-none";

export default function ViewAndEditModal({
  data,
  availableTeams = [],
  onCancel,
  onSave,
  statusOptions = TASK_STATUS_OPTIONS,
  priorityOptions = TASK_PRIORITY_OPTIONS,
  canEdit = true,
}: ViewAndEditProps) {
  const [taskId, setTaskId] = useState(data.id ?? "");
  const [title, setTitle] = useState(data.title ?? "");
  const [description, setDescription] = useState(data.description ?? "");
  const [dueDate, setDueDate] = useState(data.due_date ?? "");
  const [statusValue, setStatusValue] = useState(data.status ?? "todo");
  const [priorityValue, setPriorityValue] = useState(data.priority ?? "medium");
  const [assignmentValue, setAssignmentValue] = useState<string>("unassigned");
  const [isSaving, setIsSaving] = useState(false);

  // Compute available teams list from props or data
  const projectTeams = useMemo(() => {
    return availableTeams.length > 0
      ? availableTeams
      : ((data.teams || []) as Team[]);
  }, [availableTeams, data.teams]);

  // Initial assignment calculation
  useEffect(() => {
    setTaskId(data.id ?? "");
    setTitle(data.title ?? "");
    setDescription(data.description ?? "");
    setDueDate(data.due_date ?? "");
    setStatusValue(data.status ?? "todo");
    setPriorityValue(data.priority ?? "medium");

    if (data.assignee?.user_id && data.teams?.[0]?.id) {
      setAssignmentValue(`member:${data.teams[0].id}:${data.assignee.user_id}`);
    } else if (data.teams?.[0]?.id) {
      setAssignmentValue(`team:${data.teams[0].id}`);
    } else {
      setAssignmentValue("unassigned");
    }
  }, [data]);

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

  const handleSave = async () => {
    if (!isFormValid || isSaving || !canEdit) return;

    try {
      setIsSaving(true);
      await onSave({
        id: taskId,
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: dueDate,
        dueDate: dueDate,
        status: statusValue,
        priority: priorityValue,
        teamId,
        assigneeId,
      });
    } catch (err) {
      console.error("Error saving task:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && !isSaving && onCancel()}>
      <DialogContent
        showCloseButton={!isSaving}
        className="max-h-[92vh] max-w-xl overflow-y-auto border border-v2-neutral-300 bg-v2-neutral-100 p-0 text-v2-neutral-600 shadow-2xl rounded-2xl custom-scrollbar"
      >
        {/* Header */}
        <DialogHeader className="border-b border-v2-neutral-200 px-6 py-5">
          <div className="flex items-start gap-3.5 pr-8">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
              <Edit3 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight text-v2-neutral-600">
                Edit Task
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-5 text-v2-neutral-400">
                Update task specifications, assignment, priority, status, and timeline
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Form */}
        <div className="space-y-4 px-6 py-5">
          {/* Title */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
              Task Name <span className="text-destructive">*</span>
            </FieldLabel>
            <input
              type="text"
              value={title}
              disabled={isSaving || !canEdit}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClassName}
            />
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
              Description
            </FieldLabel>
            <textarea
              rows={3}
              value={description}
              disabled={isSaving || !canEdit}
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
                disabled={isSaving || !canEdit}
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
                disabled={isSaving || !canEdit}
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

          {/* 3-Choice Assignment Selector */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
              Assignee / Squad Allocation
            </FieldLabel>
            <Select
              value={assignmentValue}
              onValueChange={setAssignmentValue}
              disabled={isSaving || !canEdit}
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
                {projectTeams.map((team) => {
                  const membersList = [
                    ...(team.leader ? [team.leader] : []),
                    ...(team.members || []),
                    ...(team.employees || []),
                  ];

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

                      {/* Entire Team Option */}
                      <SelectItem
                        value={`team:${team.id}`}
                        className="cursor-pointer text-xs font-medium text-primary"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="size-3.5" />
                          <span>Entire Team ({team.name})</span>
                        </div>
                      </SelectItem>

                      {/* Individual Member Options */}
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
          </Field>

          {/* Target Due Date */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-v2-neutral-600">
              Target Due Date <span className="text-destructive">*</span>
            </FieldLabel>
            <DatePicker
              value={dueDate}
              onChange={setDueDate}
              disabled={isSaving || !canEdit}
              placeholder="Select target completion date"
            />
          </Field>
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-v2-neutral-200 bg-v2-neutral-200/30 px-6 py-4 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="border-v2-neutral-300 text-v2-neutral-600 hover:bg-v2-neutral-200"
          >
            Cancel
          </Button>
          {canEdit && (
            <Button
              type="button"
              onClick={handleSave}
              disabled={!isFormValid || isSaving}
              className="gap-2 font-semibold shadow-sm min-w-[130px]"
            >
              {isSaving ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
