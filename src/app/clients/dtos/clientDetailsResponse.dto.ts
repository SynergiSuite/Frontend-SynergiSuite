export type ClientProjectTask = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority?: string | null;
  due_date?: string | null;
  dueDateParsed?: string | null;
  isUpcoming?: boolean;
  isOverdue?: boolean;
  daysRemaining?: number | null;
  milestoneId?: string | null;
  milestoneName?: string | null;
  assignee?: {
    userId?: string | number;
    name: string;
    email: string;
  } | null;
  teams?: Array<{
    id: string;
    name: string;
  }>;
};

export type ClientProjectMilestone = {
  id: string;
  name: string;
  end_date: string;
  endDateParsed?: string | null;
  isUpcoming?: boolean;
  isOverdue?: boolean;
  daysRemaining?: number | null;
  tasksCount?: number;
  completedTasksCount?: number;
  tasks?: Array<{
    id: string;
    title: string;
    status: string;
    priority?: string;
    due_date?: string;
  }>;
};

export type ClientProject = {
  id: string;
  name: string;
  description?: string | null;
  status: number | string;
  duration?: string;
  created_at?: string;
  updated_at?: string;
  teams?: Array<{
    id: string;
    name: string;
    leader?: {
      userId?: string | number;
      name: string;
      email: string;
    } | null;
  }>;
  milestones?: ClientProjectMilestone[];
  tasks?: ClientProjectTask[];
};

export type ClientFeedbackReply = {
  id: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    userId?: string | number;
    name?: string;
    email?: string;
  } | null;
  replies?: ClientFeedbackReply[];
};

export type ClientFeedbackItem = {
  id: string;
  titleOfFeedback?: string;
  feedback?: string;
  feedbackType?: string;
  status?: string;
  starRating?: number | null;
  createdAt?: string;
  createdBy?: {
    userId?: string | number;
    name: string;
    email: string;
  } | null;
  replies?: ClientFeedbackReply[];
};

export type ClientDeadlineItem = {
  type: "task" | "milestone";
  id: string;
  title: string;
  dueDate?: string;
  dueDateParsed?: string | null;
  daysRemaining?: number | null;
  status?: string;
  priority?: string;
  projectId?: string;
  projectName?: string;
};

export type ClientDetailsResponseDto = {
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    company?: string;
    priority?: number;
    paymentType?: string;
    amount?: number;
    created_at?: string;
    updated_at?: string;
    business?: {
      business_id: string | number;
      name: string;
    } | null;
  };
  summary: {
    totalProjects: number;
    totalMilestones: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks?: number;
    totalFeedbacks?: number;
    feedbacksByStatus?: Record<string, number>;
    averageFeedbackRating?: number | null;
  };
  projects?: ClientProject[];
  feedbacks?: ClientFeedbackItem[];
  allUpcomingDeadlines?: ClientDeadlineItem[];
};
