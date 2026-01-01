import { CookieManager } from "@/lib/cookieManager";
import { Team } from "../schemas/team";
const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getTeamsApi(): Promise<Team[]> {
    try {
        const token = CookieManager("get", "access-token");
        const response = await fetch(`${requestBaseUrl}/teams/get-all-teams`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        })

        if (!response.ok) {
            throw new Error("Failed to fetch teams")
        }

        const data = await response.json()
        return data.teams
    } catch (error) {
        throw new Error("Failed to fetch teams")
    }
}