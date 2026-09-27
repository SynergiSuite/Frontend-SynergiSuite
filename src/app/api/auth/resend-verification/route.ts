import { proxyBackendRequest } from "../../_backend-proxy";

export async function POST(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/auth/request-email-verification",
    forwardAuthorization: true,
  });
}
