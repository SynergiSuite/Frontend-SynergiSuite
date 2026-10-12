import { proxyBackendRequest } from "../../_backend-proxy";

type TasksRouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(request: Request, context: TasksRouteContext) {
  const { projectId } = await context.params;

  return proxyBackendRequest(request, {
    backendPath: `/projects/get-all-tasks-for-projects?projectId=${projectId}`,
    forwardAuthorization: true,
    method: "GET",
  });
}
