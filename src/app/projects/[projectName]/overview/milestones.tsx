import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Trash, CheckCircle2, Circle, Calendar, Trophy } from "lucide-react";
import { Milestone, MilestoneUpdate } from "../schemas/milestone";
import MilestoneEditModal from "./milestoneEditModal";
import { UpdateMilestone } from "../apis/updateMilestone";
import DeleteMilestoneModal from "./deleteModal";
import { Task } from "../task/schemas/task";
import { toast } from "sonner";

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

const Milestones = ({
  milestones,
  availableTasks,
  canManageMilestones,
  onRefresh,
}: MilestonesProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(
    null
  );
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [deleteMilestoneId, setDeleteMilestoneId] = useState<string | null>(
    null
  );
  const listKey = milestones.map((milestone) => milestone.id).join("-");

  const openEditModal = (milestone: Milestone) => {
    if (!canManageMilestones) {
      return;
    }
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
      // TODO: Wire delete API call here when available.
      await onRefresh?.();
    } catch (error) {
      console.error("Error deleting milestone:", error);
    }
  };

  return (
    <>
      <AnimatePresence mode="sync">
        <motion.div
          key={listKey}
          className="space-y-4"
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.06, delayChildren: 0.05 },
            },
          }}
        >
          {milestones.length === 0 ? (
            <p className="text-sm text-white/40 font-medium bg-[#0a0826]/30 border border-white/[0.04] p-4 rounded-xl text-center w-full">
              No milestones yet.
            </p>
          ) : (
            milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id ?? index}
                className="bg-[#0a0826]/40 border border-white/[0.08] backdrop-blur-md rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all duration-300 hover:border-[#5271ff]/30 space-y-4"
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.25, ease: "easeOut" },
                  },
                }}
              >
                {/* Left Glowing Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#5271ff] to-cyan-500" />

                <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#5271ff]/10 border border-[#5271ff]/20 flex items-center justify-center text-[#5271ff] shadow-[0_0_10px_rgba(82,113,255,0.15)]">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base tracking-tight">
                      {milestone.name}
                      {canManageMilestones ? (
                        <div className="flex items-center gap-1.5 ml-2">
                          <button
                            type="button"
                            aria-label="Edit milestone"
                            onClick={() => openEditModal(milestone)}
                            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-[#5271ff]/25 hover:border-[#5271ff]/40 transition-all duration-200"
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            aria-label="Delete milestone"
                            onClick={() => setDeleteMilestoneId(milestone.id)}
                            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-rose-500/25 hover:border-rose-500/40 transition-all duration-200"
                          >
                            <Trash className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1 text-xs text-white/50 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {(() => {
                      const monthsRemaining = getMonthsRemaining(milestone.end_date);
                      if (monthsRemaining === null) {
                        return "No due date";
                      }
                      return `${monthsRemaining} month${monthsRemaining === 1 ? "" : "s"} remaining`;
                    })()}
                  </div>
                </div>

                <div className="space-y-2.5 relative z-10">
                  {milestone.tasks.map((task, taskIndex) => {
                    const isCompleted = task.status === "completed";
                    return (
                      <div
                        key={taskIndex}
                        className={`rounded-xl border p-3.5 transition-all duration-300 ${
                          isCompleted
                            ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/35"
                            : "border-white/[0.06] bg-[#030114]/40 hover:border-[#5271ff]/20"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className={`text-sm font-semibold tracking-tight ${isCompleted ? "text-emerald-400" : "text-white/90"}`}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-xs text-white/40 font-medium leading-relaxed">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isCompleted ? (
                              <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-[0_0_8px_rgba(16,185,129,0.1)]">
                                <CheckCircle2 className="w-3 h-3" /> Completed
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 bg-[#5271ff]/10 text-[#5271ff] border border-[#5271ff]/20 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-[0_0_8px_rgba(82,113,255,0.15)]">
                                <Circle className="w-3 h-3" /> Active
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {task.due_date && (
                          <div className="mt-2.5 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-white/30 font-semibold">
                            <span>DUE DATE</span>
                            <span className={isCompleted ? "text-emerald-500/80" : "text-[#5271ff]"}>
                              {new Date(task.due_date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {isEditOpen && activeMilestone ? (
        <MilestoneEditModal
          onCancel={handleClose}
          onSubmit={handleSubmit}
          milestoneId={activeMilestone.id}
          initialName={activeMilestone.name}
          initialEndDate={activeMilestone.end_date}
          initialTaskIds={activeMilestone.tasks.map((task) => task.id)}
          availableTasks={availableTasks}
          isSubmitting={isSubmittingEdit}
        />
      ) : null}

      {canManageMilestones ? (
        <DeleteMilestoneModal
          open={Boolean(deleteMilestoneId)}
          milestoneId={deleteMilestoneId}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteMilestoneId(null);
            }
          }}
          onConfirm={handleDeleteConfirm}
        />
      ) : null}
    </>
  );
};

export default Milestones;
