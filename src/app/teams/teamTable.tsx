import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Trash, PencilRuler, ChevronLeft, ChevronRight } from "lucide-react";
import { AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { CookieManager } from "@/lib/cookieManager";
import EditTeamModal from "./editTeamModal";
import { Employee, Teams } from "./schemas/types";
import TeamDetailModal from "./teamDetail";
import { PaginationMeta } from "./apis/getTeamsWithTasksApi";
import { deleteTeamApi } from "./apis/deleteTeamApi";
import { editTeamApi, EditTeamPayload } from "./apis/editTeamApi";

type TeamProps = {
  teams: Teams[];
  employees: Employee[];
  canManageTeams: boolean;
  onRefresh?: () => void;
  paginationMeta?: PaginationMeta | null;
  onPageChange?: (newPage: number) => void;
};

export default function TeamTable({
  teams,
  employees,
  canManageTeams,
  onRefresh,
  paginationMeta,
  onPageChange,
}: TeamProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<Teams | null>(null);
  const [team, setTeam] = useState<Teams>({} as Teams);
  const [isDelete, setIsDelete] = useState(false);
  const [teamId, setTeamId] = useState<string>("");
  const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  const resolveMemberName = (member: any) =>
    member?.user?.name ?? member?.name ?? "Unnamed";

  const handleUpdate = async (updatedTeams: Teams) => {
    if (!canManageTeams) {
      toast.error("You do not have permission to edit teams.");
      return;
    }

    try {
      const memberIds = Array.isArray(updatedTeams.members)
        ? updatedTeams.members
            .map((m: any) =>
              typeof m === "number" ? m : m.user_id || m.id || m.user?.user_id || m.user?.id
            )
            .filter(Boolean)
        : [];

      const payload: EditTeamPayload = {
        name: updatedTeams.name,
        description: updatedTeams.description,
        members: memberIds,
        leader_id: Number(updatedTeams.leader_id || updatedTeams.leader?.user_id || 0),
      };

      await editTeamApi(updatedTeams.id, payload);
      setIsEdit(false);
      onRefresh?.();
      toast.success("Team updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update team");
    }
  };

  const handleDelete = async () => {
    if (!canManageTeams) {
      toast.error("You do not have permission to delete teams.");
      return;
    }

    if (!teamId) return;

    try {
      await deleteTeamApi(teamId);
      setIsDelete(false);
      setTeamId("");
      onRefresh?.();
      toast.success("Team deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete team");
    }
  };

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left text-sm text-white">
          <thead className="bg-white/[0.04] text-white/50 border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Team Name</th>
              <th className="px-4 py-3">Members</th>
              <th className="px-4 py-3">Tasks Breakdown</th>
              {canManageTeams ? (
                <th className="px-4 py-3 text-right">Action</th>
              ) : null}
            </tr>
          </thead>

          <tbody>
            {teams.map((teamItem, index) => {
              const membersList = teamItem.members || teamItem.teamMembers || [];
              return (
                <tr
                  key={teamItem.id || index}
                  className="cursor-pointer border-t border-white/[0.05] transition hover:bg-white/[0.03]"
                  onClick={() => setSelectedTeam(teamItem)}
                >
                  <td className="px-4 py-4 font-semibold text-white/95">{teamItem.name}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {membersList.slice(0, 2).map((member: any, memberIndex: number) => (
                        <span
                          key={member?.id ?? member?.user_id ?? memberIndex}
                          className="inline-flex rounded-full bg-[#5271ff]/15 text-[#5271ff] border border-[#5271ff]/25 px-3 py-1 text-xs font-medium"
                        >
                          {resolveMemberName(member)}
                        </span>
                      ))}
                      {membersList.length > 2 ? (
                        <span className="inline-flex rounded-full bg-white/[0.08] text-white px-3 py-1 text-xs font-semibold">
                          +{membersList.length - 2}
                        </span>
                      ) : null}
                      {membersList.length === 0 ? (
                        <span className="text-xs text-white/35">No members</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {teamItem.totalTasks !== undefined ? (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="inline-flex rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 font-semibold text-emerald-400">
                          {teamItem.completedTasks ?? 0} Done
                        </span>
                        <span className="inline-flex rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 font-semibold text-amber-300">
                          {teamItem.ongoingTasks ?? 0} Ongoing
                        </span>
                        <span className="text-white/40 text-[11px]">
                          ({teamItem.totalTasks} Total)
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-white/35">--</span>
                    )}
                  </td>
                  {canManageTeams ? (
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="cursor-pointer text-white/40 hover:text-[#5271ff] transition-colors"
                          onClick={() => {
                            setTeam(teamItem);
                            setIsEdit(true);
                          }}
                          aria-label="Edit team"
                        >
                          <PencilRuler size={15}/>
                        </button>
                        <button
                          className="cursor-pointer text-white/40 hover:text-red-400 transition-colors"
                          onClick={() => {
                            setTeamId(teamItem.id);
                            setIsDelete(true);
                          }}
                          aria-label="Delete team"
                        >
                          <Trash size={15} />
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {teams.map((teamItem, index) => {
          const membersList = teamItem.members || teamItem.teamMembers || [];
          return (
            <div
              key={teamItem.id || index}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedTeam(teamItem)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedTeam(teamItem);
                }
              }}
              className="w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 p-4 text-left shadow-sm transition hover:bg-white/[0.04] cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                    Team Name
                  </p>
                  <h3 className="mt-1 break-words font-semibold text-white text-base">
                    {teamItem.name}
                  </h3>
                </div>

                {canManageTeams ? (
                  <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-[#5271ff] hover:bg-white/[0.08] transition-all"
                      onClick={() => {
                        setTeam(teamItem);
                        setIsEdit(true);
                      }}
                    >
                      <PencilRuler size={14} />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-red-400 hover:bg-white/[0.08] transition-all"
                      onClick={() => {
                        setTeamId(teamItem.id);
                        setIsDelete(true);
                      }}
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="mt-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  Members
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {membersList.slice(0, 3).map((member: any, memberIndex: number) => (
                    <span
                      key={member?.id ?? member?.user_id ?? memberIndex}
                      className="inline-flex rounded-full bg-[#5271ff]/15 text-[#5271ff] border border-[#5271ff]/25 px-3 py-1 text-xs font-medium"
                    >
                      {resolveMemberName(member)}
                    </span>
                  ))}
                  {membersList.length > 3 ? (
                    <span className="inline-flex rounded-full bg-white/[0.08] text-white px-3 py-1 text-xs font-semibold">
                      +{membersList.length - 3}
                    </span>
                  ) : null}
                  {membersList.length === 0 ? (
                    <span className="text-xs text-white/35">No members</span>
                  ) : null}
                </div>
              </div>

              {teamItem.totalTasks !== undefined && (
                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/50">
                  <span>Task Velocity</span>
                  <span className="font-semibold text-white">
                    {teamItem.completedTasks ?? 0} / {teamItem.totalTasks} Tasks Completed
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Backend Pagination Bar */}
      {paginationMeta && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/[0.08] text-xs text-white/50">
          <div>
            Showing{" "}
            <span className="font-semibold text-white">
              {paginationMeta.totalItems > 0
                ? (paginationMeta.currentPage - 1) * paginationMeta.itemsPerPage + 1
                : 0}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-white">
              {Math.min(
                paginationMeta.currentPage * paginationMeta.itemsPerPage,
                paginationMeta.totalItems
              )}
            </span>{" "}
            of <span className="font-semibold text-white">{paginationMeta.totalItems}</span> teams
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={paginationMeta.currentPage <= 1}
              onClick={() => onPageChange?.(paginationMeta.currentPage - 1)}
              className="inline-flex h-8 items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 font-semibold text-white transition hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="px-2 font-medium text-white/70">
              Page {paginationMeta.currentPage} of {paginationMeta.totalPages || 1}
            </span>
            <button
              type="button"
              disabled={paginationMeta.currentPage >= paginationMeta.totalPages}
              onClick={() => onPageChange?.(paginationMeta.currentPage + 1)}
              className="inline-flex h-8 items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 font-semibold text-white transition hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isEdit && canManageTeams ? (
          <EditTeamModal
            onClose={() => setIsEdit(false)}
            onUpdate={handleUpdate}
            employees={employees}
            team={team}
          />
        ) : null}
      </AnimatePresence>

      <TeamDetailModal
        team={selectedTeam}
        open={selectedTeam !== null}
        onClose={() => setSelectedTeam(null)}
      />

      <AlertDialog open={canManageTeams ? isDelete : false} onOpenChange={setIsDelete}>
        <AlertDialogContent className="bg-[#0a0826]/95 border border-white/[0.08] backdrop-blur-md rounded-2xl shadow-2xl shadow-rose-500/5 text-white max-w-md p-6 overflow-hidden">
          {/* Top Danger Line Accent */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-rose-500" />

          <AlertDialogHeader className="border-b-0 p-0 text-left sm:text-left flex flex-col gap-1.5">
            <AlertDialogTitle className="text-lg font-bold text-white tracking-tight">
              Delete this team?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-white/50 leading-relaxed font-medium">
              This action cannot be undone. This will permanently delete the team and remove all associated squad data.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="border-t-0 p-0 mt-6 gap-2 flex flex-row justify-end items-center">
            <AlertDialogCancel
              onClick={() => {
                setTeamId("");
              }}
              className="cursor-pointer px-4 py-2 text-xs font-semibold text-white/70 hover:text-white bg-white/[0.02] border border-white/[0.08] rounded-xl hover:bg-white/[0.05] transition-all duration-200 h-auto"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="cursor-pointer px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 border border-rose-500/30 rounded-xl hover:shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:scale-[1.02] transition-all duration-200 h-auto"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
