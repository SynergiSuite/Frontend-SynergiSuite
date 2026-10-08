import { NextResponse } from "next/server";
import { proxyBackendRequest } from "../../_backend-proxy";

type TeamRouteContext = {
  params: Promise<{ teamId: string }>;
};

export async function POST(request: Request, context: TeamRouteContext) {
  const { teamId } = await context.params;

  if (!teamId) {
    return NextResponse.json({ message: "Invalid team ID." }, { status: 400 });
  }

  return proxyBackendRequest(request, {
    backendPath: `/teams/update-team/${teamId}`,
    forwardAuthorization: true,
    method: "POST",
  });
}

export async function DELETE(request: Request, context: TeamRouteContext) {
  const { teamId } = await context.params;

  if (!teamId) {
    return NextResponse.json({ message: "Invalid team ID." }, { status: 400 });
  }

  return proxyBackendRequest(request, {
    backendPath: `/teams/remove-team/${teamId}`,
    forwardAuthorization: true,
    method: "DELETE",
  });
}
