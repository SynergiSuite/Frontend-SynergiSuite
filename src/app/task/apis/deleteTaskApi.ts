import { CookieManager } from "@/lib/cookieManager";

const requsetBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function deleteTaskApi(taskId: string) {
    try {
        const token = CookieManager("get", "access-token");
        const response = await fetch(`${requsetBaseUrl}/projects/delete-task/${taskId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        if (!response.ok) {
            throw new Error("Failed to delete task");
        }

        return response.json();
    } catch (error) {
        throw error;
    }
}