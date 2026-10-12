import { Task } from "./schemas/task";

export const TASK_STATUS_OPTIONS = [
  "todo",
  "in_progress",
  "review",
  "on_hold",
  "blocked",
  "completed",
];

export const TASK_PRIORITY_OPTIONS = ["urgent", "high", "medium", "low"];

export const formatTaskLabel = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const normalizeTaskStatus = (status: string) =>
  status.trim().toLowerCase().replace(/[\s-]+/g, "_");

export const normalizeTaskPriority = (priority: string) =>
  (priority || "").trim().toLowerCase();

export interface StatusConfig {
  label: string;
  dotColor: string;
  badgeClass: string;
  borderClass: string;
  bgSubtle: string;
  headerBg: string;
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  todo: {
    label: "To Do",
    dotColor: "#94a3b8",
    badgeClass: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    borderClass: "border-slate-500/30",
    bgSubtle: "bg-slate-500/5",
    headerBg: "from-slate-500/20 to-slate-500/5",
  },
  in_progress: {
    label: "In Progress",
    dotColor: "#38bdf8",
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    borderClass: "border-sky-500/30",
    bgSubtle: "bg-sky-500/5",
    headerBg: "from-sky-500/20 to-sky-500/5",
  },
  review: {
    label: "In Review",
    dotColor: "#c084fc",
    badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    borderClass: "border-purple-500/30",
    bgSubtle: "bg-purple-500/5",
    headerBg: "from-purple-500/20 to-purple-500/5",
  },
  on_hold: {
    label: "On Hold",
    dotColor: "#fbbf24",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    borderClass: "border-amber-500/30",
    bgSubtle: "bg-amber-500/5",
    headerBg: "from-amber-500/20 to-amber-500/5",
  },
  blocked: {
    label: "Blocked",
    dotColor: "#f43f5e",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    borderClass: "border-rose-500/30",
    bgSubtle: "bg-rose-500/5",
    headerBg: "from-rose-500/20 to-rose-500/5",
  },
  completed: {
    label: "Completed",
    dotColor: "#34d399",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    borderClass: "border-emerald-500/30",
    bgSubtle: "bg-emerald-500/5",
    headerBg: "from-emerald-500/20 to-emerald-500/5",
  },
};

export const getStatusConfig = (status?: string): StatusConfig => {
  const norm = normalizeTaskStatus(status || "");
  return (
    STATUS_CONFIG[norm] || {
      label: formatTaskLabel(status || "To Do"),
      dotColor: "#94a3b8",
      badgeClass: "bg-slate-500/15 text-slate-300 border-slate-500/30",
      borderClass: "border-slate-500/30",
      bgSubtle: "bg-slate-500/5",
      headerBg: "from-slate-500/20 to-slate-500/5",
    }
  );
};

export const getStatusBadgeStyle = (status?: string) => {
  return getStatusConfig(status).badgeClass;
};

export interface PriorityConfig {
  label: string;
  flagColor: string;
  badgeClass: string;
  level: number;
}

export const PRIORITY_CONFIG: Record<string, PriorityConfig> = {
  urgent: {
    label: "Urgent",
    flagColor: "#f43f5e",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    level: 4,
  },
  critical: {
    label: "Urgent",
    flagColor: "#f43f5e",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    level: 4,
  },
  high: {
    label: "High",
    flagColor: "#fbbf24",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    level: 3,
  },
  medium: {
    label: "Medium",
    flagColor: "#38bdf8",
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    level: 2,
  },
  low: {
    label: "Low",
    flagColor: "#94a3b8",
    badgeClass: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    level: 1,
  },
};

export const getPriorityConfig = (priority?: string): PriorityConfig => {
  const norm = normalizeTaskPriority(priority || "");
  return (
    PRIORITY_CONFIG[norm] || {
      label: formatTaskLabel(priority || "Normal"),
      flagColor: "#94a3b8",
      badgeClass: "bg-slate-500/15 text-slate-300 border-slate-500/30",
      level: 0,
    }
  );
};

