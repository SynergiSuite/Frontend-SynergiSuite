import React from "react";
import { Task } from "../task/schemas/task";

const UpcomingDeadlines = ({ deadlines }: { deadlines: Task[] }) => {
  const formatDate = (value?: string) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "-";
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const sortedDeadlines = [...deadlines]
    .sort((a, b) => {
      const aTime = new Date(a.due_date).getTime();
      const bTime = new Date(b.due_date).getTime();
      if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;
      return bTime - aTime;
    })
    .slice(0, 4);

  return (
    <>
      <div className="overview-card p-4">
        <h3 className="font-semibold mb-2">Upcoming Deadlines</h3>
        {sortedDeadlines.map((item: Task, index: number) => (
          <div
            key={index}
            className="mb-2 flex items-center justify-between gap-2 text-sm"
          >
            <span className="min-w-0 truncate text-slate-800">
              {item.title}
            </span>
            <span className="shrink-0 text-xs text-slate-500">
              {formatDate(item.due_date)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default UpcomingDeadlines;
