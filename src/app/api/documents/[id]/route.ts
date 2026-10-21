import { proxyBackendRequest } from "../../_backend-proxy";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyBackendRequest(request, {
    backendPath: `/documents/${id}`,
    forwardAuthorization: true,
    method: "GET",
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyBackendRequest(request, {
    backendPath: `/documents/${id}`,
    forwardAuthorization: true,
    method: "DELETE",
  });
}
