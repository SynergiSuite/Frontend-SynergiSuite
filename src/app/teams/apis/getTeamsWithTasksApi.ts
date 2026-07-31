import { CookieManager } from "@/lib/cookieManager";
import { Teams } from "../schemas/types";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface GetTeamsWithTasksResponse {
  data: Teams[];
  meta: PaginationMeta;
}

export const getTeamsWithTasksApi = async (
  page?: number,
  limit?: number
): Promise<GetTeamsWithTasksResponse> => {
  try {
    const accessToken = CookieManager("get", "access-token");
    const params = new URLSearchParams();
    if (page !== undefined && page !== null) {
      params.append("page", String(page));
    }
    if (limit !== undefined && limit !== null) {
      params.append("limit", String(limit));
    }

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const response = await fetch(
      `${requestBaseUrl}/teams/get-all-teams-with-tasks${queryString}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch teams with tasks: ${response.statusText}`);
    }

    const resJson: GetTeamsWithTasksResponse = await response.json();
    
    // Normalize data ensuring both members & teamMembers exist for component compatibility
    const normalizedData = (resJson.data || []).map((team) => ({
      ...team,
      members: team.members || team.teamMembers || [],
      teamMembers: team.teamMembers || team.members || [],
    }));

    return {
      data: normalizedData,
      meta: resJson.meta || {
        totalItems: normalizedData.length,
        itemCount: normalizedData.length,
        itemsPerPage: limit || 5,
        totalPages: 1,
        currentPage: page || 1,
      },
    };
  } catch (error) {
    console.error("Error fetching teams with tasks:", error);
    throw error;
  }
};
