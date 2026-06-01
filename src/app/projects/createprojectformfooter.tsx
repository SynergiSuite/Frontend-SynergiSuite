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
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:space-x-3 sm:gap-0">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-white/[0.08] bg-[#0a0826]/40 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-white/60 hover:text-white hover:bg-[#0a0826]/75 hover:border-white/[0.15] transition-all duration-300"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ${
          isSubmitDisabled
            ? "bg-white/[0.04] text-white/20 border border-white/[0.04] cursor-not-allowed"
            : "bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:shadow-[0_0_22px_rgba(82,113,255,0.4)] hover:scale-[1.02] active:scale-[0.98]"
        }`}
      >
        Create Project
      </button>
    </div>
  );
}

