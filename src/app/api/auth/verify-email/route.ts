import { proxyBackendRequest } from "../../_backend-proxy";

export async function PATCH(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/auth/verify-email",
    forwardAuthorization: true,
    method: "PATCH",
  });
}
