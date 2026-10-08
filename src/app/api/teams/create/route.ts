import { proxyBackendRequest } from "../../_backend-proxy";

export async function POST(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/teams/create",
    forwardAuthorization: true,
    method: "POST",
  });
}
