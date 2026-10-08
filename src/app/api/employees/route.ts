import { proxyBackendRequest } from "../_backend-proxy";

export async function GET(request: Request) {
  const query = new URL(request.url).search;

  return proxyBackendRequest(request, {
    backendPath: `/business/get-employees${query}`,
    forwardAuthorization: true,
    method: "GET",
  });
}
