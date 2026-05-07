import { CookieManager } from "@/lib/cookieManager"

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

export const getTeamsApi = async () => {
  try {
    const accessToken = CookieManager("get", "access-token")
    const response = await fetch(
      `${requestBaseUrl}/teams/get-all-teams`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching teams:", error)
    throw error
  }
}