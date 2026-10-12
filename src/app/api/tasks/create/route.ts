import { proxyBackendRequest } from "../../_backend-proxy";

export async function POST(request: Request) {
  return proxyBackendRequest(request, {
    backendPath: "/projects/create-task",
    forwardAuthorization: true,
    method: "POST",
  });
}
