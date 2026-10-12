import { proxyBackendRequest } from "../../_backend-proxy";

type MilestoneRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: MilestoneRouteContext) {
  const { id } = await context.params;

  return proxyBackendRequest(request, {
    backendPath: `/milestone/${id}`,
    forwardAuthorization: true,
    method: "GET",
  });
}

export async function DELETE(request: Request, context: MilestoneRouteContext) {
  const { id } = await context.params;

  return proxyBackendRequest(request, {
    backendPath: `/milestone/${id}`,
    forwardAuthorization: true,
    method: "DELETE",
  });
}
