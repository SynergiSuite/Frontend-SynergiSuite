import { proxyBackendRequest } from "../../../_backend-proxy";

type ProjectTeamsRouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(request: Request, context: ProjectTeamsRouteContext) {
  const { projectId } = await context.params;

  return proxyBackendRequest(request, {
    backendPath: `/projects/get-project-teams/${projectId}`,
    forwardAuthorization: true,
    method: "GET",
  });
}
