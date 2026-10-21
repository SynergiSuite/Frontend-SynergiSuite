import { proxyBackendRequest } from "../_backend-proxy";

export async function GET(request: Request) {
  const query = new URL(request.url).search;

  return proxyBackendRequest(request, {
    backendPath: `/documents${query}`,
    forwardAuthorization: true,
    method: "GET",
  });
}

export async function POST(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/documents",
    forwardAuthorization: true,
    method: "POST",
  });
}
