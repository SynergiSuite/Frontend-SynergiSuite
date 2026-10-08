import { NextResponse } from "next/server";
import { proxyBackendRequest } from "../../../_backend-proxy";

type ProgressRouteContext = {
  params: Promise<{ teamId: string }>;
};

export async function GET(request: Request, context: ProgressRouteContext) {
  const { teamId } = await context.params;

  if (!teamId) {
    return NextResponse.json({ message: "Invalid team ID." }, { status: 400 });
  }

  return proxyBackendRequest(request, {
    backendPath: `/teams/team-progress/${teamId}`,
    forwardAuthorization: true,
    method: "GET",
  });
}
