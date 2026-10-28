import { CookieManager } from "@/lib/cookieManager";
import { CollabGroup } from "../types";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";

interface RawGroupItem {
  id: string;
  name?: string;
  type: "group" | "direct" | "project" | "team" | "custom";
  groupType?: "team" | "project" | "custom";
  projectId?: string;
  members?: Array<{
    userId?: string | number;
    user?: {
      name?: string;
      email?: string;
    };
  }>;
  membersCount?: number;
  avatar?: string;
  description?: string;
}

export async function getCollabGroupsApi(): Promise<CollabGroup[]> {
  const token = await CookieManager("get", "access-token");

  const res = await fetch(`${baseUrl}/collab-station/groups`, {
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    throw new Error(errData?.message || "Failed to load chat groups");
  }

  const data = await res.json();
  const rawList: RawGroupItem[] = Array.isArray(data) ? data : data?.groups || [];

  return rawList.map((item) => {
    let groupType: "team" | "project" | "custom" | undefined;
    if (item.type === "project" || item.groupType === "project") {
      groupType = "project";
    } else if (item.type === "team" || item.groupType === "team") {
      groupType = "team";
    } else if (item.type === "custom" || item.groupType === "custom") {
      groupType = "custom";
    }

    const type = item.type === "direct" ? "direct" : "group";
    const displayName =
      item.name ||
      (item.type === "direct" && item.members?.[0]?.user?.name) ||
      "Untitled Chat";

    return {
      id: String(item.id),
      name: displayName,
      type,
      groupType,
      projectId: item.projectId,
      membersCount: item.membersCount ?? item.members?.length,
      avatar: item.avatar,
      description: item.description,
    };
  });
}
