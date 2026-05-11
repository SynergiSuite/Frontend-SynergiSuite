import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Button } from "@/global/buttons";
import { Employee, Teams } from "./schemas/types";
import { toast } from "sonner";
import {
  modalBodyClass,
  modalCloseButtonClass,
  modalFooterClass,
  modalHeaderClass,
  modalOverlayClass,
  modalShellClass,
  modalSubtitleClass,
  modalTitleClass,
} from "@/lib/modalStyles";

type EditTeamModalProps = {
  onClose: () => void;
  onUpdate: (team: Teams) => void;
  team: Teams;
  employees: Employee[];
};

export default function EditTeamModal({
  onClose,
  onUpdate,
  team,
  employees,
}: EditTeamModalProps) {

  // ===== State =====
  const [formData, setFormData] = useState<Teams>({
    id: team.id,
    name: team.name,
    description: team.description,
    members: team.members || [],
    leader_id: team.leader_id || (team.leader?.user_id ?? 0),
  });
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [leaderName, setLeaderName] = useState<string>("");

  // ===== Effects =====
  // Sync members with team + employees
  useEffect(() => {
    if (employees.length > 0) {
      const normalizedMembers =
        typeof team.members[0] === "object" && "user" in team.members[0]
          ? team.members
          : employees.filter((emp) =>
              (team.members as unknown as number[]).includes(emp.user_id)
            );

      setMembers(normalizedMembers);

      setFormData((prev) => ({
        ...prev,
        members: normalizedMembers,
        leader_id: team.leader_id || team.leader?.user_id || prev.leader_id,
      }));
    }
  }, [team, employees]);

  // Update leader name display whenever leader_id changes
  useEffect(() => {
    if (!formData.leader_id || members.length === 0) return;

    const found = members.find((m) => {
      const id = m.user ? m.user.user_id : m.user_id;
      return id === formData.leader_id;
    });

    if (found) {
      const name = found.user ? found.user.name : found.name;
      setLeaderName(name);
    } else {
      setLeaderName("");
    }
  }, [formData.leader_id, members]);

  // ===== Helpers =====
  const stringToInt = (str: string) => parseInt(str, 10);


  // ===== Handlers =====
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMember = () => {
    const selectedEmployee = employees.find(
      (e) => e.user_id === stringToInt(selectedMemberId)
    );
    if (!selectedEmployee) return;

    const alreadyIn =
      members.some((m) =>
        m.user
          ? m.user.user_id === selectedEmployee.user_id
          : m.user_id === selectedEmployee.user_id
      );

    if (alreadyIn) return;

    const newMember =
      members.length && members[0].user
        ? { id: crypto.randomUUID(), user: selectedEmployee }
        : selectedEmployee;

    const updatedMembers = [...members, newMember];

    setMembers(updatedMembers);
    setFormData((prev) => ({
      ...prev,
      members: updatedMembers,
    }));

    setSelectedMemberId("");
  };

  const handleRemoveMember = (idToRemove: string) => {
    const updatedMembers = members.filter((member) => {
      const memberId = member.user ? member.user.user_id : member.user_id;
      return memberId !== stringToInt(idToRemove);
    });

    setMembers(updatedMembers);
    setFormData((prev) => ({
      ...prev,
      members: updatedMembers,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if(formData.members.length === 0){
      toast.warning("Teams can not exist without members.");
    } else {
      const updatedTeam: Teams = {
        ...formData,
        members: members.map((m) => (m.user ? m.user.user_id : m.user_id)),
      };
      onUpdate(updatedTeam);
      onClose();
    }
  };

  const availableEmployees = employees.filter((emp) => {
    return !members.some((member) => {
      const memberId = member.user ? member.user.user_id : member.user_id;
      return memberId === emp.user_id;
    });
  });

  // ===== Render =====
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        type="button"
        aria-label="Close modal"
        className={modalOverlayClass}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className={`${modalShellClass} max-h-[calc(100vh-2rem)] w-[calc(100vw-1.5rem)] max-w-2xl overflow-hidden`}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        {/* Header */}
        <div className={`${modalHeaderClass} flex items-start justify-between gap-4`}>
          <div>
            <h2 className={modalTitleClass}>Edit Team</h2>
            <p className={modalSubtitleClass}>
              Update team details and manage members
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className={modalCloseButtonClass}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          {/* Body */}
          <div className={`${modalBodyClass} space-y-6 overflow-y-auto`}>
            {/* Team Info */}
            <header className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter team name"
                  className="w-full border_primary p-2 text-sm bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  className="w-full border_primary p-2 text-sm bg-white focus:outline-none"
                  rows={3}
                />
              </div>
            </header>

            {/* Members */}
            <div className="space-y-3 pt-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-md font-medium text-gray-700">
                  Team Members
                </h3>
                <Button
                  className="button_primary_lg w-full sm:w-auto"
                  type="button"
                  onClick={handleAddMember}
                  disabled={!selectedMemberId}
                >
                  Add Member
                </Button>
              </div>

              <Select
                value={selectedMemberId}
                onValueChange={(value) => setSelectedMemberId(value)}
              >
                <SelectTrigger className="w-full border_primary bg-white cursor-pointer">
                  <SelectValue placeholder="Select a Member" />
                </SelectTrigger>
                <SelectContent>
                  {availableEmployees.map((o) => (
                    <SelectItem
                      key={o.user_id}
                      value={String(o.user_id)}
                      className="cursor-pointer"
                    >
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-3 flex flex-wrap gap-2">
                {members.length === 0 ? (
                  <span className="text-sm text-gray-400">
                    No members added yet.
                  </span>
                ) : (
                  members.map((member) => {
                    const name = member.user ? member.user.name : member.name;
                    const id = member.user ? member.user.user_id : member.user_id;

                    return (
                      <span
                        key={id}
                        className="flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-2 text-sm"
                      >
                        <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                          {name.charAt(0)}
                        </span>
                        <span className="break-words">{name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(String(id))}
                          className="text-gray-500 hover:text-gray-700 ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })
                )}
              </div>
            </div>

            {/* Leader Selection */}
            <div className="py-4">
              <h3 className="text-md font-medium pb-4 text-gray-700">
                Team Leader
              </h3>
              <Select
                value={formData.leader_id ? String(formData.leader_id) : ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    leader_id: stringToInt(value),
                  }))
                }
              >
                <SelectTrigger className="w-full border_primary bg-white cursor-pointer">
                  <SelectValue placeholder={leaderName || "Select a Lead"} />
                </SelectTrigger>
                <SelectContent>
                  {members.map((o) => (
                    <SelectItem
                      key={o.user?.user_id ?? o.user_id}
                      value={String(o.user?.user_id ?? o.user_id)}
                    >
                      {o.user?.name ?? o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Footer */}
          <div className={`${modalFooterClass} flex justify-end gap-3`}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <Button
              className="button_primary_lg px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              type="submit"
            >
              Update Team
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
