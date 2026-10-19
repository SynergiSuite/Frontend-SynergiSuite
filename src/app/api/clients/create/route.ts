import { proxyBackendRequest } from "../../_backend-proxy";

export async function POST(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/clients/add-client",
    forwardAuthorization: true,
    method: "POST",
  });
}
