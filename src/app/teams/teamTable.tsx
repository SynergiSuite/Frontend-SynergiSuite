
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

type TeamProps = {
  teams: Teams[];
  employees: Employee[];
};

export default function TeamTable({ teams, employees }: TeamProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [team, setTeam] = useState<Teams>({} as Teams)
  const [isDelete, setIsDelete] = useState(false)
  const [teamId, setTeamId] = useState<string>("")
  const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  const handleUpdate = async(updatedTeams: Teams) => {
    const accessToken = CookieManager("get", "access-token")
    console.log(updatedTeams)
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
    toast.success("Team updated successfully")
  }

  const handleDelete = async() => {
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
    toast.success("Team deleted successfully")
  }

  return (
    <>
      <table className="w-full text-sm text-left text-gray-700 border-collapse">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2">Team Name</th>
            <th className="px-4 py-2">Members</th>
            <th className="px-4 py-2">Projects</th>
            <th className="px-4 py-2">Progress</th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {teams.map((team, index) => (
            <tr key={index} className="border-t border-gray-300">
              <td className="px-4 py-2 font-medium">{team.name}</td>
              <td className="px-4 py-2">{team.members.length}</td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#4b4b4b] h-2 rounded-full"
                    style={{ width: `80%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">80%</span>
              </td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2 flex items-center space-x-3">
                <button className="cursor-pointer" onClick={() => {setTeam(team); setIsEdit(true)}}>
                  <PencilRuler size={15}/>
                </button>
                <button className="cursor-pointer">
                  <Trash size={15} onClick={() => {setTeamId(team.id); setIsDelete(true)}} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AnimatePresence>
        {isEdit ? (
          <EditTeamModal
            onClose={() => setIsEdit(false)}
            onUpdate={handleUpdate}
            employees={employees}
            team={team}
          />
        ) : null}
      </AnimatePresence>

      <AlertDialog open={isDelete} onOpenChange={setIsDelete}>
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
