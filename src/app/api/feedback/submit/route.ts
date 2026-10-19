import { proxyBackendRequest } from "../../_backend-proxy";

export async function POST(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/client-feedback/submit",
    forwardAuthorization: true,
    method: "POST",
  });
}
