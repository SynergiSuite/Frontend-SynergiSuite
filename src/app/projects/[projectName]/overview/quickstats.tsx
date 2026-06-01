"use client";
import React from "react";
import { CheckCircle2, PlayCircle, AlertCircle, ListTodo, Layers } from "lucide-react";

const QuickStats = ({ stats }: any) => {
  return (
    <>
      <div className="bg-[#0a0826]/40 border border-white/[0.08] backdrop-blur-md rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all duration-300 hover:border-[#5271ff]/30">
        {/* Left Glowing Accent */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#5271ff] to-cyan-400" />
        
        <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-4">
          Quick Stats
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* In Progress */}
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 flex flex-col justify-between hover:bg-white/[0.04] transition-colors duration-200">
            <div className="flex items-center justify-between text-[11px] text-white/50 mb-1 font-medium">
              <span>In Progress</span>
              <PlayCircle className="w-3.5 h-3.5 text-[#5271ff]" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">{stats.inProgress}</span>
          </div>

          {/* Completed */}
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 flex flex-col justify-between hover:bg-white/[0.04] transition-colors duration-200">
            <div className="flex items-center justify-between text-[11px] text-white/50 mb-1 font-medium">
              <span>Completed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">{stats.completed}</span>
          </div>

          {/* Todo */}
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 flex flex-col justify-between hover:bg-white/[0.04] transition-colors duration-200">
            <div className="flex items-center justify-between text-[11px] text-white/50 mb-1 font-medium">
              <span>Todo</span>
              <ListTodo className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">{stats.todo}</span>
          </div>

          {/* Blocked */}
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 flex flex-col justify-between hover:bg-white/[0.04] transition-colors duration-200">
            <div className="flex items-center justify-between text-[11px] text-white/50 mb-1 font-medium">
              <span>Blocked</span>
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">{stats.blocked}</span>
          </div>
        </div>

        {/* Total Footer Row */}
        <div className="border-t border-white/[0.06] pt-3.5 flex items-center justify-between text-xs font-medium">
          <span className="text-white/40 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#5271ff]/80" /> Total Tasks
          </span>
          <span className="text-white font-bold text-xs bg-white/[0.06] px-2 py-0.5 rounded-md border border-white/[0.04]">
            {stats.total}
          </span>
        </div>
      </div>
    </>
  );
};

export default QuickStats;

