
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Trash, PencilRuler } from "lucide-react"
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

type TeamProps = {
  teams: Teams[];
  employees: Employee[];
  canManageTeams: boolean;
  onRefresh?: () => void;
};

export default function TeamTable({
  teams,
  employees,
  canManageTeams,
  onRefresh,
}: TeamProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [selectedTeam, setSelectedTeam] = useState<Teams | null>(null)
  const [team, setTeam] = useState<Teams>({} as Teams)
  const [isDelete, setIsDelete] = useState(false)
  const [teamId, setTeamId] = useState<string>("")
  const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  const resolveMemberName = (member: any) =>
    member?.user?.name ?? member?.name ?? "Unnamed";

  const handleUpdate = async(updatedTeams: Teams) => {
    if (!canManageTeams) {
      toast.error("You do not have permission to edit teams.");
      return;
    }

    const accessToken = CookieManager("get", "access-token")
    const res = await fetch(`${requestBaseUrl}/teams/update-team`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedTeams)
    })
    if(!res.ok) {
      const resData = res.json()
      toast.error(res.statusText + resData)
      return
    }
    setIsEdit(false)
    onRefresh?.();
    toast.success("Team updated successfully")
  }

  const handleDelete = async() => {
    if (!canManageTeams) {
      toast.error("You do not have permission to delete teams.");
      return;
    }

    const accessToken = CookieManager("get", "access-token")
    const obj = { team_id: teamId}
    const res = await fetch(`${requestBaseUrl}/teams/remove-team`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(obj)
    })
    if(!res.ok) {
      toast.error(res.statusText)
      return
    }
    setIsDelete(false)
    setTeamId("")
    onRefresh?.();
    toast.success("Team deleted successfully")
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left text-sm text-white">
          <thead className="bg-white/[0.04] text-white/50 border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Team Name</th>
              <th className="px-4 py-3">Members</th>
              <th className="px-4 py-3"></th>
              {canManageTeams ? (
                <th className="px-4 py-3 text-right">Action</th>
              ) : null}
            </tr>
          </thead>

          <tbody>
            {teams.map((team, index) => (
              <tr
                key={index}
                className="cursor-pointer border-t border-white/[0.05] transition hover:bg-white/[0.03]"
                onClick={() => setSelectedTeam(team)}
              >
                <td className="px-4 py-4 font-semibold text-white/95">{team.name}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {team.members.slice(0, 2).map((member, memberIndex) => (
                      <span
                        key={member?.id ?? member?.user_id ?? memberIndex}
                        className="inline-flex rounded-full bg-[#5271ff]/15 text-[#5271ff] border border-[#5271ff]/25 px-3 py-1 text-xs font-medium"
                      >
                        {resolveMemberName(member)}
                      </span>
                    ))}
                    {team.members.length > 2 ? (
                      <span className="inline-flex rounded-full bg-white/[0.08] text-white px-3 py-1 text-xs font-semibold">
                        +{team.members.length - 2}
                      </span>
                    ) : null}
                    {team.members.length === 0 ? (
                      <span className="text-xs text-white/35">No members</span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-4"></td>
                {canManageTeams ? (
                  <td className="px-4 py-4 text-right">
                    <div className="inline-flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="cursor-pointer text-white/40 hover:text-[#5271ff] transition-colors"
                        onClick={() => {
                          setTeam(team);
                          setIsEdit(true);
                        }}
                        aria-label="Edit team"
                      >
                        <PencilRuler size={15}/>
                      </button>
                      <button
                        className="cursor-pointer text-white/40 hover:text-red-400 transition-colors"
                        onClick={() => {
                          setTeamId(team.id);
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
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {teams.map((team, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedTeam(team)}
            className="w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 p-4 text-left shadow-sm transition hover:bg-white/[0.04]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  Team Name
                </p>
                <h3 className="mt-1 break-words font-semibold text-white text-base">
                  {team.name}
                </h3>
              </div>

              {canManageTeams ? (
                <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-[#5271ff] hover:bg-white/[0.08] transition-all"
                    onClick={() => {
                      setTeam(team);
                      setIsEdit(true);
                    }}
                  >
                    <PencilRuler size={14} />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-red-400 hover:bg-white/[0.08] transition-all"
                    onClick={() => {
                      setTeamId(team.id);
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
                {team.members.slice(0, 3).map((member, memberIndex) => (
                  <span
                    key={member?.id ?? member?.user_id ?? memberIndex}
                    className="inline-flex rounded-full bg-[#5271ff]/15 text-[#5271ff] border border-[#5271ff]/25 px-3 py-1 text-xs font-medium"
                  >
                    {resolveMemberName(member)}
                  </span>
                ))}
                {team.members.length > 3 ? (
                  <span className="inline-flex rounded-full bg-white/[0.08] text-white px-3 py-1 text-xs font-semibold">
                    +{team.members.length - 3}
                  </span>
                ) : null}
                {team.members.length === 0 ? (
                  <span className="text-xs text-white/35">No members</span>
                ) : null}
              </div>
            </div>
          </button>
        ))}
      </div>

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
        <AlertDialogContent className="border border-white/[0.08] bg-[#0a0826] text-white rounded-[24px] shadow-[0_24px_80px_rgba(0,0,0,0.65)] p-6 backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-bold text-lg">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50 text-sm leading-relaxed mt-2">
              This action cannot be undone. This will permanently delete the team
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex justify-end space-x-3">
            <AlertDialogCancel
              onClick={() => {
                setTeamId("");
              }}
              className="cursor-pointer rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="cursor-pointer rounded-xl bg-red-500/20 border border-red-500/30 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/30 transition-all"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
