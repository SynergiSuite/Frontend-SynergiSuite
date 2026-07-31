import { CookieManager } from "@/lib/cookieManager";
import { UIEmployee } from "../schemas/employee";
import {
  Response,
  MainPageData,
  EmployeeApiRecord,
  PaginationMeta,
  Stats,
} from "../schemas/apiResponse";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export interface FetchEmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function fetchEmployeesData(
  params?: FetchEmployeesParams
): Promise<MainPageData> {
  const token = await CookieManager("get", "access-token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const queryParams = new URLSearchParams();
  if (params?.page !== undefined && params?.page !== null) {
    queryParams.append("page", String(params.page));
  }
  if (params?.limit !== undefined && params?.limit !== null) {
    queryParams.append("limit", String(params.limit));
  }
  if (params?.search && params.search.trim() !== "") {
    queryParams.append("search", params.search.trim());
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  const res = await fetch(`${requestBaseUrl}/business/get-employees${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`Failed to fetch employees: ${res.status} ${text}`);
    throw new Error(`HTTP ${res.status} ${text}`);
  }

  const data: Response = await res.json();

  // Handle backend responses: data array vs nested employees
  const rawData = data?.data;
  const employeesRoot = data?.employees;

  const employeesArray: EmployeeApiRecord[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(employeesRoot)
    ? employeesRoot
    : Array.isArray((employeesRoot as any)?.employees)
    ? (employeesRoot as any).employees
    : [];

  const employees: UIEmployee[] = employeesArray.map((emp, index) => ({
    id: emp?.user_id ?? (emp as any)?.user?.user_id ?? (emp as any)?.id ?? index,
    name: emp?.name || (emp as any)?.user?.name || "Unknown",
    role: emp?.role?.name || (emp as any)?.role || "N/A",
    department: emp?.business?.name || "Unknown",
    status: (emp as any)?.isExpired === false ? "Active" : "Active",
  }));

  const meta: PaginationMeta = data?.meta || {
    totalItems: employees.length,
    itemCount: employees.length,
    itemsPerPage: params?.limit || 5,
    totalPages: Math.ceil(employees.length / (params?.limit || 5)) || 1,
    currentPage: params?.page || 1,
  };

  const stats: Stats = {
    totalEmployees: meta.totalItems,
    activeEmployees: meta.totalItems,
    totalNewReg: data?.statistics?.registrationCount ?? data?.registrationCount ?? 0,
    totalNewProj: data?.statistics?.newProjectsThisMonth ?? data?.newProjectsThisMonth ?? 0,
    totalProjects: data?.statistics?.projectCount ?? data?.projectCount ?? 0,
  };

  return {
    employees,
    stats,
    meta,
  };
}
