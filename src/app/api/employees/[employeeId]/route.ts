import { NextResponse } from "next/server";

import { proxyBackendRequest } from "../../_backend-proxy";

type EmployeeRouteContext = {
  params: Promise<{ employeeId: string }>;
};

async function getBackendPath(context: EmployeeRouteContext) {
  const { employeeId } = await context.params;

  if (!/^\d+$/.test(employeeId)) {
    return null;
  }

  return `/business/employees/${employeeId}`;
}

export async function GET(request: Request, context: EmployeeRouteContext) {
  const backendPath = await getBackendPath(context);

  if (!backendPath) {
    return NextResponse.json({ message: "Invalid employee ID." }, { status: 400 });
  }

  return proxyBackendRequest(request, {
    backendPath,
    forwardAuthorization: true,
    method: "GET",
  });
}

export async function POST(request: Request, context: EmployeeRouteContext) {
  const backendPath = await getBackendPath(context);

  if (!backendPath) {
    return NextResponse.json({ message: "Invalid employee ID." }, { status: 400 });
  }

  return proxyBackendRequest(request, {
    backendPath,
    forwardAuthorization: true,
  });
}

export async function DELETE(request: Request, context: EmployeeRouteContext) {
  const backendPath = await getBackendPath(context);

  if (!backendPath) {
    return NextResponse.json({ message: "Invalid employee ID." }, { status: 400 });
  }

  return proxyBackendRequest(request, {
    backendPath,
    forwardAuthorization: true,
    method: "DELETE",
  });
}
