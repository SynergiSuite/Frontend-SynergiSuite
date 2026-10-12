export interface TaskAssignee {
  user_id: number;
  name: string;
  email: string;
}

export interface TaskTeam {
  id: string;
  name: string;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "review" | "completed" | "on_hold" | "blocked" | string;
  priority?: "low" | "medium" | "high" | "urgent" | "critical" | string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  assignee?: TaskAssignee | null;
  teams?: TaskTeam[];
  milestone?: {
    id: string;
    name: string;
  } | null;
}