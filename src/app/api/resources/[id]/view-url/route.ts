import { proxyBackendRequest } from "../../../_backend-proxy";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyBackendRequest(request, {
    backendPath: `/resources/${id}/view-url`,
    forwardAuthorization: true,
    method: "GET",
  });
}
