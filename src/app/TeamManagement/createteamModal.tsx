"use client";
import React from "react";
import { X } from "lucide-react";

type CreateTeamModalProps = {
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function CreateTeamModal({ onClose, children, footer }: CreateTeamModalProps) {
  return (
  <>
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        
        
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Create New Team</h2>
            <p className="text-sm text-gray-500">
              Set up a new team and invite your colleagues
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {children}
        </div>

        
        <div className="border-t px-6 py-4">{footer}</div>
      </div>
    </div>
  </>
  );
}
