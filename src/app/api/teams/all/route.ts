import { proxyBackendRequest } from "../../_backend-proxy";

export async function GET(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/teams/get-all-teams",
    forwardAuthorization: true,
    method: "GET",
  });
}
