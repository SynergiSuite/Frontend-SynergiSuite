"use client";
import React from "react";

const ActivityFeed = ({ activities }: any) => {
  return (
    <>
      <div className="bg-[#0a0826]/40 border border-white/[0.08] backdrop-blur-md rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all duration-300 hover:border-[#5271ff]/30">
        {/* Left Glowing Accent */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#5271ff] to-[#3a4ec4]" />

        <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-4">
          Activity Feed
        </h3>

        <div className="relative pl-5 space-y-4">
          {/* Vertical Timeline Track */}
          <div className="absolute left-[5px] top-1.5 bottom-1.5 w-[2px] bg-white/[0.06]" />

          {activities.map((item: string, index: number) => {
            // Quick word parsing for styling first 2 words as bold/white
            const words = item.split(" ");
            const userName = words.slice(0, 2).join(" ");
            const actionText = words.slice(2).join(" ");

            return (
              <div key={index} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[23px] top-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-[#5271ff] to-cyan-400 border border-white/20 group-hover:scale-125 transition-transform duration-200 shadow-[0_0_8px_#5271ff]" />
                
                <p className="text-xs leading-relaxed text-white/50">
                  <span className="text-white font-semibold transition-colors duration-200 group-hover:text-[#5271ff]">{userName}</span>{" "}
                  {actionText}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ActivityFeed;