export const getPriorityBadgeStyle = (priority?: string) => {
  return getPriorityConfig(priority).badgeClass;
};

export const isSameDay = (date: Date, other: Date) =>
  date.getFullYear() === other.getFullYear() &&
  date.getMonth() === other.getMonth() &&
  date.getDate() === other.getDate();

export const isInThisWeek = (date: Date, today: Date) => {
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return date >= start && date <= end;
};

export const isInThisMonth = (date: Date, today: Date) =>
  date.getFullYear() === today.getFullYear() &&
  date.getMonth() === today.getMonth();

export const isOverdue = (dateString?: string, status?: string) => {
  if (!dateString || normalizeTaskStatus(status || "") === "completed") {
    return false;
  }
  try {
    const due = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  } catch {
    return false;
  }
};

export const isDueToday = (dateString?: string) => {
  if (!dateString) return false;
  try {
    const due = new Date(dateString);
    const today = new Date();
    return isSameDay(due, today);
  } catch {
    return false;
  }
};

export const formatDueDate = (dateString?: string) => {
  if (!dateString) return "No due date";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

type FilterTasksArgs = {
  tasks: Task[];
  searchQuery: string;
  statusFilter: string;
  dueFilter: string;
  priorityFilter?: string;
  assignmentFilter?: string;
};

export const filterTasks = ({
  tasks,
  searchQuery,
  statusFilter,
  dueFilter,
  priorityFilter = "all",
  assignmentFilter = "all",
}: FilterTasksArgs) => {
  const normalizedQuery = (searchQuery || "").toLowerCase().trim();
  const normalizedStatus = (statusFilter || "all").toLowerCase().trim();
  const normalizedDue = (dueFilter || "all").toLowerCase().trim();
  const normalizedPriority = (priorityFilter || "all").toLowerCase().trim();
  const normalizedAssignment = (assignmentFilter || "all").trim();
  const today = new Date();

  return tasks.filter((task) => {
    const matchesSearch =
      !normalizedQuery ||
      task.title.toLowerCase().includes(normalizedQuery) ||
      task.description?.toLowerCase().includes(normalizedQuery) ||
      task.teams?.some((t) => t.name.toLowerCase().includes(normalizedQuery)) ||
      task.assignee?.name.toLowerCase().includes(normalizedQuery) ||
      task.assignee?.email.toLowerCase().includes(normalizedQuery);

    const matchesStatus =
      normalizedStatus === "all" ||
      normalizeTaskStatus(task.status) === normalizedStatus;

    const matchesPriority =
      normalizedPriority === "all" ||
      normalizeTaskPriority(task.priority || "") === normalizedPriority;

    // Assignment filter: "all", "unassigned", "team:<teamId>", "user:<userId>"
    let matchesAssignment = true;
    if (normalizedAssignment !== "all") {
      if (normalizedAssignment === "unassigned") {
        matchesAssignment = !task.assignee && (!task.teams || task.teams.length === 0);
      } else if (normalizedAssignment.startsWith("team:")) {
        const teamId = normalizedAssignment.slice(5);
        matchesAssignment = Boolean(task.teams?.some((t) => t.id === teamId));
      } else if (normalizedAssignment.startsWith("user:")) {
        const userId = Number(normalizedAssignment.slice(5));
        matchesAssignment = task.assignee?.user_id === userId;
      }
    }

    if (!matchesSearch || !matchesStatus || !matchesPriority || !matchesAssignment) {
      return false;
    }

    if (normalizedDue === "all") {
      return true;
    }

    if (normalizedDue === "overdue") {
      return isOverdue(task.due_date, task.status);
    }

    if (!task.due_date) {
      return false;
    }

    const dueDate = new Date(`${task.due_date}T00:00:00`);
    if (isNaN(dueDate.getTime())) {
      return false;
    }

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
