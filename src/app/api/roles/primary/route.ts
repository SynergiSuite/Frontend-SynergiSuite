import { proxyBackendRequest } from "../../_backend-proxy";

export async function GET(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/roles/primary-roles",
    forwardAuthorization: true,
    method: "GET",
  });
}
