import React from "react";

interface FooterProps {
  onCancel: () => void;
}

export default function ModalFooter({ onCancel }: FooterProps) {
  return (
    <>
    <div className="flex justify-end space-x-3 border-t pt-3">
      <button
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
      >
        Cancel
      </button>
      <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
        Create Project
      </button>
    </div>
    </>
  );
}
