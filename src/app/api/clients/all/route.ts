import { proxyBackendRequest } from "../../_backend-proxy";

export async function GET(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/clients/get-all-clients",
    forwardAuthorization: true,
    method: "GET",
  });
}
