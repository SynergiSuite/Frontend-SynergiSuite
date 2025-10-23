import React, { useState } from "react";
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem 
} from "@/components/ui/select"
import { X } from "lucide-react";
import { Button } from "@/global/buttons";
import { Employee, Team } from "./schemas/types";
import { toast } from "sonner";


type CreateTeamModalProps = {
  onClose: () => void;
  onCreate: (team: Team) => void;
  employees: Employee[];
};

export default function CreateTeamModal({
  onClose,
  onCreate,
  employees,
}: CreateTeamModalProps) {
  
  
  // ====== States ======
  const [formData, setFormData] = useState<Team>({
    name: "",
    description: "",
    members: [],
    leader_id: 0,
  });  
  const [members, setMembers] = useState<Employee[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");

  // ======= Helper Functions =======
  const stringToInt = (str: string) => {
    const result = parseInt(str);
    return result;
  };

  // ====== Handlers ======
  const handleAddMember = () => {
    const selectedEmployee = employees.find((e) => e.user_id === stringToInt(selectedMemberId));
    if (selectedEmployee) {
      setMembers((prev) => [...prev, selectedEmployee]);

      setFormData((prev) => ({
        ...prev,
        members: [...(prev.members || []), selectedEmployee.user_id],
      }));
      
      setSelectedMemberId("");
    }
  };

  const handleRemoveMember = (idToRemove: string) => {
    setMembers((prev) => prev.filter((member) => member.user_id !== stringToInt(idToRemove)));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
    ...prev,
    [name]: value, 
    }));
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.members.length === 0) {
      toast.warning("No Member or Leader selected.");
    } else {
      onCreate(formData);
      onClose();
    }
    
  };

  const availableEmployees = employees.filter(
    (emp) => !members.some((member) => member.user_id === emp.user_id)
  );

  // ====== Render ======
  return (
    <>
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white/85 backdrop-blur-md rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Create New Team
            </h2>
            <p className="text-sm text-gray-500">
              Set up a new team and invite your colleagues
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Info */}
            <header className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
                <label htmlFor="description"className="block text-sm font-medium text-gray-700 mb-1">
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

            {/* Add Members */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-medium text-gray-700">
                  Team Members
                </h3>
                <Button
                  className="button_primary_lg"
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
                    <SelectItem key={o.user_id} value={String(o.user_id)} className="cursor-pointer">
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 mt-3">
                {members.length === 0 ? (
                  <span className="text-sm text-gray-400">
                    No members added yet.
                  </span>
                ) : (
                  members.map((member) => {
                    return (
                      <span
                        key={member.user_id}
                        className="flex items-center gap-2 bg-white px-3 py-2 rounded-full text-sm"
                      >
                        <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                          {member.name[0]}
                        </span>
                        <span>{member.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(String(member.user_id))}
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
                value={String(formData.leader_id)}
                onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                leader_id: stringToInt(value),
                              }))}
              >
                <SelectTrigger className="w-full border_primary bg-white cursor-pointer">
                  <SelectValue placeholder="Select a Lead" />
                </SelectTrigger>

                <SelectContent>
                  {members.map((o) => (
                    <SelectItem key={o.user_id} value={String(o.user_id)} className="cursor-pointer">
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Footer */}
            <div className="border-t pt-4 flex justify-end gap-3">
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
                Create Team
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div></>
  );
}

