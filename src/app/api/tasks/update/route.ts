import { proxyBackendRequest } from "../../_backend-proxy";

export async function POST(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/projects/update-task",
    forwardAuthorization: true,
    method: "POST",
  });
}
