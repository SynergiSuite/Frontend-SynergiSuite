import { proxyBackendRequest } from "../../../_backend-proxy";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyBackendRequest(request, {
    backendPath: `/clients/edit-client/${id}`,
    forwardAuthorization: true,
    method: "POST",
  });
}
