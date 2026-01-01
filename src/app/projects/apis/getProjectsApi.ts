import { CookieManager } from "@/lib/cookieManager";
import { Projects } from "../schemas/project";
const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getProjectsApi(): Promise<Projects[]> {
    try {
        const accessToken = await CookieManager("get", "access-token");
        const response = await fetch(`${requestBaseUrl}/projects/get-projects-by-business`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch projects");
          }

          const data = await response.json();
          return data;
    } catch (error) {
        throw error;
    }
}