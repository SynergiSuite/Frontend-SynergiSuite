import React from "react";
import { Task } from "../task/schemas/task";
import { Calendar } from "lucide-react";

const UpcomingDeadlines = ({ deadlines }: { deadlines: Task[] }) => {
  const formatDate = (value?: string) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "-";
    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const sortedDeadlines = [...deadlines]
    .filter((a) => a.due_date) // filter out empty due dates
    .sort((a, b) => {
      const aTime = new Date(a.due_date).getTime();
      const bTime = new Date(b.due_date).getTime();
      if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;
      return aTime - bTime; // ascending so closest upcoming is first
    })
    .slice(0, 4);

  return (
    <>
      <div className="bg-[#0a0826]/40 border border-white/[0.08] backdrop-blur-md rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all duration-300 hover:border-[#5271ff]/30">
        {/* Left Glowing Accent */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#5271ff] to-[#3a4ec4]" />
        
        <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-4">
          Upcoming Deadlines
        </h3>
        
        {sortedDeadlines.length === 0 ? (
          <p className="text-xs text-white/40 font-medium">No upcoming deadlines.</p>
        ) : (
          <div className="space-y-3">
            {sortedDeadlines.map((item: Task, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 text-xs border-b border-white/[0.04] pb-2.5 last:border-0 last:pb-0 group"
              >
                <span className="min-w-0 truncate text-white/80 font-medium transition-colors duration-200 group-hover:text-white">
                  {item.title}
                </span>
                
                <span className="shrink-0 flex items-center gap-1.5 bg-[#5271ff]/10 text-[#5271ff] border border-[#5271ff]/20 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-[0_0_8px_rgba(82,113,255,0.1)]">
                  <Calendar className="w-3 h-3" />
                  {formatDate(item.due_date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UpcomingDeadlines;

