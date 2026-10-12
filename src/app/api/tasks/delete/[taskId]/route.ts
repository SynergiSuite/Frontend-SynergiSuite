import { proxyBackendRequest } from "../../../_backend-proxy";

type TaskDeleteRouteContext = {
  params: Promise<{ taskId: string }>;
};

export async function DELETE(request: Request, context: TaskDeleteRouteContext) {
  const { taskId } = await context.params;

  return proxyBackendRequest(request, {
    backendPath: `/tasks/delete-task/${taskId}`,
    forwardAuthorization: true,
    method: "DELETE",
  });
}
