import { proxyBackendRequest } from "@/app/api/_backend-proxy";

type MessageDeleteRouteContext = {
  params: Promise<{ messageId: string }>;
};

export async function DELETE(
  request: Request,
  context: MessageDeleteRouteContext
) {
  const { messageId } = await context.params;

  return proxyBackendRequest(request, {
    backendPath: `/chat/messages/${encodeURIComponent(messageId)}`,
    forwardAuthorization: true,
    method: "DELETE",
  });
}

