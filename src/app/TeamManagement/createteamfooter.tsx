"use client";
import React from "react";

type CreateTeamFooterProps = {
  onCancel: () => void;
  onCreate: () => void;
};

export default function CreateTeamFooter({ onCancel, onCreate }: CreateTeamFooterProps) {
  return (
   <>
     <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
      >
        Cancel
      </button>
      <button
        type="submit"
        onClick={onCreate}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Create Team
      </button>
     </div>
   </>
 );
}







