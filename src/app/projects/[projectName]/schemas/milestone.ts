import { Task } from "../task/schemas/task";

export interface Milestone {
  id: string;
  name: string;
  tasks: Task[];
  created_at: string;
  end_date: string;
}

export interface MilestoneUpdate {
  id: string;
  name: string;
  end_date: string;
  taskIds: string[];
}
