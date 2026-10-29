import { proxyBackendRequest } from "@/app/api/_backend-proxy";

type GroupChatDeleteRouteContext = {
  params: Promise<{ groupId: string }>;
};

export async function DELETE(
  request: Request,
  context: GroupChatDeleteRouteContext
) {
  const { groupId } = await context.params;

  return proxyBackendRequest(request, {
    backendPath: `/collab-station/groups/${encodeURIComponent(groupId)}/chat`,
    forwardAuthorization: true,
    method: "DELETE",
  });
}

