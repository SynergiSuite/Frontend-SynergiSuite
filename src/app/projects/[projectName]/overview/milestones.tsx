import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Trash } from "lucide-react";
import { Milestone, MilestoneUpdate } from "../schemas/milestone";
import MilestoneEditModal from "./milestoneEditModal";
import { UpdateMilestone } from "../apis/updateMilestone";
import DeleteMilestoneModal from "./deleteModal";

type MilestonesProps = {
  milestones: Milestone[];
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

const Milestones = ({ milestones, onRefresh }: MilestonesProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(
    null
  );
  const [deleteMilestoneId, setDeleteMilestoneId] = useState<string | null>(
    null
  );
  const listKey = milestones.map((milestone) => milestone.id).join("-");

  const openEditModal = (milestone: Milestone) => {
    setActiveMilestone(milestone);
    setIsEditOpen(true);
  };

  const handleClose = () => {
    setIsEditOpen(false);
    setActiveMilestone(null);
  };

  const handleSubmit = async (payload: MilestoneUpdate) => {
    try {
      await UpdateMilestone(payload);
      await onRefresh?.();
      setIsEditOpen(false);
      setActiveMilestone(null);
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const handleDeleteConfirm = async (milestoneId: string) => {
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
            <p className="text-sm text-slate-500">No milestones yet.</p>
          ) : (
            milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id ?? index}
                className="rounded-lg border border-slate-200 bg-white p-3 space-y-3"
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.25, ease: "easeOut" },
                  },
                }}
              >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-semibold sm:text-base">
                  {milestone.name}
                  <button
                    type="button"
                    aria-label="Edit milestone"
                    onClick={() => openEditModal(milestone)}
                    className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:bg-white"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete milestone"
                    onClick={() => setDeleteMilestoneId(milestone.id)}
                    className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:bg-white"
                  >
                    <Trash className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </p>
                <p className="text-xs text-slate-500 sm:text-sm">
                  {(() => {
                    const monthsRemaining = getMonthsRemaining(milestone.end_date);
                    if (monthsRemaining === null) {
                      return "No due date";
                    }
                    return `${monthsRemaining} month${monthsRemaining === 1 ? "" : "s"} remaining`;
                  })()}
                </p>
              </div>
              <div className="space-y-2">
                {milestone.tasks.map((task, taskIndex) => (
                  <div
                    key={taskIndex}
                    className={`rounded-md border ${task.status === 'completed' ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50'}  px-3 py-2`}
                  >
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-slate-600">{task.description}</p>
                    <p className="text-xs text-slate-500">{task.due_date}</p>
                  </div>
                ))}
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
        />
      ) : null}

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
    </>
  );
};

export default Milestones;
