import { CookieManager } from "@/lib/cookieManager";
import type { Teams } from "../schemas/types";

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
  const accessToken = CookieManager("get", "access-token");
  if (!accessToken) {
    throw new Error("Authentication token not found");
  }

  const params = new URLSearchParams();
  if (page !== undefined && page !== null) {
    params.append("page", String(page));
  }
  if (limit !== undefined && limit !== null) {
    params.append("limit", String(limit));
  }

  const queryString = params.toString() ? `?${params.toString()}` : "";

  const response = await fetch(`/api/teams${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404 || response.status === 204) {
      return {
        data: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: limit || 5,
          totalPages: 1,
          currentPage: page || 1,
        },
      };
    }
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `Failed to fetch teams with tasks: ${response.statusText}`
    );
  }

  const resJson = await response.json().catch(() => null);
  const rawList = Array.isArray(resJson?.data)
    ? resJson.data
    : Array.isArray(resJson)
    ? resJson
    : Array.isArray(resJson?.teams)
    ? resJson.teams
    : [];

  // Normalize data ensuring both members & teamMembers exist for component compatibility
  const normalizedData = rawList.map((team: any) => ({
    ...team,
    members: team.members || team.teamMembers || [],
    teamMembers: team.teamMembers || team.members || [],
  }));

  return {
    data: normalizedData,
    meta: resJson?.meta || {
      totalItems: normalizedData.length,
      itemCount: normalizedData.length,
      itemsPerPage: limit || 5,
      totalPages: 1,
      currentPage: page || 1,
    },
  };
};
