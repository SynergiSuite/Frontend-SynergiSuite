import { CookieManager } from "@/lib/cookieManager";

export type EditTeamsPayload = {
  project_id: string;
  team_id: string[];
};

const editTeams = async (obj: EditTeamsPayload) => {
  const token = await CookieManager("get", "access-token");
  const response = await fetch(`/api/projects/update-teams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token ?? ""}`,
    },
    body: JSON.stringify(obj),
  });
  return response;
};

export default editTeams;