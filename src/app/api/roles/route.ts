import { proxyBackendRequest } from "../_backend-proxy";

export async function GET(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/roles/get-all",
    forwardAuthorization: true,
    method: "GET",
  });
}
