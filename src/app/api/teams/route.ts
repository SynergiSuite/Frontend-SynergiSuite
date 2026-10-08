import { proxyBackendRequest } from "../_backend-proxy";

export async function GET(request: Request) {
  const query = new URL(request.url).search;

  return proxyBackendRequest(request, {
    backendPath: `/teams/get-all-teams-with-tasks${query}`,
    forwardAuthorization: true,
    method: "GET",
  });
}
