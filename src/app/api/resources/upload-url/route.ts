import { proxyBackendRequest } from "../../_backend-proxy";

export async function POST(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/resources/upload-url",
    forwardAuthorization: true,
    method: "POST",
  });
}
