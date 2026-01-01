import React from "react";

interface FooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitDisabled?: boolean;
}

export default function ModalFooter({
  onCancel,
  onSubmit,
  isSubmitDisabled = false,
}: FooterProps) {
  return (
    <div className="flex justify-end space-x-3 border-t pt-3">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className={`px-4 py-2 rounded-md text-white transition ${
          isSubmitDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        Create Project
      </button>
    </div>
  );
}
