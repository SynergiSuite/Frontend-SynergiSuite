import React from "react";
import { Building2, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <div className="text-center space-y-3 mb-6">
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#5271ff] to-[#3a4ec4] shadow-[0_0_25px_rgba(82,113,255,0.4)] border border-white/20 mx-auto">
        <Building2 className="h-7 w-7 text-white" />
      </div>

      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#5271ff]/15 border border-[#5271ff]/30 px-3 py-0.5 text-[11px] font-bold text-[#5271ff]">
          <Sparkles className="h-3 w-3" /> Organization Onboarding
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          SynergiSuite
        </h1>
        <p className="text-xs text-white/50 font-medium">
          Register a new organization or connect to an existing business workspace.
        </p>
      </div>
    </div>
  );
}