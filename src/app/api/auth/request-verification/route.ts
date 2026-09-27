import { proxyBackendRequest } from "../../_backend-proxy";

export async function POST(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/user/request-verify-email",
    forwardAuthorization: true,
  });
}
