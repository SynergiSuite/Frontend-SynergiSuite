import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export interface EmployeeDetailData {
  employee: {
    userId: number;
    name: string;
    email: string;
    salary: string | number | null;
    isVerified: boolean;
    registrationDate: string;
    role?: {
      id: number;
      name: string;
    } | null;
    business?: {
      businessId: number;
      name: string;
    } | null;
  };
  teams?: Array<{
    teamId: string;
    name: string;
    description: string;
    leader?: {
      userId: number;
      name: string;
      email: string;
    } | null;
    projects?: Array<{
      projectId: string;
      name: string;
      status: number;
      duration: string;
    }>;
    totalProjects?: number;
    totalTasks?: number;
    completedTasks?: number;
  }>;
  taskActivity?: {
    completedTasksFromActivity?: number;
    completedTaskActivities?: Array<{
      activityId: string;
      taskId: string;
      taskName: string;
      oldValue: string;
      newValue: string;
      createdAt: string;
    }>;
  };
  collaboration?: {
    messagesSent?: number;
    totalCalls?: number;
    callsStarted?: number;
    callsReceived?: number;
    endedCalls?: number;
    missedCalls?: number;
    rejectedCalls?: number;
    totalMeetingMinutes?: number;
  };
  recentActivities?: Array<{
    id: string;
    action: string;
    module: string;
    entityType: string;
    entityId: string;
    entityName: string;
    fieldChanged: string | null;
    oldValue: string | null;
    newValue: string | null;
    description: string;
    createdAt: string;
  }>;
}

export async function fetchEmployeeDetail(
  employeeId: number
): Promise<EmployeeDetailData> {
  const token = await CookieManager("get", "access-token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(
    `${requestBaseUrl}/business/employees/${employeeId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Failed to fetch employee detail for ID ${employeeId}`);
  }

  const data: EmployeeDetailData = await response.json();
  return data;
}
