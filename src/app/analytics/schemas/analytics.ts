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
};

export type AnalyticsIndexesResponse = {
  source: "cache" | "calculated";
  calculatedAt: string;
  recordId: string;
  data: AnalyticsData;
};
