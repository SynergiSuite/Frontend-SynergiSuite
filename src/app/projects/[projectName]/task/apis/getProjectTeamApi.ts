import { CookieManager } from "@/lib/cookieManager";
import { Team } from "@/app/projects/schemas/team";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getProjectTeams(): Promise<Team[]> {
    try {
        const token = CookieManager("get", "access-token");
        const projectId = CookieManager("get", "project-id");

        const response = await fetch(`${requestBaseUrl}/projects/get-all-project-teams`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id: projectId })
        })

        if (!response.ok) {
            throw new Error("Failed to fetch project teams")
        }

        const data = await response.json()
        return data
    } catch (error) {
        throw new Error("Failed to fetch project teams" + error)
    }
}