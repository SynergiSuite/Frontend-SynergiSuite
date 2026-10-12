"use client";

import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Flag,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DeleteMilestone } from "../apis/deleteMilestone";
import { UpdateMilestone } from "../apis/updateMilestone";
import { Milestone, MilestoneUpdate } from "../schemas/milestone";
import { Task } from "../task/schemas/task";
import DeleteMilestoneModal from "./deleteModal";
import MilestoneEditModal from "./milestoneEditModal";

type MilestonesProps = {
  milestones: Milestone[];
  availableTasks: Task[];
  canManageMilestones: boolean;
  onRefresh?: () => Promise<void> | void;
};

const getMonthsRemaining = (dateValue: string) => {
  const endDate = new Date(dateValue);
  if (Number.isNaN(endDate.getTime())) {
    return null;
  }

  const now = new Date();
  let months =
    (endDate.getFullYear() - now.getFullYear()) * 12 +
    (endDate.getMonth() - now.getMonth());

  if (endDate.getDate() < now.getDate()) {
    months -= 1;
  }

  return Math.max(0, months);
};

export default function Milestones({
  milestones,
  availableTasks,
  canManageMilestones,
  onRefresh,
}: MilestonesProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(
    null
  );
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [deleteMilestoneId, setDeleteMilestoneId] = useState<string | null>(
    null
  );

  const openEditModal = (milestone: Milestone) => {
    if (!canManageMilestones) return;
    setActiveMilestone(milestone);
    setIsEditOpen(true);
  };

  const handleClose = () => {
    setIsEditOpen(false);
    setActiveMilestone(null);
  };

  const handleSubmit = async (payload: MilestoneUpdate) => {
    if (!canManageMilestones) {
      toast.error("You do not have permission to edit milestones.");
      return;
    }

    try {
      setIsSubmittingEdit(true);
      await UpdateMilestone(payload);
      await onRefresh?.();
      toast.success("Milestone updated successfully.");
      setIsEditOpen(false);
      setActiveMilestone(null);
    } catch (error) {
      console.error("Error updating milestone:", error);
      toast.error("Unable to update milestone.");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteConfirm = async (milestoneId: string) => {
    if (!canManageMilestones) {
      toast.error("You do not have permission to delete milestones.");
      return;
    }

    setDeleteMilestoneId(null);
    setActiveMilestone(null);
    try {
      await DeleteMilestone(milestoneId);
      await onRefresh?.();
      toast.success("Milestone deleted successfully.");
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast.error("Unable to delete milestone.");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border border-v2-neutral-300 bg-v2-neutral-100 shadow-sm">
        <CardHeader className="pb-3 border-b border-v2-neutral-200/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-lg bg-v2-neutral-200 text-v2-neutral-600">
                <Flag className="size-3.5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-v2-neutral-600">
                  Roadmap & Milestones
                </h3>
              </div>
            </div>
            <span className="rounded-full bg-v2-neutral-200 px-2.5 py-0.5 text-xs font-semibold text-v2-neutral-600">
              {milestones.length}{" "}
              {milestones.length === 1 ? "Target" : "Targets"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {milestones.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-v2-neutral-300 bg-v2-neutral-200/30">
              <span className="grid size-11 place-items-center rounded-xl bg-v2-neutral-200 text-v2-neutral-500 mb-3">
                <Flag className="size-5" />
              </span>
              <h4 className="text-sm font-semibold text-v2-neutral-600">
                No roadmap milestones yet
              </h4>
              <p className="text-xs text-v2-neutral-400 max-w-sm mt-1">
                Establish milestones to group deliverables, track release targets, and measure execution progress.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone) => {
                const totalTasks = milestone.tasks?.length || 0;
                const completedTasks =
                  milestone.tasks?.filter((t) => t.status === "completed")
                    .length || 0;
                const progress =
                  totalTasks > 0
                    ? Math.round((completedTasks / totalTasks) * 100)
                    : 0;
                const monthsRemaining = getMonthsRemaining(
                  milestone.end_date
                );

                return (
                  <div
                    key={milestone.id}
                    className="group relative flex flex-col justify-between rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 p-4.5 shadow-sm transition-all hover:border-v2-neutral-400 space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-v2-neutral-200 text-v2-neutral-600 mt-0.5">
                          <Flag className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2.5">
                            <h4 className="text-base font-semibold text-v2-neutral-600 line-clamp-1">
                              {milestone.name}
                            </h4>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-v2-neutral-400">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-v2-neutral-200 px-2.5 py-0.5 text-[11px] font-medium text-v2-neutral-600">
                              <Calendar className="size-3 text-v2-neutral-500" />
                              {milestone.end_date
                                ? new Date(
                                    milestone.end_date
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "No target date"}
                            </span>

                            {monthsRemaining !== null && (
                              <span className="text-[11px] text-v2-neutral-400">
                                • {monthsRemaining} month
                                {monthsRemaining === 1 ? "" : "s"} remaining
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {canManageMilestones && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            aria-label="Edit milestone"
                            onClick={() => openEditModal(milestone)}
                            className="inline-flex size-7 items-center justify-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-500 hover:bg-v2-neutral-200 hover:text-v2-neutral-600 transition-colors"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Delete milestone"
                            onClick={() =>
                              setDeleteMilestoneId(milestone.id)
                            }
                            className="inline-flex size-7 items-center justify-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-500 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-medium text-v2-neutral-500 mb-1.5">
                        <span className="text-[11px] text-v2-neutral-400">
                          {completedTasks} of {totalTasks} linked tasks completed
                        </span>
                        <span className="font-semibold text-v2-neutral-600">
                          {progress}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-v2-neutral-200">
                        <div
                          className="h-full rounded-full bg-v2-neutral-600 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Associated Tasks List */}
                    {milestone.tasks && milestone.tasks.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-v2-neutral-200">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-v2-neutral-400">
                          Linked Deliverables
                        </p>
                        <div className="space-y-2">
                          {milestone.tasks.map((task, taskIndex) => {
                            const isCompleted =
                              task.status?.toLowerCase() === "completed";
                            return (
                              <div
                                key={task.id || taskIndex}
                                className="flex items-center justify-between rounded-lg border border-v2-neutral-200 bg-v2-neutral-200/40 px-3 py-2.5 text-xs transition-colors hover:border-v2-neutral-300"
                              >
                                <div className="min-w-0 flex-1 pr-3">
                                  <p className="font-medium text-v2-neutral-600 truncate">
                                    {task.title}
                                  </p>
                                  {task.description && (
                                    <p className="text-[11px] text-v2-neutral-400 line-clamp-1 mt-0.5">
                                      {task.description}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  {task.due_date && (
                                    <span className="text-[10px] text-v2-neutral-400 hidden sm:inline-block">
                                      Due{" "}
                                      {new Date(
                                        task.due_date
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                  )}

                                  {isCompleted ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                                      <CheckCircle2 className="size-3" />
                                      Done
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[10px] font-semibold text-sky-700">
                                      <Clock className="size-3" />
                                      Active
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {isEditOpen && activeMilestone && (
        <MilestoneEditModal
          onCancel={handleClose}
          onSubmit={handleSubmit}
          milestoneId={activeMilestone.id}
          initialName={activeMilestone.name}
          initialEndDate={activeMilestone.end_date}
          initialTaskIds={activeMilestone.tasks?.map((task) => task.id) || []}
          availableTasks={availableTasks}
          isSubmitting={isSubmittingEdit}
        />
      )}

      {canManageMilestones && (
        <DeleteMilestoneModal
          open={Boolean(deleteMilestoneId)}
          milestoneId={deleteMilestoneId}
          milestone={milestones.find((m) => m.id === deleteMilestoneId) || null}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteMilestoneId(null);
            }
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
