import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function createTaskApi(obj: any) {
    try {
        const token = CookieManager("get", "access-token");
        const projectId = CookieManager("get", "project-id");

        const response = await fetch(`${requestBaseUrl}/projects/create-task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({projectId, ...obj})
        })

        if (!response.ok) {
            throw new Error("Failed to create task")
        }

        const data = await response.json()
        return data
    } catch (error) {
        throw new Error("Failed to create task")
    }
}