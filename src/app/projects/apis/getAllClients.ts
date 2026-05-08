import { CookieManager } from "@/lib/cookieManager";
import { GetAllClientsResponseDto } from "@/app/clients/dtos/getAllClientsResponse.dto";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getClientsApi(): Promise<GetAllClientsResponseDto[]> {
    try {
        const token = await CookieManager("get", "access-token");
        const response = await fetch(`${requestBaseUrl}/clients/get-all-clients`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        if (!response.ok) {
            throw new Error("Failed to fetch clients");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}
