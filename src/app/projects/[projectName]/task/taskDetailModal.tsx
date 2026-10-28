"use client";

import React from "react";
import {
  Calendar,
  Edit3,
  Flag,
  Share2,
  User,
  UserX,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Task } from "./schemas/task";
import {
  formatDueDate,
  getPriorityConfig,
  getStatusConfig,
  isDueToday,
  isOverdue,
} from "./task-utils";
import ShareToChatDialog from "@/app/collab-station/components/ShareToChatDialog";
import { isClientRole } from "@/app/collab-station/helpers/mainHelper";

type TaskDetailModalProps = {
  task: Task;
  canEdit: boolean;
  projectId?: string;
  onClose: () => void;
  onEdit: () => void;
};

export default function TaskDetailModal({
  task,
  canEdit,
  projectId,
  onClose,
  onEdit,
}: TaskDetailModalProps) {
  const [isShareOpen, setIsShareOpen] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(isClientRole());
  }, []);

  const statusCfg = getStatusConfig(task.status);
  const priorityCfg = getPriorityConfig(task.priority);
  const overdue = isOverdue(task.due_date, task.status);

  const dueToday = isDueToday(task.due_date);
  const primaryTeam = task.teams && task.teams.length > 0 ? task.teams[0] : null;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton
        className="max-h-[90vh] max-w-2xl overflow-y-auto border border-v2-neutral-300 bg-v2-neutral-100 p-0 text-v2-neutral-600 shadow-2xl rounded-2xl custom-scrollbar"
      >
        {/* Header */}
        <DialogHeader className="border-b border-v2-neutral-200 px-6 py-5">
          <div className="flex flex-wrap items-center gap-2 pr-6">
            {/* Priority flag pill */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border ${priorityCfg.badgeClass}`}
            >
              <Flag className="size-3.5" style={{ color: priorityCfg.flagColor }} />
              <span>{priorityCfg.label}</span>
            </span>

            {/* Status pill */}
            <span
              className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs font-semibold border ${statusCfg.badgeClass}`}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: statusCfg.dotColor }}
              />
              <span>{statusCfg.label}</span>
            </span>
          </div>

          <DialogTitle className="mt-3 text-xl font-bold tracking-tight text-v2-neutral-600">
            {task.title}
          </DialogTitle>
        </DialogHeader>

        {/* Content Body */}
        <div className="space-y-6 px-6 py-5">
          {/* Metadata Grid (ClickUp style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 rounded-xl border border-v2-neutral-300 bg-v2-neutral-200/40 p-4 text-xs">
            {/* Due Date */}
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg bg-v2-neutral-200 text-v2-neutral-500 shrink-0">
                <Calendar className="size-4" />
              </span>
              <div>
                <span className="block text-[11px] text-v2-neutral-400 font-medium">
                  Due Date
                </span>
                <span
                  className={`font-semibold ${
                    overdue
                      ? "text-rose-600"
                      : dueToday
                      ? "text-amber-600"
                      : "text-v2-neutral-600"
                  }`}
                >
                  {formatDueDate(task.due_date)}
                  {overdue && " (Overdue)"}
                  {dueToday && " (Due Today)"}
                </span>
              </div>
            </div>

            {/* Assignment Display */}
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg bg-v2-neutral-200 text-v2-neutral-500 shrink-0">
                {task.assignee ? (
                  <User className="size-4" />
                ) : primaryTeam ? (
                  <Users className="size-4" />
                ) : (
                  <UserX className="size-4" />
                )}
              </span>
              <div className="min-w-0">
                <span className="block text-[11px] text-v2-neutral-400 font-medium">
                  {task.assignee ? "Assigned Employee" : "Assigned Squad"}
                </span>
                {task.assignee ? (
                  <div>
                    <span className="font-semibold text-v2-neutral-600 truncate block">
                      {task.assignee.name}
                    </span>
                    <span className="text-[11px] text-v2-neutral-400 truncate block">
                      {task.assignee.email} {primaryTeam ? `• ${primaryTeam.name}` : ""}
                    </span>
                  </div>
                ) : primaryTeam ? (
                  <span className="font-semibold text-v2-neutral-600 truncate block">
                    {primaryTeam.name} (Entire Team)
                  </span>
                ) : (
                  <span className="font-medium text-v2-neutral-400">
                    Unassigned
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-v2-neutral-400 mb-2">
              Description
            </h4>
            <div className="rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 p-4 text-xs leading-relaxed text-v2-neutral-600 min-h-[100px]">
              {task.description ? (
                <p className="whitespace-pre-wrap">{task.description}</p>
              ) : (
                <span className="text-v2-neutral-400 italic">
                  No description provided for this task.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="border-t border-v2-neutral-200 bg-v2-neutral-200/30 px-6 py-4 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-v2-neutral-300 text-v2-neutral-600 hover:bg-v2-neutral-200"
          >
            Close
          </Button>

          {!isClient && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsShareOpen(true)}
              className="gap-2 border-v2-neutral-300 text-v2-neutral-600 hover:bg-v2-neutral-200"
            >
              <Share2 className="size-4" />
              Share
            </Button>
          )}

          {canEdit && (
            <Button
              type="button"
              onClick={onEdit}
              className="gap-2 font-semibold shadow-sm"
            >
              <Edit3 className="size-4" />
              Edit Task
            </Button>
          )}
        </DialogFooter>
      </DialogContent>

      {isShareOpen && (
        <ShareToChatDialog
          open={isShareOpen}
          onOpenChange={setIsShareOpen}
          entityType="task"
          entityId={task.id}
          projectId={
            projectId ||
            (task as unknown as { projectId?: string; project_id?: string }).projectId ||
            (task as unknown as { projectId?: string; project_id?: string }).project_id
          }
          itemTitle={task.title}
        />
      )}
    </Dialog>
  );
}
