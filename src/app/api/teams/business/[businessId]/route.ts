import { proxyBackendRequest } from "../../../_backend-proxy";

type TeamsBusinessRouteContext = {
  params: Promise<{ businessId: string }>;
};

export async function GET(request: Request, context: TeamsBusinessRouteContext) {
  const { businessId } = await context.params;

  return proxyBackendRequest(request, {
    backendPath: `/teams/business/${encodeURIComponent(businessId)}`,
    forwardAuthorization: true,
    method: "GET",
  });
}
