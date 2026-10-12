import { proxyBackendRequest } from "../../_backend-proxy";

export async function GET(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/projects/get-all-projects-for-business",
    forwardAuthorization: true,
    method: "GET",
  });
}
