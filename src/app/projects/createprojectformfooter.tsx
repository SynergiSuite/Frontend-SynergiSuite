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
    <div className="flex flex-col-reverse gap-3 border-t pt-3 sm:flex-row sm:justify-end sm:space-x-3 sm:gap-0">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className={`rounded-md px-4 py-2 text-white transition ${
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
