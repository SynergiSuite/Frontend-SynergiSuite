"use client";

import React, { useState, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Crown,
  Eye,
  LoaderCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteTeamApi } from "./apis/deleteTeamApi";
import { editTeamApi, EditTeamPayload } from "./apis/editTeamApi";
import type { PaginationMeta } from "./apis/getTeamsWithTasksApi";
import EditTeamModal from "./editTeamModal";
import type { Employee, Teams } from "./schemas/types";
import TeamDetailModal from "./teamDetail";

type TeamProps = {
  teams: Teams[];
  employees: Employee[];
  canManageTeams: boolean;
  onRefresh?: () => void;
  paginationMeta?: PaginationMeta | null;
  onPageChange?: (newPage: number) => void;
};

const resolveMemberName = (member: any) =>
  member?.user?.name ?? member?.name ?? "Unnamed";

export default function TeamTable({
  teams,
  employees,
  canManageTeams,
  onRefresh,
  paginationMeta,
  onPageChange,
}: TeamProps) {
  const deleteModalRef = useRef<HTMLDivElement>(null);
  const [selectedDetailTeam, setSelectedDetailTeam] = useState<Teams | null>(null);
  const [editingTeam, setEditingTeam] = useState<Teams | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<Teams | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useLayoutEffect(() => {
    if (
      !teamToDelete ||
      !deleteModalRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.from("[data-delete-modal-section]", {
        autoAlpha: 0,
        y: 8,
        duration: 0.3,
        stagger: 0.05,
        ease: "power3.out",
      });
    }, deleteModalRef.current);

    return () => context.revert();
  }, [teamToDelete]);

  const handleUpdate = async (updatedTeams: Teams) => {
    if (!canManageTeams) {
      toast.error("You do not have permission to edit teams.");
      return;
    }

    try {
      const memberIds = Array.isArray(updatedTeams.members)
        ? updatedTeams.members
            .map((m: any) =>
              typeof m === "number"
                ? m
                : m.user_id || m.id || m.user?.user_id || m.user?.id
            )
            .filter(Boolean)
        : [];

      const payload: EditTeamPayload = {
        name: updatedTeams.name,
        description: updatedTeams.description,
        members: memberIds,
        leader_id: Number(
          updatedTeams.leader_id || updatedTeams.leader?.user_id || 0
        ),
      };

      await editTeamApi(updatedTeams.id, payload);
      setEditingTeam(null);
      onRefresh?.();
      toast.success("Team updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update team");
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!canManageTeams) {
      toast.error("You do not have permission to delete teams.");
      return;
    }

    if (!teamToDelete?.id) return;

    setIsDeleting(true);
    try {
      await deleteTeamApi(teamToDelete.id);
      setTeamToDelete(null);
      onRefresh?.();
      toast.success(`Squad "${teamToDelete.name}" deleted successfully.`);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete team.");
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteMembersList = teamToDelete?.members || teamToDelete?.teamMembers || [];

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left text-sm text-v2-neutral-600">
          <thead className="border-b border-v2-neutral-200 bg-v2-neutral-200/40 text-xs font-semibold uppercase tracking-[0.08em] text-v2-neutral-400">
            <tr>
              <th className="px-5 py-3.5">Team Name</th>
              <th className="px-5 py-3.5">Squad Members</th>
              <th className="px-5 py-3.5">Task Velocity</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-v2-neutral-200/70">
            {teams.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-xs text-v2-neutral-400">
                  No teams found. Create a new team to get started.
                </td>
              </tr>
            ) : (
              teams.map((teamItem, index) => {
                const membersList = teamItem.members || teamItem.teamMembers || [];
                const total = teamItem.totalTasks ?? 0;
                const completed = teamItem.completedTasks ?? 0;
                const ongoing = teamItem.ongoingTasks ?? 0;

                return (
                  <tr
                    key={teamItem.id || index}
                    className="group transition-colors hover:bg-v2-neutral-200/40 cursor-pointer"
                    onClick={() => setSelectedDetailTeam(teamItem)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-v2-neutral-200 text-v2-neutral-600 font-semibold text-xs">
                          {teamItem.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-v2-neutral-600 truncate">
                            {teamItem.name}
                          </p>
                          {teamItem.description && (
                            <p className="text-xs text-v2-neutral-400 truncate max-w-xs">
                              {teamItem.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {membersList.slice(0, 3).map((member: any, mIdx: number) => (
                          <span
                            key={member?.id ?? member?.user_id ?? mIdx}
                            className="inline-flex items-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 px-2.5 py-1 text-xs font-medium text-v2-neutral-600 shadow-xs"
                          >
                            {resolveMemberName(member)}
                          </span>
                        ))}
                        {membersList.length > 3 && (
                          <span className="inline-flex rounded-lg bg-v2-neutral-200 px-2 py-1 text-xs font-semibold text-v2-neutral-500">
                            +{membersList.length - 3}
                          </span>
                        )}
                        {membersList.length === 0 && (
                          <span className="text-xs text-v2-neutral-400 italic">
                            No members assigned
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {teamItem.totalTasks !== undefined ? (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                            {completed} Done
                          </span>
                          <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">
                            {ongoing} Ongoing
                          </span>
                          <span className="text-v2-neutral-400 font-medium">
                            ({total} Total)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-v2-neutral-400">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div
                        className="inline-flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDetailTeam(teamItem)}
                          className="size-8 p-0 text-v2-neutral-400 hover:text-v2-neutral-600"
                          title="View Details"
                        >
                          <Eye className="size-4" />
                        </Button>

                        {canManageTeams && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="size-8 p-0 text-v2-neutral-400 hover:text-v2-neutral-600"
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setEditingTeam(teamItem)}
                                className="cursor-pointer gap-2"
                              >
                                <Pencil className="size-4" />
                                Edit Team
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setTeamToDelete(teamItem)}
                                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                              >
                                <Trash2 className="size-4 text-destructive" />
                                Delete Team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="space-y-3 md:hidden">
        {teams.length === 0 ? (
          <div className="py-8 text-center text-xs text-v2-neutral-400">
            No teams found. Create a new team to get started.
          </div>
        ) : (
          teams.map((teamItem, index) => {
            const membersList = teamItem.members || teamItem.teamMembers || [];

            return (
              <div
                key={teamItem.id || index}
                onClick={() => setSelectedDetailTeam(teamItem)}
                className="cursor-pointer rounded-2xl border border-v2-neutral-200 bg-v2-neutral-100 p-4 transition-colors hover:border-v2-neutral-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-v2-neutral-200 font-semibold text-xs text-v2-neutral-600">
                      {teamItem.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-v2-neutral-600 truncate">
                        {teamItem.name}
                      </h3>
                      {teamItem.description && (
                        <p className="text-xs text-v2-neutral-400 truncate">
                          {teamItem.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {canManageTeams && (
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTeam(teamItem)}
                        className="size-8 p-0 text-v2-neutral-400 hover:text-v2-neutral-600"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTeamToDelete(teamItem)}
                        className="size-8 p-0 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {membersList.slice(0, 3).map((member: any, mIdx: number) => (
                    <span
                      key={member?.id ?? member?.user_id ?? mIdx}
                      className="inline-flex rounded-lg border border-v2-neutral-300 bg-v2-neutral-200/50 px-2 py-0.5 text-xs font-medium text-v2-neutral-600"
                    >
                      {resolveMemberName(member)}
                    </span>
                  ))}
                  {membersList.length > 3 && (
                    <span className="inline-flex rounded-lg bg-v2-neutral-200 px-2 py-0.5 text-xs font-semibold text-v2-neutral-500">
                      +{membersList.length - 3}
                    </span>
                  )}
                </div>

                {teamItem.totalTasks !== undefined && (
                  <div className="mt-3 pt-3 border-t border-v2-neutral-200 flex items-center justify-between text-xs text-v2-neutral-400">
                    <span>Tasks</span>
                    <span className="font-medium text-v2-neutral-600">
                      {teamItem.completedTasks ?? 0} Done / {teamItem.ongoingTasks ?? 0} Ongoing
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      {paginationMeta && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-v2-neutral-200 text-xs text-v2-neutral-400">
          <div>
            Showing{" "}
            <span className="font-semibold text-v2-neutral-600">
              {paginationMeta.totalItems > 0
                ? (paginationMeta.currentPage - 1) * paginationMeta.itemsPerPage + 1
                : 0}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-v2-neutral-600">
              {Math.min(
                paginationMeta.currentPage * paginationMeta.itemsPerPage,
                paginationMeta.totalItems
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-v2-neutral-600">
              {paginationMeta.totalItems}
            </span>{" "}
            teams
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={paginationMeta.currentPage <= 1}
              onClick={() => onPageChange?.(paginationMeta.currentPage - 1)}
              className="h-8 gap-1 px-3 text-xs"
            >
              <ChevronLeft className="size-3.5" />
              Previous
            </Button>
            <span className="px-2 font-medium text-v2-neutral-500">
              Page {paginationMeta.currentPage} of {paginationMeta.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={paginationMeta.currentPage >= paginationMeta.totalPages}
              onClick={() => onPageChange?.(paginationMeta.currentPage + 1)}
              className="h-8 gap-1 px-3 text-xs"
            >
              Next
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {editingTeam && canManageTeams && (
        <EditTeamModal
          isOpen={editingTeam !== null}
          onClose={() => setEditingTeam(null)}
          onUpdate={handleUpdate}
          employees={employees}
          team={editingTeam}
        />
      )}

      {/* Team Detail Modal */}
      <TeamDetailModal
        team={selectedDetailTeam}
        open={selectedDetailTeam !== null}
        onClose={() => setSelectedDetailTeam(null)}
      />

      {/* Redesigned V2 Delete Confirmation Dialog */}
      <Dialog
        open={teamToDelete !== null}
        onOpenChange={(open) => !open && !isDeleting && setTeamToDelete(null)}
      >
        <DialogContent
          ref={deleteModalRef}
          className="border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-[0_24px_80px_rgba(53,53,54,0.22)] sm:max-w-lg"
        >
          <DialogHeader data-delete-modal-section className="border-v2-neutral-200 pb-5">
            <div className="flex items-start gap-3.5 pr-12">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-destructive/10 text-destructive shadow-sm">
                <Trash2 className="size-5" aria-hidden="true" />
              </span>
              <div>
                <DialogTitle className="text-xl tracking-[-0.03em] text-v2-neutral-600">
                  Delete squad
                </DialogTitle>
                <DialogDescription className="mt-1 text-xs leading-5 text-v2-neutral-400">
                  This permanently removes the team unit from this workspace.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div data-delete-modal-section className="space-y-4 px-6 py-4 sm:px-8">
            <Card variant="subtle" size="sm" className="border-destructive/20 bg-destructive/5">
              <CardContent className="flex items-start gap-3 text-xs leading-relaxed text-v2-neutral-600 p-4">
                <AlertTriangle className="size-4 shrink-0 text-destructive mt-0.5" />
                <div>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-v2-neutral-600">
                    "{teamToDelete?.name}"
                  </span>
                  ? Squad member allocations will be cleared and task associations will be unlinked.
                </div>
              </CardContent>
            </Card>

            {teamToDelete && (
              <div className="rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 p-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-v2-neutral-400">Squad members:</span>
                  <span className="font-semibold text-v2-neutral-600">
                    {deleteMembersList.length} members
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs border-t border-v2-neutral-200/70 pt-2">
                  <span className="text-v2-neutral-400">Active tasks:</span>
                  <span className="font-semibold text-v2-neutral-600">
                    {teamToDelete.ongoingTasks ?? 0} ongoing / {teamToDelete.totalTasks ?? 0} total
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter data-delete-modal-section className="border-v2-neutral-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setTeamToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                  Deleting squad...
                </>
              ) : (
                <>
                  <Trash2 className="size-4" aria-hidden="true" />
                  Delete squad
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
