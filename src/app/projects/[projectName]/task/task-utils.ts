import { Task } from "./schemas/task";

export const TASK_STATUS_OPTIONS = [
  "todo",
  "in_progress",
  "review",
  "completed",
  "on_hold",
  "blocked",
];

export const formatTaskLabel = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const normalizeTaskStatus = (status: string) =>
  status.trim().toLowerCase().replace(/[\s-]+/g, "_");

export const getStatusBadgeStyle = (status?: string) => {
  const norm = normalizeTaskStatus(status || "");
  switch (norm) {
    case "completed":
      return "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "in_progress":
      return "border border-sky-500/30 bg-sky-500/10 text-sky-300";
    case "review":
      return "border border-purple-500/30 bg-purple-500/10 text-purple-300";
    case "blocked":
      return "border border-rose-500/30 bg-rose-500/10 text-rose-300";
    case "on_hold":
      return "border border-amber-500/30 bg-amber-500/10 text-amber-300";
    default:
      return "border border-[#5271ff]/30 bg-[#5271ff]/10 text-[#5271ff]";
  }
};

export const getPriorityBadgeStyle = (priority?: string) => {
  const p = (priority || "").toLowerCase();
  if (p === "urgent" || p === "critical") {
    return "border border-rose-500/30 bg-rose-500/10 text-rose-300";
  }
  if (p === "high") {
    return "border border-amber-500/30 bg-amber-500/10 text-amber-300";
  }
  if (p === "medium") {
    return "border border-sky-500/30 bg-sky-500/10 text-sky-300";
  }
  return "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
};

const isSameDay = (date: Date, other: Date) =>
  date.getFullYear() === other.getFullYear() &&
  date.getMonth() === other.getMonth() &&
  date.getDate() === other.getDate();

const isInThisWeek = (date: Date, today: Date) => {
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return date >= start && date <= end;
};

const isInThisMonth = (date: Date, today: Date) =>
  date.getFullYear() === today.getFullYear() &&
  date.getMonth() === today.getMonth();

type FilterTasksArgs = {
  tasks: Task[];
  searchQuery: string;
  statusFilter: string;
  dueFilter: string;
};

export const filterTasks = ({
  tasks,
  searchQuery,
  statusFilter,
  dueFilter,
}: FilterTasksArgs) => {
  const normalizedQuery = (searchQuery || "").toLowerCase();
  const normalizedStatus = (statusFilter || "all").toLowerCase();
  const normalizedDue = (dueFilter || "all").toLowerCase();
  const today = new Date();

  return tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(normalizedQuery) ||
      task.description.toLowerCase().includes(normalizedQuery);

    const matchesStatus =
      normalizedStatus === "all" ||
      normalizeTaskStatus(task.status) === normalizedStatus;

    if (!matchesSearch || !matchesStatus) {
      return false;
    }

    if (normalizedDue === "all") {
      return true;
    }

    const dueDate = new Date(`${task.due_date}T00:00:00`);
    if (normalizedDue === "today") {
      return isSameDay(dueDate, today);
    }
    if (normalizedDue === "this-week") {
      return isInThisWeek(dueDate, today);
    }
    if (normalizedDue === "this-month") {
      return isInThisMonth(dueDate, today);
    }

    return true;
  });
};
