"use client";
import React from "react";

interface LoaderCustomProps {
  text?: string;
}

export default function LoaderCustom({ text = "Loading..." }: LoaderCustomProps) {
  return (
    <div className="flex h-full w-full min-h-[300px] items-center justify-center flex-col gap-5 bg-transparent">
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border border-t-2 border-[#5271ff]/80 border-r-2 border-transparent animate-[spin_1.5s_linear_infinite]" />
        {/* Inner reverse spinning ring */}
        <div className="absolute inset-2 rounded-full border border-b-2 border-[#22d3ee]/80 border-l-2 border-transparent animate-[spin_1.2s_linear_infinite_reverse]" />
        {/* Core pulsing orb */}
        <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#5271ff] to-[#22d3ee] shadow-[0_0_20px_rgba(82,113,255,1)] animate-pulse" />
      </div>
      <p className="text-xs font-semibold tracking-[0.2em] text-[#5271ff]/70 uppercase animate-pulse text-center px-4">
        {text}
      </p>
    </div>
  );
}
