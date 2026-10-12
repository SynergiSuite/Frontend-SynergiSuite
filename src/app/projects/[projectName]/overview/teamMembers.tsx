"use client";

import React, { useState } from "react";
import { Plus, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Team } from "../../schemas/team";
import EditTeamsModal from "./addTeamsModal";

type TeamMembersProps = {
  selectedTeams: Team[];
  allTeams: Team[];
  canManageTeams?: boolean;
  onSaveTeams?: (teamIds: string[]) => void;
};

export default function TeamMembers({
  selectedTeams,
  allTeams,
  canManageTeams = false,
  onSaveTeams,
}: TeamMembersProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const selectedTeamIds = selectedTeams.map((team) => team.id);

  return (
    <>
      <Card className="overflow-hidden border border-v2-neutral-300 bg-v2-neutral-100 shadow-sm">
        <CardHeader className="pb-3 border-b border-v2-neutral-200/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-lg bg-v2-neutral-200 text-v2-neutral-600">
                <UsersRound className="size-3.5" />
              </span>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-v2-neutral-400">
                Assigned Squads
              </h3>
            </div>
            <span className="rounded-full bg-v2-neutral-200 px-2.5 py-1 text-[11px] font-semibold text-v2-neutral-600">
              {selectedTeams.length} {selectedTeams.length === 1 ? "Squad" : "Squads"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-3 text-xs">
          {selectedTeams.length === 0 ? (
            <div className="rounded-xl border border-dashed border-v2-neutral-300 p-4 text-center">
              <p className="text-xs text-v2-neutral-400">
                No executing squads assigned yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between rounded-xl border border-v2-neutral-200 bg-v2-neutral-200/40 px-3 py-2.5 transition-colors hover:border-v2-neutral-300"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-v2-neutral-600 text-[10px] font-bold text-v2-neutral-100">
                      {team.name ? team.name.slice(0, 2).toUpperCase() : "SQ"}
                    </span>
                    <span className="font-semibold text-v2-neutral-600 truncate">
                      {team.name}
                    </span>
                  </div>
                  <span className="shrink-0 text-[11px] font-medium text-v2-neutral-400">
                    {team.members?.length || team.employees?.length || 0} members
                  </span>
                </div>
              ))}
            </div>
          )}

          {canManageTeams && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(true)}
              className="w-full mt-2 h-9 border-v2-neutral-300 text-xs font-semibold text-v2-neutral-600 hover:bg-v2-neutral-200"
            >
              <Plus className="size-3.5 mr-1.5" />
              Manage Squads
            </Button>
          )}
        </CardContent>
      </Card>

      {isEditOpen && canManageTeams && (
        <EditTeamsModal
          teams={allTeams}
          initialSelectedTeamIds={selectedTeamIds}
          onCancel={() => setIsEditOpen(false)}
          onSubmit={(teamIds) => {
            onSaveTeams?.(teamIds);
            setIsEditOpen(false);
          }}
        />
      )}
    </>
  );
}
