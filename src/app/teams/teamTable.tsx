
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
        <table className="w-full border-collapse text-left text-sm text-gray-700">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2">Team Name</th>
              <th className="px-4 py-2">Members</th>
              <th className="px-4 py-2"></th>
              {canManageTeams ? (
                <th className="px-4 py-2">Action</th>
              ) : null}
            </tr>
          </thead>

          <tbody>
            {teams.map((team, index) => (
              <tr
                key={index}
                className="cursor-pointer border-t border-gray-300 transition hover:bg-slate-50/80"
                onClick={() => setSelectedTeam(team)}
              >
                <td className="px-4 py-2 font-medium">{team.name}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {team.members.slice(0, 2).map((member, memberIndex) => (
                      <span
                        key={member?.id ?? member?.user_id ?? memberIndex}
                        className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200"
                      >
                        {resolveMemberName(member)}
                      </span>
                    ))}
                    {team.members.length > 2 ? (
                      <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                        +{team.members.length - 2}
                      </span>
                    ) : null}
                    {team.members.length === 0 ? (
                      <span className="text-xs text-slate-400">No members</span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-2"></td>
                {canManageTeams ? (
                  <td className="flex items-center space-x-3 px-4 py-2">
                    <button className="cursor-pointer" onClick={(event) => {event.stopPropagation(); setTeam(team); setIsEdit(true)}}>
                      <PencilRuler size={15}/>
                    </button>
                    <button className="cursor-pointer">
                      <Trash size={15} onClick={(event) => {event.stopPropagation(); setTeamId(team.id); setIsDelete(true)}} />
                    </button>
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
            className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:bg-slate-50/80"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Team Name
                </p>
                <h3 className="mt-1 break-words font-medium text-gray-900">
                  {team.name}
                </h3>
              </div>

              {canManageTeams ? (
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600"
                    onClick={(event) => {
                      event.stopPropagation();
                      setTeam(team);
                      setIsEdit(true);
                    }}
                  >
                    <PencilRuler size={15} />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600"
                    onClick={(event) => {
                      event.stopPropagation();
                      setTeamId(team.id);
                      setIsDelete(true);
                    }}
                  >
                    <Trash size={15} />
                  </button>
                </div>
              ) : null}
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Members
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {team.members.slice(0, 3).map((member, memberIndex) => (
                  <span
                    key={member?.id ?? member?.user_id ?? memberIndex}
                    className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200"
                  >
                    {resolveMemberName(member)}
                  </span>
                ))}
                {team.members.length > 3 ? (
                  <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    +{team.members.length - 3}
                  </span>
                ) : null}
                {team.members.length === 0 ? (
                  <span className="text-xs text-slate-400">No members</span>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {setTeamId("")}} className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="cursor-pointer">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
