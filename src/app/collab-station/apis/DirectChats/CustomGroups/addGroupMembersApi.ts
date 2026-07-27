import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export interface AddGroupMembersPayload {
  userId?: number;
  userIds?: number[];
  memberIds?: number[];
  members?: number[];
  role?: "admin" | "member";
}

export async function addGroupMembersApi(groupId: string, userIds: (string | number)[], role: "admin" | "member" = "member") {
  try {
    const token = await CookieManager("get", "access-token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const numericUserIds = userIds
      .map((id) => Number(id))
      .filter((id) => !isNaN(id));

    if (numericUserIds.length === 0) { 
      return { success: true };
    }

    const payload = {
      groupId: groupId,
      members: numericUserIds,
    };

    let response = await fetch(
      `${requestBaseUrl}/collab-station/groups/add-members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok && response.status === 404) {
      response = await fetch(
        `${requestBaseUrl}/collab-station/groups/${groupId}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = Array.isArray(errorData?.message)
        ? errorData.message.join(", ")
        : errorData?.message || `Failed to add group members (HTTP ${response.status})`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding group members:", error);
    throw error;
  }
}
