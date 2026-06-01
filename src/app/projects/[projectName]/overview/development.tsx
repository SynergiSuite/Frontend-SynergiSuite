"use client";
import React from "react";

const DevelopmentPhase = ({ tasks }: any) => {
  return (
    <>
      <div className="bg-[#0a0826]/40 border border-white/[0.08] backdrop-blur-md rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all duration-300 hover:border-[#5271ff]/30">
        {/* Left Glowing Accent */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#5271ff] to-cyan-500" />
        
        <h2 className="text-white font-bold text-lg mb-4 tracking-tight">Development</h2>

        {tasks && tasks.length > 0 ? (
          tasks.map((task: any, index: number) => (
            <div key={index} className="bg-white/[0.02] border border-white/[0.04] p-3.5 mb-3 last:mb-0 flex justify-between items-center rounded-xl hover:bg-white/[0.04] transition-colors duration-200">
              <div>
                <p className="font-semibold text-sm text-white">{task.title}</p>
                <p className="text-xs text-white/40 font-medium mt-0.5">{task.owner}</p>
              </div>
              <div className="flex gap-2 text-xs">
                {task.priority && (
                  <span className="bg-[#5271ff]/10 text-[#5271ff] border border-[#5271ff]/20 px-2.5 py-0.5 rounded-full font-bold">{task.priority}</span>
                )}
                {task.date && (
                  <span className="bg-white/[0.04] border border-white/[0.06] text-white/50 px-2.5 py-0.5 rounded-full font-medium">{task.date}</span>
                )}
                {task.status && (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">{task.status}</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-white/40 font-medium">No tasks in development.</p>
        )}
      </div>
    </>
  );
};

export default DevelopmentPhase;

