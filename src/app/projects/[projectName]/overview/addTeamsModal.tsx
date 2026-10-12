"use client";

import React, { useMemo, useState } from "react";
import { Check, Search, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Team } from "../../schemas/team";

type EditTeamsModalProps = {
  onCancel: () => void;
  onSubmit: (teamIds: string[]) => void;
  teams: Team[];
  initialSelectedTeamIds?: string[];
  title?: string;
};

export default function EditTeamsModal({
  onCancel,
  onSubmit,
  teams,
  initialSelectedTeamIds = [],
  title = "Manage Assigned Squads",
}: EditTeamsModalProps) {
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>(
    initialSelectedTeamIds
  );
  const [filterQuery, setFilterQuery] = useState("");

  const toggleTeamId = (teamId: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const filteredTeams = useMemo(() => {
    if (!filterQuery.trim()) return teams;
    return teams.filter((t) =>
      t.name.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [teams, filterQuery]);

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent
        showCloseButton
        className="max-w-xl border border-v2-neutral-300 bg-v2-neutral-100 p-0 shadow-2xl rounded-2xl overflow-hidden"
      >
        <DialogHeader className="border-b border-v2-neutral-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-v2-neutral-200 text-v2-neutral-600">
              <UsersRound className="size-5" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold text-v2-neutral-600">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-v2-neutral-400 mt-0.5">
                Assign and adjust executing squads deployed to this project.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Filter Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-v2-neutral-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search squads by name..."
              className="h-10 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 pl-9 pr-4 text-xs text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-400 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20"
            />
          </div>

          {/* Squad Grid */}
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1 v2-scrollbar">
            {filteredTeams.length === 0 ? (
              <div className="py-8 text-center text-xs text-v2-neutral-400">
                No squads found matching your search.
              </div>
            ) : (
              filteredTeams.map((team) => {
                const isSelected = selectedTeamIds.includes(team.id);
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => toggleTeamId(team.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-v2-neutral-600 bg-v2-neutral-200/60 text-v2-neutral-600 shadow-sm"
                        : "border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-500 hover:border-v2-neutral-400 hover:bg-v2-neutral-200/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid size-5 place-items-center rounded border transition-colors ${
                          isSelected
                            ? "border-v2-neutral-600 bg-v2-neutral-600 text-v2-neutral-100"
                            : "border-v2-neutral-300 bg-v2-neutral-100"
                        }`}
                      >
                        {isSelected && (
                          <Check className="size-3.5 stroke-[3]" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-v2-neutral-600">
                          {team.name}
                        </p>
                        <p className="text-[11px] text-v2-neutral-400">
                          {team.members?.length || team.employees?.length || 0} members deployed
                        </p>
                      </div>
                    </div>

                    <span className="rounded-md bg-v2-neutral-200 px-2 py-0.5 text-[10px] font-semibold text-v2-neutral-500">
                      Squad
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-v2-neutral-400 border-t border-v2-neutral-200">
            <span>
              <strong className="text-v2-neutral-600">
                {selectedTeamIds.length}
              </strong>{" "}
              of {teams.length} squads selected
            </span>
            {selectedTeamIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedTeamIds([])}
                className="text-xs text-destructive hover:underline font-medium cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <DialogFooter className="border-t border-v2-neutral-200 bg-v2-neutral-200/30 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-v2-neutral-300 text-v2-neutral-600 hover:bg-v2-neutral-200"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() => onSubmit(selectedTeamIds)}
            className="bg-v2-neutral-600 text-v2-neutral-100 hover:bg-v2-neutral-500 font-semibold shadow-sm"
          >
            Save Squad Assignments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
