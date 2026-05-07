import { CookieManager } from "@/lib/cookieManager";


const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function GetProjectDetails(projectName: string) {
    try {
        const token = await CookieManager("get", "access-token");
        const response = await fetch(`${requestBaseUrl}/projects/get-project-details?projectName=${projectName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })

        if (!response.ok) {
            throw new Error("Failed to get project details");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting project details:", error);
        throw error;
    }
    
}