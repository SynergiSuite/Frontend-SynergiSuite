import { CookieManager } from "@/lib/cookieManager";
import { Task } from "../schemas/task";
const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function fetchTaskApi(): Promise<Task[]> {
    try {
        const token = CookieManager("get", "access-token")
        const projectId = CookieManager("get", "project-id")

        const response = await fetch(`${requestBaseUrl}/projects/get-all-tasks-for-projects?projectId=${projectId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        })

        const data = await response.json()
        return data
    } catch (error) {
        throw new Error("Failed to fetch tasks")
    }
}