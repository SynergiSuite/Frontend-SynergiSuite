import React from "react";

type HeaderProps = {
  teamName: string;
  setTeamName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
};

export default function CreateTeamHeader({
  teamName,
  setTeamName,
  description,
  setDescription,
}: HeaderProps) {
  return (
  <>
    <header className="space-y-4">
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Team Name
        </label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
          className="w-full border rounded-md p-2 text-sm"
        />
      </div>

      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className="w-full border rounded-md p-2 text-sm"
          rows={3}
        />
      </div>
    </header>
  </>
  );
}




