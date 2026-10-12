import { proxyBackendRequest } from "../../_backend-proxy";

export async function POST(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/milestone/create",
    forwardAuthorization: true,
    method: "POST",
  });
}
