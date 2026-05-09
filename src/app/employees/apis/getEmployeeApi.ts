import { CookieManager } from "@/lib/cookieManager";
import { UIEmployee } from "../schemas/employee";
import { Response, MainPageData, EmployeeApiRecord } from "../schemas/apiResponse";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function fetchEmployeesData(): Promise<MainPageData> {
    const token = CookieManager("get","access-token")
    if (!token) {
        throw new Error("Authentication token not found");
    }

    const res = await fetch(`${requestBaseUrl}/business/get-employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(`Failed to fetch employees: ${res.status} ${text}`);
        throw new Error(`HTTP ${res.status} ${text}`);
    }

    const data: Response = await res.json();
    const employeesRoot = data?.employees;
    const nestedEmployeesRoot = data?.data?.employees;

    // Normalize employee list shape
    const potentialLists = [
        Array.isArray(employeesRoot) ? employeesRoot : employeesRoot?.employees,
        employeesRoot,
        Array.isArray(nestedEmployeesRoot)
          ? nestedEmployeesRoot
          : nestedEmployeesRoot?.employees,
        nestedEmployeesRoot,
        Array.isArray(data) ? data : null,
    ];

    const employeesArray =
      (potentialLists.find((entry): entry is EmployeeApiRecord[] => Array.isArray(entry)) ??
        []) as EmployeeApiRecord[];

    const employees: UIEmployee[] = employeesArray.map((emp, index) => ({
        id: emp?.user_id ?? index,
        name: emp?.name || "Unknown",
        role: emp?.role?.name || "N/A",
        department: emp?.business?.name || "Unknown",
        status: emp?.isExpired === false ? "Active" : "Inactive",
    }));

    const activeEmployees = employees.filter(
        (e) => e.status === "Active"
    ).length;
    
    return {
      employees,
      stats: {
        totalEmployees: employees.length,
        activeEmployees,
        totalNewReg: data.registrationCount ?? 0,
        totalNewProj: data.newProjectsThisMonth ?? 0,
        totalProjects: data.projectCount ?? 0,
      },
    };
}
