import { proxyBackendRequest } from "../../_backend-proxy";

type ProjectRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: ProjectRouteContext) {
  const { id } = await context.params;

  return proxyBackendRequest(request, {
    backendPath: `/projects/${encodeURIComponent(id)}`,
    forwardAuthorization: true,
    method: "PATCH",
  });
}

export async function DELETE(request: Request, context: ProjectRouteContext) {
  const { id } = await context.params;

  return proxyBackendRequest(request, {
    backendPath: `/projects/${encodeURIComponent(id)}`,
    forwardAuthorization: true,
    method: "DELETE",
  });
}
