import { CookieManager } from "@/lib/cookieManager";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const editTeams = async (obj: any) => {
  const token = CookieManager("get", "access-token");
  const response = await fetch(`${requestBaseUrl}/projects/update-project-teams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(obj),
  });
  return response;
};

export default editTeams;