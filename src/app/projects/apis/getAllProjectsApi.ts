import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export interface AllProjectRecord {
  id: string;
  name: string;
  status: number;
  duration: string;
  description?: string;
}

export interface GetAllProjectsResponse {
  data: AllProjectRecord[];
}

export async function getAllProjectsApi(): Promise<AllProjectRecord[]> {
  const token = await CookieManager("get", "access-token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(
    `${requestBaseUrl}/projects/get-all-projects-for-business`,
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
    throw new Error(
      text || `Failed to fetch all projects: ${response.statusText}`
    );
  }

  const resJson = await response.json();
  const projectsList: AllProjectRecord[] = Array.isArray(resJson?.data)
    ? resJson.data
    : Array.isArray(resJson)
    ? resJson
    : Array.isArray(resJson?.projects)
    ? resJson.projects
    : [];

  return projectsList;
}
