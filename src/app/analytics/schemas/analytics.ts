export type EmployeeActivity = {
  activityId: string;
  taskId: string;
  taskName: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  score: number;
  createdAt: string;
};

export type EmployeeProductivity = {
  userId: number;
  userName: string;
  userEmail: string;
  productivityIndex: number;
  statusMovementScore: number;
  taskUpdateScore: number;
  statusChanges: number;
  taskUpdates: number;
  activities?: EmployeeActivity[];
};

export type TeamExecutionVelocity = {
  teamId: string;
  teamName: string;
  totalTasks: number;
  completedTasks: number;
  weightedCompletedScore: number;
  periodDays: number;
  executionVelocity: number;
};

export type QuarterlyGrowthMetrics = {
  newProjects: number;
  newClients: number;
  newEmployees: number;
  completedTasks: number;
  score: number;
};

export type QuarterlyGrowth = {
  currentRange?: { startDate: string; endDate: string };
  previousRange?: { startDate: string; endDate: string };
  current: QuarterlyGrowthMetrics;
  previous: QuarterlyGrowthMetrics;
  quarterlyGrowthIndex: number;
  growthChangePercent: number;
  weights?: Record<string, number>;
};

export type ClientAnalyticsItem = {
  clientId: string;
  clientName: string;
  clientEmail?: string;
  company?: string;
  paymentType?: string;
  amount?: number;
  totalProjects?: number;
  activeProjects?: number;
  completedProjects?: number;
  totalTasks?: number;
  completedTasks?: number;
  taskCompletionRate?: number;
  totalFeedback?: number;
  averageRating?: number;
  openFeedback?: number;
  inProgressFeedback?: number;
  inReviewFeedback?: number;
  resolvedFeedback?: number;
  rejectedFeedback?: number;
  feedbackWithReplies?: number;
  unansweredFeedback?: number;
  replyCount?: number;
  lastReplyAt?: string;
  responseRate?: number;
  resolvedFeedbackRate?: number;
  healthScore?: number;
};

export type ClientAnalyticsSummary = {
  totalClients?: number;
  totalPortfolioValue?: number;
  averageHealthScore?: number;
  totalFeedback?: number;
  totalReplies?: number;
  topClient?: Partial<ClientAnalyticsItem> | null;
  atRiskClients?: number;
};

// Employee Telemetry Analytics Schemas
export type EmployeeRole = {
  id?: number;
  name?: string;
};

export type EmployeeTeamItem = {
  teamId: string;
  teamName: string;
};

export type EmployeeProjectItem = {
  projectId: string;
  projectName: string;
  status?: number;
  duration?: string;
};

export type EmployeeAnalyticsData = {
  productivityIndex: number;
  statusMovementScore: number;
  taskUpdateScore: number;
  statusChanges: number;
  taskUpdates: number;
  totalActivities: number;
};

export type EmployeeTaskAnalytics = {
  totalAssignedTasks: number;
  completedTasks: number;
  tasksCompletedInRange: number;
  todoTasks: number;
  inProgressTasks: number;
  reviewTasks: number;
  onHoldTasks: number;
  blockedTasks: number;
  completionRate: number;
  weightedCompletedScore: number;
};

export type UpcomingDeadlineItem = {
  taskId: string;
  taskTitle: string;
  projectId: string;
  projectName: string;
  dueDate: string;
  status: string;
  priority: string;
};

export type EmployeeDeadlineAnalytics = {
  totalTasksWithDeadline: number;
  overdueTasks: number;
  upcomingDeadlines: UpcomingDeadlineItem[];
};

export type EmployeeMeetingAnalytics = {
  totalCalls: number;
  callsStarted: number;
  callsReceived: number;
  endedCalls: number;
  missedCalls: number;
  rejectedCalls: number;
  totalMeetingMinutes: number;
};

export type EmployeeCollaborationAnalytics = {
  messagesSent: number;
};

export type EmployeeRecentActivity = {
  activityId: string;
  action?: string;
  module?: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  score?: number;
  createdAt?: string;
};

export type EmployeeTelemetryItem = {
  userId: number;
  userName: string;
  userEmail: string;
  role?: EmployeeRole;
  teams?: EmployeeTeamItem[];
  projects?: EmployeeProjectItem[];
  analytics?: EmployeeAnalyticsData;
  taskAnalytics?: EmployeeTaskAnalytics;
  deadlineAnalytics?: EmployeeDeadlineAnalytics;
  meetingAnalytics?: EmployeeMeetingAnalytics;
  collaborationAnalytics?: EmployeeCollaborationAnalytics;
  recentActivities?: EmployeeRecentActivity[];
};

export type EmployeeTelemetrySummary = {
  totalEmployees?: number;
  averageProductivityIndex?: number;
  totalAssignedTasks?: number;
  completedTasks?: number;
  averageTaskCompletionRate?: number;
  totalOverdueTasks?: number;
  totalMessagesSent?: number;
  totalCalls?: number;
  topEmployee?: Partial<EmployeeTelemetryItem> | null;
};

export type EmployeeTelemetryResponse = {
  range?: { startDate?: string; endDate?: string };
  summary?: EmployeeTelemetrySummary;
  employees: EmployeeTelemetryItem[];
};

export type KpiOverview = {
  employeeProductivity?: {
    totalEmployees: number;
    averageProductivityIndex: number;
    topEmployee: EmployeeProductivity | null;
  };
  teamExecutionVelocity?: {
    totalTeams: number;
    averageExecutionVelocity: number;
    topTeam: TeamExecutionVelocity | null;
  };
  quarterlyGrowth?: {
    quarterlyGrowthIndex: number;
    growthChangePercent: number;
    currentScore: number;
    previousScore: number;
  };
};

export type AnalyticsData = {
  kpiOverview?: KpiOverview;
  employeeProductivity?: {
    range?: { startDate: string; endDate: string };
    weights?: Record<string, number>;
    employees?: EmployeeProductivity[];
  };
  teamExecutionVelocity?: {
    range?: { startDate: string; endDate: string };
    weights?: Record<string, number>;
    teams?: TeamExecutionVelocity[];
  };
  quarterlyGrowth?: QuarterlyGrowth;
  clients?: ClientAnalyticsItem[];
  summary?: ClientAnalyticsSummary;
  range?: Record<string, any>;
};

export type AnalyticsIndexesResponse = {
  source: "cache" | "calculated";
  calculatedAt: string;
  recordId: string;
  data: AnalyticsData;
};
