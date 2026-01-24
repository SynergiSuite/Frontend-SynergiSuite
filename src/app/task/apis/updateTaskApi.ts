import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function updateTaskApi(payload: any) {
    try {
        const token = CookieManager("get", "access-token");   
        const response = await fetch(`${requestBaseUrl}/projects/update-task`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        return await response.json();
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
}