import { CookieManager } from "@/lib/cookieManager";


const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function CreateNewMilestone(payload: any) {
    try {
        const token = await CookieManager("get", "access-token");
        const response = await fetch(`${requestBaseUrl}/milestone/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            throw new Error("Failed to create new milestone");
        }

        const data = await response.json();
        return data.milestone;
    } catch (error) {
        console.error("Error creating new milestone:", error);
        throw error;
    }
    
}