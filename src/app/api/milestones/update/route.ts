import { proxyBackendRequest } from "../../_backend-proxy";

export async function POST(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/milestone/update-milestone",
    forwardAuthorization: true,
    method: "POST",
  });
}
