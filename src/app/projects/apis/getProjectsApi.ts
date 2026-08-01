import { CookieManager } from "@/lib/cookieManager";
import { Projects } from "../schemas/project";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export interface ProjectsPaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface GetProjectsApiResponse {
  data: Projects[];
  meta?: ProjectsPaginationMeta;
}

export async function getProjectsApi(
  page?: number,
  search?: string,
  role?: string
): Promise<GetProjectsApiResponse> {
  try {
    const accessToken = await CookieManager("get", "access-token");
    if (!accessToken) {
      throw new Error("Authentication token not found");
    }

    const params = new URLSearchParams();
    if (page && page > 0) {
      params.append("page", String(page));
    }
    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    if (role && role.trim() !== "") {
      params.append("role", role.trim());
    }

    const queryString = params.toString();
    const url = `${requestBaseUrl}/projects/get-projects-by-business${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    const resData = await response.json();

    if (Array.isArray(resData?.data)) {
      return {
        data: resData.data,
        meta: resData.meta,
      };
    }

    if (Array.isArray(resData)) {
      return {
        data: resData,
      };
    }

    return {
      data: resData?.data?.projects || resData?.projects || [],
      meta: resData?.meta,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}