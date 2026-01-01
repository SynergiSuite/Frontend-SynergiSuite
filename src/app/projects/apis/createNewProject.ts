import { CookieManager } from "@/lib/cookieManager";


const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function CreateNewProject(obj: any) {
    try {
        const token = await CookieManager("get", "access-token");
        const response = await fetch(`${requestBaseUrl}/projects/create-new-project`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(obj)
        })

        if (!response.ok) {
            throw new Error("Failed to create project");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
    
}