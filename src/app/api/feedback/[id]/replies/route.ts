import { proxyBackendRequest } from "../../../_backend-proxy";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyBackendRequest(request, {
    backendPath: `/client-feedback/${id}/replies`,
    forwardAuthorization: true,
    method: "GET",
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyBackendRequest(request, {
    backendPath: `/client-feedback/${id}/replies`,
    forwardAuthorization: true,
    method: "POST",
  });
}
