import { CookieManager } from "@/lib/cookieManager";

export interface TeamMemberItem {
  user_id: number;
  name: string;
  email: string;
  role: string | null;
}

export interface TeamItem {
  id: string;
  name: string;
  description: string | null;
  leader: TeamMemberItem | null;
  members: TeamMemberItem[];
  member_count: number;
}

export interface AggregateMemberItem extends TeamMemberItem {
  teams: Array<{
    id: string;
    name: string;
    is_leader: boolean;
  }>;
}

export interface BusinessTeamsAndMembersData {
  business_id: number;
  total_teams: number;
  total_members: number;
  teams: TeamItem[];
  all_members: AggregateMemberItem[];
}

export interface BusinessTeamsAndMembersResponse {
  data: BusinessTeamsAndMembersData;
}

export async function getBusinessTeamsWithMembersApi(
  businessId?: number | string
): Promise<BusinessTeamsAndMembersData | null> {
  try {
    const token = await CookieManager("get", "access-token");
    if (!token) return null;

    const rawCookieBusinessId =
      (await CookieManager("get", "business-id")) ||
      (await CookieManager("get", "business_id"));
    const resolvedId = businessId ?? rawCookieBusinessId;

    if (!resolvedId) {
      console.warn("No business_id available for getBusinessTeamsWithMembersApi");
      return null;
    }

    const response = await fetch(`/api/teams/business/${encodeURIComponent(String(resolvedId))}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 204) {
        return null;
      }
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Failed to fetch business teams (${response.status})`
      );
    }

    const json = await response.json().catch(() => null);
    const data: BusinessTeamsAndMembersData | undefined = json?.data ?? json;

    return data && Array.isArray(data.teams) ? data : null;
  } catch (error) {
    console.error("Error fetching business teams and members:", error);
    return null;
  }
}
